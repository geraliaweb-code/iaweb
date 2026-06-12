from typing import Any, Literal
from pydantic import BaseModel, Field


AgentCode = Literal["agent_pt", "normalizer", "auditor", "supervisor", "director", "agent_fr", "datamoat_agent", "agent_es"]


class ProposalLine(BaseModel):
    description: str
    quantity: float = Field(gt=0)
    unit: str
    unit_price: float = Field(ge=0)
    material: str | None = None


class ProposalInput(BaseModel):
    source_name: str = "manual_pt"
    country: Literal["PT", "FR", "ES"] = "PT"
    language: Literal["pt", "fr", "es"] = "pt"
    external_reference: str | None = None
    lines: list[ProposalLine]


class NormalizedLine(BaseModel):
    original_description: str
    normalized_description: str
    material_code: str
    unit: str
    quantity: float
    unit_price: float
    confidence: float
    method: Literal["alias", "dictionary", "rule", "llm_fallback_required"]
    flags: list[str] = []


class PipelineResult(BaseModel):
    proposal_id: str
    status: str
    normalized_lines: list[NormalizedLine]
    audit_score: int
    supervisor_decision: Literal["telegram_pending", "rejected", "standby"]
    quality_gates: dict[str, bool]
    logs: list[dict[str, Any]]
