from .activation import agent_status


def sprint_45_quality_gates(week: int, automatic_cycles_enabled: bool) -> dict[str, bool]:
    return {
        "agent_pt_active_week_1": agent_status("agent_pt", week) == "active",
        "normalizer_active_week_1": agent_status("normalizer", week) == "active",
        "auditor_active_week_1": agent_status("auditor", week) == "active",
        "supervisor_active_week_1": agent_status("supervisor", week) == "active",
        "director_not_active_week_1": agent_status("director", week) != "active",
        "agent_fr_not_active_week_1": agent_status("agent_fr", week) != "active",
        "datamoat_not_active_week_1": agent_status("datamoat_agent", week) != "active",
        "agent_es_standby": agent_status("agent_es", week) == "standby",
        "automatic_cycles_disabled": automatic_cycles_enabled is False,
    }
