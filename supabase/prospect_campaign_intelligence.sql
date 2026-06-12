alter table public.prospects
  add column if not exists best_channel text,
  add column if not exists campaign_priority text,
  add column if not exists recommended_sequence text,
  add column if not exists expected_conversion numeric,
  add column if not exists campaign_reason text,
  add column if not exists campaign_updated_at timestamptz;

create index if not exists prospects_best_channel_idx
  on public.prospects (best_channel);

create index if not exists prospects_campaign_priority_idx
  on public.prospects (campaign_priority);

create index if not exists prospects_expected_conversion_idx
  on public.prospects (expected_conversion desc);

create index if not exists prospects_campaign_updated_at_idx
  on public.prospects (campaign_updated_at desc);

update public.prospects
set
  best_channel = case
    when coalesce(propensity_score, 0) < 55 or (coalesce(email, '') = '' and coalesce(telefone, '') = '') then 'NURTURE'
    when coalesce(propensity_score, 0) >= 90 and coalesce(telefone, '') <> '' and coalesce(cidade, '') <> '' and coalesce(opportunity_score, 0) >= 78 then 'VISIT'
    when coalesce(propensity_score, 0) >= 85 and coalesce(telefone, '') <> '' and (coalesce(prospect_score, 0) >= 70 or coalesce(opportunity_score, 0) >= 70) then 'CALL'
    when coalesce(telefone, '') <> '' and lower(coalesce(nicho, '')) in ('restaurantes', 'clinicas', 'contabilidade', 'retalho') and coalesce(propensity_score, 0) >= 60 then 'WHATSAPP'
    when coalesce(email, '') <> '' and coalesce(propensity_score, 0) >= 55 then 'EMAIL'
    when coalesce(telefone, '') <> '' and coalesce(propensity_score, 0) >= 60 then 'CALL'
    else 'NURTURE'
  end,
  campaign_priority = case
    when coalesce(propensity_score, 0) >= 90 or coalesce(conversion_probability, 0) >= 0.72 then 'P1'
    when coalesce(propensity_score, 0) >= 75 then 'P2'
    when coalesce(propensity_score, 0) >= 55 then 'P3'
    else 'P4'
  end,
  campaign_updated_at = coalesce(campaign_updated_at, now())
where best_channel is null
   or campaign_priority is null;

update public.prospects
set
  recommended_sequence = case
    when best_channel = 'CALL' then 'CALL_FIRST'
    when best_channel = 'VISIT' then 'VISIT_FIRST'
    when best_channel = 'EMAIL' then 'EMAIL_FIRST'
    when best_channel = 'WHATSAPP' then 'WHATSAPP_FIRST'
    else 'NURTURE'
  end,
  expected_conversion = greatest(0.01, least(0.95,
    coalesce(conversion_probability, coalesce(propensity_score, 0) / 100.0) +
    case best_channel
      when 'VISIT' then 0.10
      when 'CALL' then 0.08
      when 'WHATSAPP' then 0.04
      when 'EMAIL' then 0.02
      else -0.08
    end +
    case campaign_priority
      when 'P1' then 0.07
      when 'P2' then 0.04
      when 'P3' then 0.01
      else -0.04
    end +
    case when coalesce(email, '') = '' and coalesce(telefone, '') = '' then -0.12 else 0 end
  )),
  campaign_reason = concat(
    'propensity ', coalesce(propensity_score, 0), '/100; ',
    'probabilidade ', round(coalesce(conversion_probability, 0) * 100), '%; ',
    case when coalesce(telefone, '') <> '' then 'telefone disponivel' else 'telefone em falta' end, '; ',
    case when coalesce(email, '') <> '' then 'email disponivel' else 'email em falta' end, '; ',
    case when coalesce(cidade, '') <> '' then 'localizacao conhecida' else 'localizacao em falta' end, '; ',
    'canal ', coalesce(best_channel, 'NURTURE'), '; prioridade ', coalesce(campaign_priority, 'P4')
  )
where recommended_sequence is null
   or expected_conversion is null
   or campaign_reason is null;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'campaign_intelligence_generated';
exception
  when undefined_object then null;
end $$;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'best_channel_selected';
exception
  when undefined_object then null;
end $$;

do $$ begin
  alter type public.prospect_agent_event_type add value if not exists 'high_conversion_detected';
exception
  when undefined_object then null;
end $$;
