from fastapi import FastAPI, HTTPException
from .activation import ACTIVATION_WEEKS, active_agents, agent_status
from .config import settings
from .logging_config import configure_logging
from .models import ProposalInput
from .pipeline import process_pt_proposal

configure_logging()

app = FastAPI(title="IAWEB Construction Agent Network", version="45.0.0")


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "status": "ok",
        "env": settings.agent_network_env,
        "activation_week": settings.agent_activation_week,
        "automatic_cycles_enabled": settings.agent_automatic_cycles_enabled,
        "active_agents": active_agents(settings.agent_activation_week),
    }


@app.get("/activation")
def activation() -> dict[str, object]:
    return {
        "week": settings.agent_activation_week,
        "automatic_cycles_enabled": settings.agent_automatic_cycles_enabled,
        "agents": {agent: agent_status(agent, settings.agent_activation_week) for agent in ACTIVATION_WEEKS},
    }


@app.post("/proposals/pt")
async def submit_pt_proposal(proposal: ProposalInput) -> dict[str, object]:
    if settings.agent_automatic_cycles_enabled:
        raise HTTPException(status_code=409, detail="Automatic cycles must remain disabled for Sprint 45.")
    if proposal.country != "PT" or proposal.language != "pt":
        raise HTTPException(status_code=400, detail="Week 1 only accepts Agent PT proposals.")
    result = await process_pt_proposal(proposal)
    return result.model_dump()
