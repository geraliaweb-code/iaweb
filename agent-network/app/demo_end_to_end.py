import asyncio
import json
from .models import ProposalInput
from .pipeline import process_pt_proposal


async def main() -> None:
    proposal = ProposalInput(
        source_name="fornecedor_pt_demo",
        country="PT",
        language="pt",
        external_reference="PT-REAL-SAMPLE-001",
        lines=[
            {"description": "Fornecimento e aplicacao de betao C25/30 em fundacoes", "quantity": 18.5, "unit": "m3", "unit_price": 112.0},
            {"description": "Aco A500 em armaduras", "quantity": 1240, "unit": "kg", "unit_price": 1.38},
            {"description": "Reboco interior em paredes", "quantity": 220, "unit": "m2", "unit_price": 9.5},
        ],
    )
    result = await process_pt_proposal(proposal)
    print(json.dumps(result.model_dump(), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
