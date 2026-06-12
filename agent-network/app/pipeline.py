from __future__ import annotations

import logging
from uuid import uuid4
from .config import settings
from .models import PipelineResult, ProposalInput
from .normalization import normalize_proposal
from .telegram import notify_diego

logger = logging.getLogger("agent_network.pipeline")


def quality_gates_for(proposal: ProposalInput, audit_score: int) -> dict[str, bool]:
    return {
        "agent_pt_only_week_1": proposal.country == "PT" and proposal.language == "pt",
        "automatic_cycles_disabled": settings.agent_automatic_cycles_enabled is False,
        "hybrid_normalization_order": True,
        "audit_score_min_70": audit_score >= 70,
        "governor_required_before_datamoat": True,
    }


async def process_pt_proposal(proposal: ProposalInput) -> PipelineResult:
    proposal_id = str(uuid4())
    logs: list[dict[str, object]] = []

    logger.info("proposal received", extra={"agent": "agent_pt", "proposal_id": proposal_id, "stage": "ingest"})
    logs.append({"agent": "agent_pt", "stage": "ingest", "message": "PT proposal received"})

    normalized_lines = normalize_proposal(proposal.lines)
    avg_confidence = sum(line.confidence for line in normalized_lines) / max(len(normalized_lines), 1)
    logger.info(
        "normalization complete",
        extra={"agent": "normalizer", "proposal_id": proposal_id, "stage": "normalize", "confidence": round(avg_confidence, 2)},
    )
    logs.append({"agent": "normalizer", "stage": "normalize", "message": "Deterministic normalization completed first"})

    penalties = sum(20 for line in normalized_lines if "llm_fallback_required" in line.flags)
    unit_penalties = sum(8 for line in normalized_lines if "unknown_unit" in line.flags)
    audit_score = max(0, min(100, round(avg_confidence * 100) - penalties - unit_penalties))
    logs.append({"agent": "auditor", "stage": "audit", "message": f"Audit score {audit_score}"})

    gates = quality_gates_for(proposal, audit_score)
    decision = "telegram_pending" if all(gates.values()) else "rejected"
    logs.append({"agent": "supervisor", "stage": "supervise", "message": f"Decision {decision}"})

    if decision == "telegram_pending":
        total = sum(line.quantity * line.unit_price for line in proposal.lines)
        notified = await notify_diego(f"IAWEB Agent Network: proposta PT {proposal_id} aguarda aprovacao. Total EUR {total:.2f}.")
        logs.append({"agent": "telegram", "stage": "governor_approval", "message": "Telegram sent" if notified else "Telegram not configured"})

    return PipelineResult(
        proposal_id=proposal_id,
        status="waiting_governor_approval" if decision == "telegram_pending" else "needs_review",
        normalized_lines=normalized_lines,
        audit_score=audit_score,
        supervisor_decision=decision,
        quality_gates=gates,
        logs=logs,
    )
