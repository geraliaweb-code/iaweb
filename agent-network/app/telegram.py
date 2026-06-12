import httpx
from .config import settings


async def notify_diego(text: str) -> bool:
    if not settings.telegram_bot_token or not settings.telegram_diego_chat_id:
        return False

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(url, json={"chat_id": settings.telegram_diego_chat_id, "text": text})
        response.raise_for_status()
    return True
