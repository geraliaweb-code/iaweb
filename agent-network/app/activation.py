from .models import AgentCode


ACTIVATION_WEEKS: dict[AgentCode, int | None] = {
    "agent_pt": 1,
    "normalizer": 1,
    "auditor": 1,
    "supervisor": 1,
    "director": 2,
    "agent_fr": 3,
    "datamoat_agent": 4,
    "agent_es": None,
}


def active_agents(week: int) -> list[AgentCode]:
    return [agent for agent, start_week in ACTIVATION_WEEKS.items() if start_week is not None and week >= start_week]


def agent_status(agent: AgentCode, week: int) -> str:
    start_week = ACTIVATION_WEEKS[agent]
    if start_week is None:
        return "standby"
    return "active" if week >= start_week else f"scheduled_week_{start_week}"
