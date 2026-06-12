# Sprint 45 - Construction Agent Network Foundation

## Scope

Implemented as isolated infrastructure for the Agent Network. This sprint does not modify DM-1, DM-2, DM-3, DM-4, DM-5, DM-6A, DM-6B, DM-6C, Billing, Stripe, Auth, Organizations, Health Check V2, or Construction OS engines.

## Activation

- Week 1: Agent PT, Normalizer, Auditor, Supervisor.
- Week 2: Director.
- Week 3: Agent FR.
- Week 4: DataMoat Agent.
- Agent ES: full standby.
- Automatic cycles: disabled.

## Hybrid Normalization

Order is fixed:

1. Aliases.
2. Dictionaries.
3. Deterministic rules.
4. LLM fallback only when material is unknown, unit is unknown, description is ambiguous, or confidence is low.

## Runtime

- Docker Compose: `docker-compose.agent-network.yml`.
- FastAPI: `agent-network/app/main.py`.
- Celery: `agent-network/app/worker.py`.
- Redis: queue and Celery result backend.
- PostgreSQL staging: `supabase/construction_agent_network_staging.sql`.
- Dashboard: `/construction/agents`.
- Health API: `/api/construction/agents/health`.

## Manual PT End-to-End Check

The container demo proposal is available in `agent-network/app/demo_end_to_end.py`.
For local machines without the container Python dependencies installed, `agent-network/app/demo_end_to_end_standalone.py` validates the same PT flow with only the Python standard library.

It processes:

- Betao C25/30 in `m3`.
- Aco A500 in `kg`.
- Reboco in `m2`.

Expected result: deterministic normalization, audit score above 70, Supervisor decision `telegram_pending`, and DataMoat blocked until Governor approval.
