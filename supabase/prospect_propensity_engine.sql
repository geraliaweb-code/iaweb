alter table public.prospects
  add column if not exists propensity_score integer,
  add column if not exists propensity_label text,
  add column if not exists conversion_probability numeric,
  add column if not exists next_best_action text,
  add column if not exists propensity_updated_at timestamptz;

create index if not exists prospects_propensity_score_idx
  on public.prospects (propensity_score desc);

create index if not exists prospects_propensity_label_idx
  on public.prospects (propensity_label);

create index if not exists prospects_conversion_probability_idx
  on public.prospects (conversion_probability desc);

update public.prospects
set
  propensity_score = greatest(0, least(100, round(
    coalesce(opportunity_score, 0) * 0.35 +
    coalesce(prospect_score, score_digital, 0) * 0.25 +
    case
      when lower(coalesce(nicho, '')) in ('industria', 'hotelaria', 'restaurantes', 'clinicas', 'imobiliario', 'retalho', 'contabilidade', 'construcao') then 88 * 0.15
      when coalesce(nicho, '') <> '' then 65 * 0.15
      else 45 * 0.15
    end +
    greatest(0, least(100, 100 - abs(55 - coalesce(score_digital, 55)))) * 0.10 +
    case
      when coalesce(email, '') <> '' and coalesce(telefone, '') <> '' then 100 * 0.10
      when coalesce(email, '') <> '' or coalesce(telefone, '') <> '' then 72 * 0.10
      else 30 * 0.10
    end +
    case
      when lower(coalesce(priority_label, '')) like '%crit%' then 90 * 0.05
      when lower(coalesce(priority_label, '')) like '%alta%' then 78 * 0.05
      when lower(coalesce(priority_label, '')) like '%media%' then 58 * 0.05
      else 35 * 0.05
    end
  ))::integer),
  propensity_updated_at = coalesce(propensity_updated_at, now())
where propensity_score is null;

update public.prospects
set
  propensity_label = case
    when propensity_score >= 95 then 'Critico'
    when propensity_score >= 80 then 'Muito Quente'
    when propensity_score >= 60 then 'Oportunidade'
    when propensity_score >= 40 then 'Morno'
    else 'Baixo Interesse'
  end,
  conversion_probability = case
    when propensity_score >= 95 then round((0.82 + (propensity_score - 95) * 0.025)::numeric, 4)
    when propensity_score >= 80 then round((0.58 + (propensity_score - 80) * 0.014)::numeric, 4)
    when propensity_score >= 60 then round((0.34 + (propensity_score - 60) * 0.012)::numeric, 4)
    when propensity_score >= 40 then round((0.16 + (propensity_score - 40) * 0.009)::numeric, 4)
    else round((0.04 + propensity_score * 0.003)::numeric, 4)
  end,
  next_best_action = case
    when propensity_score >= 95 and coalesce(telefone, '') <> '' then 'ligar nas proximas 24h'
    when propensity_score >= 95 then 'visita presencial'
    when propensity_score >= 80 and coalesce(email, '') <> '' then 'enviar email + follow-up'
    when propensity_score >= 80 then 'ligar nas proximas 24h'
    when propensity_score >= 60 and coalesce(telefone, '') <> '' then 'enviar WhatsApp'
    when propensity_score >= 60 then 'enviar email + follow-up'
    else 'nutricao futura'
  end
where propensity_label is null
   or conversion_probability is null
   or next_best_action is null;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'propensity_calculated';
exception
  when undefined_object then null;
end $$;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'propensity_critical';
exception
  when undefined_object then null;
end $$;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'propensity_hot';
exception
  when undefined_object then null;
end $$;
