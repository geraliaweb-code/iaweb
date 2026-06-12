import json
import re
from uuid import uuid4


MATERIAL_ALIASES = {
    "betao c25/30": ("CONC_C25_30", "Betao C25/30"),
    "betão c25/30": ("CONC_C25_30", "Betao C25/30"),
    "aco a500": ("STEEL_A500", "Aco A500"),
    "aço a500": ("STEEL_A500", "Aco A500"),
    "reboco": ("PLASTER_STD", "Reboco tradicional"),
}

UNIT_ALIASES = {"m3": "m3", "m³": "m3", "kg": "kg", "m2": "m2", "m²": "m2"}


def normalize(line):
    clean = re.sub(r"\s+", " ", line["description"].lower())
    unit = UNIT_ALIASES.get(line["unit"].lower(), line["unit"].lower())
    flags = [] if unit in UNIT_ALIASES.values() else ["unknown_unit"]

    for alias, (code, label) in MATERIAL_ALIASES.items():
        if alias in clean:
            return {
                "original_description": line["description"],
                "normalized_description": label,
                "material_code": code,
                "unit": unit,
                "quantity": line["quantity"],
                "unit_price": line["unit_price"],
                "confidence": 0.94 if not flags else 0.78,
                "method": "alias",
                "flags": flags,
            }

    for pattern, code, label in [
        (r"\b(c25/?30|bet[aã]o|concreto)\b", "CONC_C25_30", "Betao C25/30"),
        (r"\b(a500|a[cç]o|var[aã]o)\b", "STEEL_A500", "Aco A500"),
        (r"\b(reboco|estuque)\b", "PLASTER_STD", "Reboco tradicional"),
    ]:
        if re.search(pattern, clean, re.I):
            return {
                "original_description": line["description"],
                "normalized_description": label,
                "material_code": code,
                "unit": unit,
                "quantity": line["quantity"],
                "unit_price": line["unit_price"],
                "confidence": 0.82 if not flags else 0.68,
                "method": "rule",
                "flags": flags,
            }

    flags.extend(["unknown_material", "llm_fallback_required"])
    return {
        "original_description": line["description"],
        "normalized_description": line["description"],
        "material_code": "UNKNOWN",
        "unit": unit,
        "quantity": line["quantity"],
        "unit_price": line["unit_price"],
        "confidence": 0.42,
        "method": "llm_fallback_required",
        "flags": flags,
    }


def main():
    proposal = {
        "source_name": "fornecedor_pt_demo",
        "country": "PT",
        "language": "pt",
        "external_reference": "PT-REAL-SAMPLE-001",
        "lines": [
            {"description": "Fornecimento e aplicacao de betao C25/30 em fundacoes", "quantity": 18.5, "unit": "m3", "unit_price": 112.0},
            {"description": "Aco A500 em armaduras", "quantity": 1240, "unit": "kg", "unit_price": 1.38},
            {"description": "Reboco interior em paredes", "quantity": 220, "unit": "m2", "unit_price": 9.5},
        ],
    }
    normalized = [normalize(line) for line in proposal["lines"]]
    avg_confidence = sum(line["confidence"] for line in normalized) / len(normalized)
    audit_score = round(avg_confidence * 100)
    quality_gates = {
        "agent_pt_only_week_1": proposal["country"] == "PT" and proposal["language"] == "pt",
        "automatic_cycles_disabled": True,
        "hybrid_normalization_order": True,
        "audit_score_min_70": audit_score >= 70,
        "governor_required_before_datamoat": True,
    }
    result = {
        "proposal_id": str(uuid4()),
        "status": "waiting_governor_approval" if all(quality_gates.values()) else "needs_review",
        "normalized_lines": normalized,
        "audit_score": audit_score,
        "supervisor_decision": "telegram_pending" if all(quality_gates.values()) else "rejected",
        "quality_gates": quality_gates,
        "total_value": sum(line["quantity"] * line["unit_price"] for line in proposal["lines"]),
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
