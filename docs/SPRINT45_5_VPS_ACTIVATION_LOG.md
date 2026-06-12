# Sprint 45.5 VPS Activation Log

## Scope

- Remote directory: `/opt/iaweb-agent-network`.
- Activated: Agent PT, Normalizer, Auditor, Supervisor.
- Not activated: Agent FR, Agent ES, DataMoat Agent.
- Automatic cycles: disabled.
- Secrets are configured only in remote `/opt/iaweb-agent-network/.env` and are not printed here.

## Commands Executed

- `docker --version && docker compose version`
- `cd /opt/iaweb-agent-network && docker compose -f docker-compose.agent-network.yml --env-file .env ps`
- `docker exec iaweb-construction-agent-network-postgres-1 psql -U iaweb_agents -d iaweb_agents_staging -t -c "select table_name from information_schema.tables where table_schema='public' and table_name in ('agent_proposals','agent_logs','approval_queue','audit_log','agent_sources','dm1_price_cache') order by table_name;"`
- `docker exec iaweb-construction-agent-network-redis-1 redis-cli ping`
- `curl -sS http://127.0.0.1:8045/health`
- `curl -sS http://127.0.0.1:8045/activation`
- `docker logs --tail 25 iaweb-construction-agent-network-worker-1`
- `docker logs --tail 25 iaweb-construction-agent-network-api-1`
- `curl -sS -X POST http://127.0.0.1:8045/proposals/pt ...`

## Test Results

### docker_version

- Exit code: `0`

```text
Docker version 29.5.2, build 79eb04c
Docker Compose version v5.1.4
```

### docker_stack

- Exit code: `0`

```text
NAME                                          IMAGE                                     COMMAND                  SERVICE    CREATED          STATUS                    PORTS
iaweb-construction-agent-network-api-1        iaweb-construction-agent-network-api      "uvicorn app.main:ap…"   api        9 minutes ago    Up 9 minutes              0.0.0.0:8045->8045/tcp, [::]:8045->8045/tcp
iaweb-construction-agent-network-postgres-1   postgres:16-alpine                        "docker-entrypoint.s…"   postgres   13 minutes ago   Up 13 minutes (healthy)   0.0.0.0:5545->5432/tcp, [::]:5545->5432/tcp
iaweb-construction-agent-network-redis-1      redis:7-alpine                            "docker-entrypoint.s…"   redis      13 minutes ago   Up 13 minutes (healthy)   0.0.0.0:6385->6379/tcp, [::]:6385->6379/tcp
iaweb-construction-agent-network-worker-1     iaweb-construction-agent-network-worker   "celery -A app.worke…"   worker     9 minutes ago    Up 9 minutes              8045/tcp
```

### postgres_tables

- Exit code: `0`

```text
agent_logs
 agent_proposals
 agent_sources
 approval_queue
 audit_log
 dm1_price_cache
```

### redis_ping

- Exit code: `0`

```text
PONG
```

### fastapi_health

- Exit code: `0`

```text
{"status":"ok","env":"staging","activation_week":1,"automatic_cycles_enabled":false,"active_agents":["agent_pt","normalizer","auditor","supervisor"]}
```

### activation

- Exit code: `0`

```text
{"week":1,"automatic_cycles_enabled":false,"agents":{"agent_pt":"active","normalizer":"active","auditor":"active","supervisor":"active","director":"scheduled_week_2","agent_fr":"scheduled_week_3","datamoat_agent":"scheduled_week_4","agent_es":"standby"}}
```

### celery_worker_logs

- Exit code: `0`

```text
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** ----- 
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery
                

[tasks]
  . agent_network.noop_healthcheck
```

stderr:
```text
[2026-06-07 13:22:42,805: WARNING/MainProcess] /usr/local/lib/python3.12/site-packages/celery/worker/consumer/consumer.py:508: CPendingDeprecationWarning: The broker_connection_retry configuration setting will no longer determine
whether broker connection retries are made during startup in Celery 6.0 and above.
If you wish to retain the existing behavior for retrying connections on startup,
you should set broker_connection_retry_on_startup to True.
  warnings.warn(

[2026-06-07 13:22:42,819: INFO/MainProcess] Connected to redis://redis:6379/0
[2026-06-07 13:22:42,820: WARNING/MainProcess] /usr/local/lib/python3.12/site-packages/celery/worker/consumer/consumer.py:508: CPendingDeprecationWarning: The broker_connection_retry configuration setting will no longer determine
whether broker connection retries are made during startup in Celery 6.0 and above.
If you wish to retain the existing behavior for retrying connections on startup,
you should set broker_connection_retry_on_startup to True.
  warnings.warn(

[2026-06-07 13:22:42,821: INFO/MainProcess] mingle: searching for neighbors
[2026-06-07 13:22:43,828: INFO/MainProcess] mingle: all alone
[2026-06-07 13:22:43,843: INFO/MainProcess] celery@d1c7fa178f0a ready.
```

### api_logs

- Exit code: `0`

```text
INFO:     172.19.0.1:53218 - "GET /health HTTP/1.1" 200 OK
INFO:     172.19.0.1:53222 - "GET /activation HTTP/1.1" 200 OK
INFO:     172.19.0.1:53228 - "POST /proposals/pt HTTP/1.1" 200 OK
INFO:     94.60.54.155:49672 - "HEAD /health HTTP/1.1" 405 Method Not Allowed
INFO:     172.19.0.1:54404 - "GET /health HTTP/1.1" 200 OK
INFO:     172.19.0.1:54410 - "GET /activation HTTP/1.1" 200 OK
```

stderr:
```text
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8045 (Press CTRL+C to quit)
{"ts": "2026-06-07T13:23:01.723541+00:00", "level": "INFO", "logger": "agent_network.pipeline", "message": "proposal received", "agent": "agent_pt", "proposal_id": "0f4253fa-693f-4fc9-9802-e307577cd509", "stage": "ingest"}
{"ts": "2026-06-07T13:23:01.724074+00:00", "level": "INFO", "logger": "agent_network.pipeline", "message": "normalization complete", "agent": "normalizer", "proposal_id": "0f4253fa-693f-4fc9-9802-e307577cd509", "stage": "normalize", "confidence": 0.94}
{"ts": "2026-06-07T13:23:01.919034+00:00", "level": "INFO", "logger": "httpx", "message": "HTTP Request: POST https://api.telegram.org/bot8778133963:AAHJJye_Xl-7z72-twpDxBCL_xwP2JUsl1M/sendMessage \"HTTP/1.1 200 OK\""}
```

### e2e_pt_proposal

- Exit code: `0`

```text
{"proposal_id":"61aed459-0b14-4d96-a1ec-6ca9faa72d82","status":"waiting_governor_approval","normalized_lines":[{"original_description":"Fornecimento e aplicacao de betao C25/30 em fundacoes","normalized_description":"Betao C25/30","material_code":"CONC_C25_30","unit":"m3","quantity":18.5,"unit_price":112.0,"confidence":0.94,"method":"alias","flags":[]},{"original_description":"Aco A500 em armaduras","normalized_description":"Aco A500","material_code":"STEEL_A500","unit":"kg","quantity":1240.0,"unit_price":1.38,"confidence":0.94,"method":"alias","flags":[]},{"original_description":"Reboco interior em paredes","normalized_description":"Reboco tradicional","material_code":"PLASTER_STD","unit":"m2","quantity":220.0,"unit_price":9.5,"confidence":0.94,"method":"alias","flags":[]}],"audit_score":94,"supervisor_decision":"telegram_pending","quality_gates":{"agent_pt_only_week_1":true,"automatic_cycles_disabled":true,"hybrid_normalization_order":true,"audit_score_min_70":true,"governor_required_before_datamoat":true},"logs":[{"agent":"agent_pt","stage":"ingest","message":"PT proposal received"},{"agent":"normalizer","stage":"normalize","message":"Deterministic normalization completed first"},{"agent":"auditor","stage":"audit","message":"Audit score 94"},{"agent":"supervisor","stage":"supervise","message":"Decision telegram_pending"},{"agent":"telegram","stage":"governor_approval","message":"Telegram sent"}]}
```

## Final

- Validation: PASS
