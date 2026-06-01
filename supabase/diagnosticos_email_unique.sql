-- Sprint 12.1 - Go-live hardening
-- Objetivo:
-- Garantir que public.diagnosticos.email suporta upsert(..., { onConflict: "email" }).
--
-- Estrategia segura:
-- 1. Normalizar emails vazios para NULL.
-- 2. Normalizar emails existentes para lower(trim(email)).
-- 3. Identificar duplicados por email normalizado.
-- 4. Manter o registo mais completo e mais recente.
-- 5. Remover duplicados restantes antes de criar o indice unico.
--
-- Criterio de "mais completo":
-- Mantem o registo com mais campos comerciais preenchidos. Em empate, mantem o
-- registo com updated_at mais recente, depois created_at mais recente.

begin;

update public.diagnosticos
set email = null
where email is not null
  and btrim(email) = '';

update public.diagnosticos
set email = lower(btrim(email))
where email is not null
  and email <> lower(btrim(email));

with ranked_duplicates as (
  select
    id,
    email,
    row_number() over (
      partition by email
      order by
        (
          case when nullif(btrim(coalesce(empresa, '')), '') is not null then 1 else 0 end +
          case when nullif(btrim(coalesce(nome_contacto, '')), '') is not null then 1 else 0 end +
          case when nullif(btrim(coalesce(telefone, '')), '') is not null then 1 else 0 end +
          case when nullif(btrim(coalesce(website, '')), '') is not null then 1 else 0 end +
          case when nullif(btrim(coalesce(setor, '')), '') is not null then 1 else 0 end +
          case when nullif(btrim(coalesce(objetivo, '')), '') is not null then 1 else 0 end +
          case when score_geral is not null then 1 else 0 end
        ) desc,
        coalesce(updated_at, created_at, now()) desc,
        coalesce(created_at, now()) desc,
        id desc
    ) as duplicate_rank
  from public.diagnosticos
  where email is not null
)
delete from public.diagnosticos d
using ranked_duplicates r
where d.id = r.id
  and r.duplicate_rank > 1;

create unique index if not exists diagnosticos_email_unique_idx
on public.diagnosticos (email);

commit;
