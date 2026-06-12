from __future__ import annotations

import re
from .models import NormalizedLine, ProposalLine


MATERIAL_ALIASES = {
    "betao c25/30": ("CONC_C25_30", "Betao C25/30"),
    "betão c25/30": ("CONC_C25_30", "Betao C25/30"),
    "concreto c25/30": ("CONC_C25_30", "Betao C25/30"),
    "aco a500": ("STEEL_A500", "Aco A500"),
    "aço a500": ("STEEL_A500", "Aco A500"),
    "varao a500": ("STEEL_A500", "Aco A500"),
    "varão a500": ("STEEL_A500", "Aco A500"),
    "tijolo 11": ("BRICK_11", "Tijolo ceramico 11"),
    "reboco": ("PLASTER_STD", "Reboco tradicional"),
}

UNIT_ALIASES = {
    "m3": "m3",
    "m³": "m3",
    "metro cubico": "m3",
    "metro cúbico": "m3",
    "kg": "kg",
    "quilo": "kg",
    "m2": "m2",
    "m²": "m2",
    "metro quadrado": "m2",
    "un": "un",
    "unidade": "un",
}

MATERIAL_RULES = [
    (re.compile(r"\b(c25/?30|bet[aã]o|concreto)\b", re.I), ("CONC_C25_30", "Betao C25/30")),
    (re.compile(r"\b(a500|a[cç]o|var[aã]o)\b", re.I), ("STEEL_A500", "Aco A500")),
    (re.compile(r"\b(tijolo|alvenaria)\b", re.I), ("BRICK_11", "Tijolo ceramico 11")),
    (re.compile(r"\b(reboco|estuque)\b", re.I), ("PLASTER_STD", "Reboco tradicional")),
]


def normalize_unit(unit: str) -> tuple[str, str | None]:
    clean = unit.strip().lower()
    normalized = UNIT_ALIASES.get(clean)
    if normalized:
        return normalized, None
    return clean, "unknown_unit"


def normalize_line(line: ProposalLine) -> NormalizedLine:
    source = f"{line.material or ''} {line.description}".strip()
    clean = re.sub(r"\s+", " ", source.lower())
    normalized_unit, unit_flag = normalize_unit(line.unit)
    flags: list[str] = []
    if unit_flag:
        flags.append(unit_flag)

    for alias, (code, label) in MATERIAL_ALIASES.items():
        if alias in clean:
            confidence = 0.94 if not flags else 0.78
            return NormalizedLine(
                original_description=line.description,
                normalized_description=label,
                material_code=code,
                unit=normalized_unit,
                quantity=line.quantity,
                unit_price=line.unit_price,
                confidence=confidence,
                method="alias",
                flags=flags,
            )

    dictionary_match = line.material.strip().lower() if line.material else ""
    if dictionary_match in MATERIAL_ALIASES:
        code, label = MATERIAL_ALIASES[dictionary_match]
        confidence = 0.9 if not flags else 0.74
        return NormalizedLine(
            original_description=line.description,
            normalized_description=label,
            material_code=code,
            unit=normalized_unit,
            quantity=line.quantity,
            unit_price=line.unit_price,
            confidence=confidence,
            method="dictionary",
            flags=flags,
        )

    for pattern, (code, label) in MATERIAL_RULES:
        if pattern.search(clean):
            confidence = 0.82 if not flags else 0.68
            if confidence < 0.75:
                flags.append("low_confidence")
            return NormalizedLine(
                original_description=line.description,
                normalized_description=label,
                material_code=code,
                unit=normalized_unit,
                quantity=line.quantity,
                unit_price=line.unit_price,
                confidence=confidence,
                method="rule",
                flags=flags,
            )

    flags.extend(["unknown_material", "llm_fallback_required"])
    return NormalizedLine(
        original_description=line.description,
        normalized_description=line.description.strip(),
        material_code="UNKNOWN",
        unit=normalized_unit,
        quantity=line.quantity,
        unit_price=line.unit_price,
        confidence=0.42,
        method="llm_fallback_required",
        flags=flags,
    )


def normalize_proposal(lines: list[ProposalLine]) -> list[NormalizedLine]:
    return [normalize_line(line) for line in lines]
