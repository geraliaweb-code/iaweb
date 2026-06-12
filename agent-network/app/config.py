from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    agent_network_env: str = "staging"
    agent_database_url: str = "postgresql://iaweb_agents:iaweb_agents_local@localhost:5545/iaweb_agents_staging"
    agent_redis_url: str = "redis://localhost:6385/0"
    agent_activation_week: int = 1
    agent_automatic_cycles_enabled: bool = False
    telegram_bot_token: str | None = None
    telegram_diego_chat_id: str | None = None
    openai_api_key: str | None = None


settings = Settings()
