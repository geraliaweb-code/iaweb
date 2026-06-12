from celery import Celery
from .config import settings

celery_app = Celery("iaweb_agent_network", broker=settings.agent_redis_url, backend=settings.agent_redis_url)
celery_app.conf.update(task_serializer="json", accept_content=["json"], result_serializer="json", timezone="Europe/Lisbon")


@celery_app.task(name="agent_network.noop_healthcheck")
def noop_healthcheck() -> dict[str, str]:
    return {"status": "ok", "automatic_cycles": "disabled"}
