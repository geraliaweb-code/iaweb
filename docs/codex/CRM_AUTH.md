# CRM Auth

## Objetivo

Proteger o CRM em `/crm` sem alterar o fluxo de diagnostico nem o schema Supabase.

## Variaveis

```env
CRM_AUTH_ENABLED=false
CRM_AUTH_TOKEN=
CRM_AUTH_PASSWORD=
CRM_AUTH_COOKIE_SECRET=
```

- `CRM_AUTH_ENABLED=false` mantem `/crm` e as APIs CRM abertas para desenvolvimento.
- `CRM_AUTH_ENABLED=true` exige sessao valida antes de mostrar `/crm`.
- Define `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD` para validar o login.
- `CRM_AUTH_COOKIE_SECRET` e opcional, mas recomendado em producao para assinar a cookie de sessao.

## Fluxo

1. Ativar `CRM_AUTH_ENABLED=true`.
2. Definir `CRM_AUTH_TOKEN` ou `CRM_AUTH_PASSWORD`.
3. Reiniciar o servidor local/deploy.
4. Abrir `/crm`.
5. O utilizador sem sessao e redirecionado para `/crm/login`.
6. Login valido cria uma cookie HTTP-only.
7. Logout limpa a cookie e volta a exigir login.

## APIs protegidas

Com `CRM_AUTH_ENABLED=true`, estas rotas exigem sessao valida:

- `GET /api/crm/leads`
- `PATCH /api/crm/leads/[id]`

Com `CRM_AUTH_ENABLED=false`, as rotas continuam abertas para preservar o E2E de desenvolvimento.
