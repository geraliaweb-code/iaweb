import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const outDir = "C:\\Users\\User\\iaweb-factory\\.codex-screenshots"
const port = 9334

await mkdir(outDir, { recursive: true })

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${outDir}\\chrome-profile-fr-only`,
  "--window-size=1536,1000",
  "http://localhost:3000/construction",
], { stdio: "ignore", detached: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function endpoint() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const tabs = await fetch(`http://127.0.0.1:${port}/json`).then((res) => res.json())
      const page = tabs.find((tab) => tab.type === "page")
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {
      await sleep(200)
    }
  }
  throw new Error("Chrome DevTools endpoint not available")
}

function createCdp(wsUrl) {
  const ws = new WebSocket(wsUrl)
  let nextId = 0
  const pending = new Map()

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    }
  }

  function send(method, params = {}) {
    const id = ++nextId
    ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  }

  return new Promise((resolve, reject) => {
    ws.onopen = () => resolve({ send, close: () => ws.close() })
    ws.onerror = () => reject(new Error("WebSocket connection failed"))
  })
}

async function captureLocale(cdp, language, country, fileName) {
  await cdp.send("Page.navigate", { url: "http://localhost:3000/construction" })
  await sleep(1600)
  await cdp.send("Runtime.evaluate", {
    expression: `
      localStorage.setItem("iaweb-construction-language", "${language}");
      localStorage.setItem("iaweb-construction-technical-country", "${country}");
      document.cookie = "iaweb-construction-cookies=accepted; path=/; max-age=31536000; samesite=lax";
    `,
  })
  await cdp.send("Page.navigate", { url: "http://localhost:3000/construction" })
  await sleep(2600)
  const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false })
  await writeFile(`${outDir}\\${fileName}`, Buffer.from(screenshot.data, "base64"))
}

try {
  const cdp = await createCdp(await endpoint())
  await cdp.send("Page.enable")
  await captureLocale(cdp, "fr", "portugal", "construction-home-fr.png")
  cdp.close()
} finally {
  try {
    process.kill(-chrome.pid)
  } catch {
    chrome.kill()
  }
}
