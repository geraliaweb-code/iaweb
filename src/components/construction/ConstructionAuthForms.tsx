"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, KeyRound, Loader2, LogIn, LogOut, Mail, UserPlus } from "lucide-react"
import { createConstructionBrowserAuthClient } from "@/lib/construction/auth-client"

type AuthMode = "login" | "register" | "password"

type ConstructionAuthFormsProps = {
  mode: AuthMode
}

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"

export function ConstructionAuthForm({ mode }: ConstructionAuthFormsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const supabase = createConstructionBrowserAuthClient()
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")

    try {
      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

        if (loginError) throw loginError

        router.push("/construction/dashboard")
        router.refresh()
        return
      }

      if (mode === "password") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/construction/account`,
        })

        if (resetError) throw resetError

        setMessage("Enviamos um link de recuperacao para o email indicado.")
        setIsSubmitting(false)
        return
      }

      const name = String(formData.get("name") ?? "").trim()
      const phone = String(formData.get("phone") ?? "").trim()
      const country = String(formData.get("country") ?? "Portugal")
      const userType = String(formData.get("userType") ?? "particular")
      const organizationName = String(formData.get("organizationName") ?? "").trim()
      const nif = String(formData.get("nif") ?? "").trim()
      const address = String(formData.get("address") ?? "").trim()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            country,
            user_type: userType,
          },
        },
      })

      if (signUpError) throw signUpError

      const bootstrap = await fetch("/api/construction/auth/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          country,
          userType,
          organization: userType === "empresa" ? { name: organizationName, nif, address, country } : null,
        }),
      })
      const bootstrapResult = (await bootstrap.json().catch(() => ({}))) as { error?: string }

      if (!bootstrap.ok) {
        throw new Error(bootstrapResult.error ?? "Conta criada, mas nao foi possivel preparar o perfil Construction.")
      }

      router.push(userType === "empresa" ? "/construction/organization" : "/construction/account")
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel concluir o pedido.")
      setIsSubmitting(false)
    }
  }

  const isRegister = mode === "register"
  const isPassword = mode === "password"
  const Icon = isRegister ? UserPlus : isPassword ? Mail : LogIn

  return (
    <section className="mx-auto w-full max-w-3xl py-10">
      <div className="iaweb-premium-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Construction Auth</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {isRegister ? "Criar conta" : isPassword ? "Recuperar password" : "Entrar"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {isRegister
                ? "Crie o perfil Construction para associar projetos a uma pessoa ou organizacao."
                : isPassword
                  ? "Receba um link seguro para recuperar o acesso."
                  : "Aceda ao dashboard Construction Intelligence."}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 grid gap-5">
          {isRegister ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Label label="Nome">
                <input name="name" required className={inputClass} placeholder="Nome completo" />
              </Label>
              <Label label="Telefone">
                <input name="phone" required className={inputClass} placeholder="+351 900 000 000" />
              </Label>
            </div>
          ) : null}

          <Label label="Email">
            <input name="email" type="email" required className={inputClass} placeholder="email@empresa.pt" />
          </Label>

          {!isPassword ? (
            <Label label="Password">
              <input name="password" type="password" required minLength={6} className={inputClass} placeholder="Minimo 6 caracteres" />
            </Label>
          ) : null}

          {isRegister ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <Label label="Pais">
                  <select name="country" required defaultValue="Portugal" className={inputClass}>
                    <option value="Portugal">Portugal</option>
                    <option value="França">Franca</option>
                    <option value="Espanha">Espanha</option>
                  </select>
                </Label>
                <Label label="Tipo de utilizador">
                  <select name="userType" required defaultValue="particular" className={inputClass}>
                    <option value="particular">Particular</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </Label>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  <p className="text-sm font-semibold text-white">Organizacao para empresas</p>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Label label="Organizacao">
                    <input name="organizationName" className={inputClass} placeholder="Nome da empresa" />
                  </Label>
                  <Label label="NIF">
                    <input name="nif" className={inputClass} placeholder="NIF ou VAT" />
                  </Label>
                  <div className="md:col-span-2">
                    <Label label="Morada">
                      <input name="address" className={inputClass} placeholder="Morada fiscal" />
                    </Label>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {message ? <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</p> : null}
          {error ? <p className="rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : isPassword ? <KeyRound className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
            {isRegister ? "Criar conta" : isPassword ? "Enviar link" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
          {mode !== "login" ? <Link href="/construction/login" className="hover:text-white">Ja tenho conta</Link> : null}
          {mode !== "register" ? <Link href="/construction/register" className="hover:text-white">Criar conta</Link> : null}
          {mode !== "password" ? <Link href="/construction/login?recover=1" className="hover:text-white">Recuperar password</Link> : null}
        </div>
      </div>
    </section>
  )
}

export function ConstructionLogoutButton() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function logout() {
    setIsSubmitting(true)
    const supabase = createConstructionBrowserAuthClient()
    await supabase.auth.signOut()
    router.push("/construction/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-70"
    >
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
      Logout
    </button>
  )
}

function Label({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  )
}
