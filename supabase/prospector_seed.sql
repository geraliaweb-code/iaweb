-- Seed ficticio para public.prospects
-- Compativel com PostgreSQL/Supabase.
-- Insere 30 prospects distribuidos por nicho, evitando duplicados por email.

with seed_prospects (
  empresa,
  contacto,
  email,
  telefone,
  website,
  cidade,
  regiao,
  nicho,
  keywords,
  score_digital,
  opportunity_score,
  priority_label,
  problema_1,
  problema_2,
  oportunidade_1,
  oportunidade_2,
  monthly_min,
  monthly_max,
  annual_min,
  annual_max,
  homepage_headline,
  score_projetado,
  melhoria_prevista,
  template_utilizado,
  status,
  source
) as (
  values
    ($$NorteObra Remodelacoes$$,$$Miguel Ferreira$$,$$prospect+norteobra@iaweb.pt$$,$$+351920000001$$,$$https://norteobra.pt$$,$$Porto$$,$$Norte$$,$$construcao$$,array[$$remodelacoes$$,$$obras interiores$$,$$orcamento obras$$],36,94,$$Critica$$,$$Website sem prova visual forte$$,$$Pedidos de orcamento sem seguimento estruturado$$,$$Criar pagina orientada a pedidos de orcamento$$,$$Automatizar resposta inicial por WhatsApp$$,12000,48000,144000,576000,$$NorteObra: remodelacoes com prova, confianca e resposta rapida.$$ ,88,52,$$construction$$,$$novo$$,$$seed$$),
    ($$Alvenaria Prime$$,$$Rui Santos$$,$$prospect+alvenaria-prime@iaweb.pt$$,$$+351920000002$$,$$https://alvenariaprime.pt$$,$$Braga$$,$$Norte$$,$$construcao$$,array[$$construcao civil$$,$$empreiteiro$$,$$moradias$$],42,89,$$Alta$$,$$Pouca diferenciacao face a concorrentes$$,$$Formulario pouco visivel$$,$$Valorizar obras concluidas e garantias$$,$$Criar funil simples para novos pedidos$$,9000,36000,108000,432000,$$Alvenaria Prime: construcao com processo claro e orcamentos qualificados.$$ ,86,44,$$construction$$,$$novo$$,$$seed$$),
    ($$Habita Obras Coimbra$$,$$Tiago Nunes$$,$$prospect+habita-obras@iaweb.pt$$,$$+351920000003$$,$$https://habitaobras.pt$$,$$Coimbra$$,$$Centro$$,$$construcao$$,array[$$remodelar casa$$,$$cozinhas$$,$$casas de banho$$],51,82,$$Alta$$,$$Mobile pouco convincente$$,$$Portfolio sem chamadas para acao$$,$$Converter visitas em pedidos qualificados$$,$$Mostrar antes e depois das obras$$,7000,28000,84000,336000,$$Habita Obras: transformar visitas em pedidos de remodelacao.$$ ,84,33,$$construction$$,$$novo$$,$$seed$$),
    ($$Sul Engenharia Local$$,$$Andre Matos$$,$$prospect+sul-engenharia@iaweb.pt$$,$$+351920000004$$,$$https://sulengenharia.pt$$,$$Faro$$,$$Algarve$$,$$construcao$$,array[$$engenharia civil$$,$$fiscalizacao obra$$,$$projetos$$],58,76,$$Media$$,$$Mensagem tecnica pouco comercial$$,$$Prova de confianca dispersa$$,$$Reforcar autoridade local$$,$$Centralizar pedidos no CRM$$,6000,22000,72000,264000,$$Sul Engenharia: autoridade tecnica com captacao comercial clara.$$ ,87,29,$$construction$$,$$novo$$,$$seed$$),
    ($$Setubal Reabilita$$,$$Carla Ribeiro$$,$$prospect+setubal-reabilita@iaweb.pt$$,$$+351920000005$$,$$https://setubalreabilita.pt$$,$$Setubal$$,$$Lisboa e Vale do Tejo$$,$$construcao$$,array[$$reabilitacao urbana$$,$$remodelacoes setubal$$,$$obras$$],29,97,$$Critica$$,$$Baixa presenca no Google$$,$$Sem CTA claro para orcamentos$$,$$Captar proprietarios com intencao ativa$$,$$Criar pagina de prova por tipo de obra$$,15000,52000,180000,624000,$$Setubal Reabilita: reabilitacao com confianca e orcamentos rapidos.$$ ,86,57,$$construction$$,$$novo$$,$$seed$$),

    ($$Clinica Oral Avenida$$,$$Dra. Ines Costa$$,$$prospect+oral-avenida@iaweb.pt$$,$$+351920000006$$,$$https://oralavenida.pt$$,$$Lisboa$$,$$Lisboa e Vale do Tejo$$,$$clinicas$$,array[$$dentista lisboa$$,$$implantes dentarios$$,$$marcacao online$$],34,96,$$Critica$$,$$Pacientes nao encontram prova de confianca suficiente$$,$$Marcacao online pouco evidente$$,$$Aumentar marcacoes por tratamento$$,$$Reforcar reputacao e casos clinicos$$,3000,57000,36000,684000,$$Clinica Oral Avenida: mais marcacoes com confianca e prova social.$$ ,89,55,$$clinic$$,$$novo$$,$$seed$$),
    ($$Saude Prime Braga$$,$$Mariana Lopes$$,$$prospect+saude-prime-braga@iaweb.pt$$,$$+351920000007$$,$$https://saudeprimebraga.pt$$,$$Braga$$,$$Norte$$,$$clinicas$$,array[$$clinica braga$$,$$medicina privada$$,$$consultas$$],46,88,$$Alta$$,$$Google Business pouco explorado$$,$$Follow-up manual de pedidos$$,$$Transformar pesquisas em consultas$$,$$Criar resposta rapida por canal$$,2500,32000,30000,384000,$$Saude Prime Braga: consultas privadas com marcacao simples e rapida.$$ ,90,44,$$clinic$$,$$novo$$,$$seed$$),
    ($$Dental Mondego$$,$$Joao Ferreira$$,$$prospect+dental-mondego@iaweb.pt$$,$$+351920000008$$,$$https://dentalmondego.pt$$,$$Coimbra$$,$$Centro$$,$$clinicas$$,array[$$dentista coimbra$$,$$ortodontia$$,$$estetica dentaria$$],62,79,$$Media$$,$$Conteudo de tratamentos pouco orientado a conversao$$,$$Poucas provas visuais de resultados$$,$$Criar paginas por tratamento$$,$$Melhorar reputacao e pedidos de avaliacao$$,1800,18000,21600,216000,$$Dental Mondego: tratamentos claros, prova e marcacoes online.$$ ,91,29,$$clinic$$,$$novo$$,$$seed$$),
    ($$Clinica Vital Faro$$,$$Teresa Gomes$$,$$prospect+vital-faro@iaweb.pt$$,$$+351920000009$$,$$https://clinicavitalfaro.pt$$,$$Faro$$,$$Algarve$$,$$clinicas$$,array[$$clinica faro$$,$$saude familiar$$,$$marcacoes$$],55,84,$$Alta$$,$$Primeira dobra pouco persuasiva$$,$$Contacto disperso entre canais$$,$$Criar percurso direto ate a marcacao$$,$$Ligar WhatsApp, formulario e CRM$$,2000,24000,24000,288000,$$Clinica Vital Faro: marcacoes simples para pacientes certos.$$ ,88,33,$$clinic$$,$$novo$$,$$seed$$),
    ($$Smile Studio Porto$$,$$Dra. Sofia Alves$$,$$prospect+smile-studio-porto@iaweb.pt$$,$$+351920000010$$,$$https://smilestudioporto.pt$$,$$Porto$$,$$Norte$$,$$clinicas$$,array[$$branqueamento dentario$$,$$aparelho invisivel$$,$$dentista porto$$],71,73,$$Media$$,$$Boa base mas pouca automatizacao$$,$$Campanhas sem seguimento comercial$$,$$Escalar marcacoes qualificadas$$,$$Criar follow-up por tratamento$$,1500,12000,18000,144000,$$Smile Studio Porto: escalar marcacoes com automacao e prova.$$ ,94,23,$$clinic$$,$$novo$$,$$seed$$),

    ($$Litoral Casas$$,$$Carla Martins$$,$$prospect+litoral-casas@iaweb.pt$$,$$+351920000011$$,$$https://litoralcasa.pt$$,$$Aveiro$$,$$Centro$$,$$imobiliario$$,array[$$imobiliaria aveiro$$,$$comprar casa$$,$$vender imovel$$],39,95,$$Critica$$,$$Site pouco orientado a proprietarios vendedores$$,$$Leads sem prioridade comercial$$,$$Captar proprietarios com imoveis para vender$$,$$Criar funil de avaliacao gratuita$$,6000,64000,72000,768000,$$Litoral Casas: captar proprietarios e compradores com presenca premium.$$ ,88,49,$$realestate$$,$$novo$$,$$seed$$),
    ($$Prime Keys Lisboa$$,$$Andre Costa$$,$$prospect+prime-keys-lisboa@iaweb.pt$$,$$+351920000012$$,$$https://primekeyslisboa.pt$$,$$Lisboa$$,$$Lisboa e Vale do Tejo$$,$$imobiliario$$,array[$$imobiliaria premium$$,$$casas lisboa$$,$$avaliacao imovel$$],52,87,$$Alta$$,$$Marca premium pouco refletida no website$$,$$CTA de avaliacao pouco forte$$,$$Valorizar percecao de mercado$$,$$Captar pedidos de avaliacao de imovel$$,5000,48000,60000,576000,$$Prime Keys Lisboa: imobiliario premium com captacao previsivel.$$ ,91,39,$$realestate$$,$$novo$$,$$seed$$),
    ($$Casa Norte Imobiliaria$$,$$Pedro Almeida$$,$$prospect+casa-norte@iaweb.pt$$,$$+351920000013$$,$$https://casanorte.pt$$,$$Viana do Castelo$$,$$Norte$$,$$imobiliario$$,array[$$imobiliaria viana$$,$$moradias$$,$$apartamentos$$],64,78,$$Media$$,$$Pouca segmentacao por tipo de cliente$$,$$Prova social pouco visivel$$,$$Criar paginas para compradores e vendedores$$,$$Melhorar captura de contactos$$,3500,28000,42000,336000,$$Casa Norte: imoveis com confianca local e contacto direto.$$ ,90,26,$$realestate$$,$$novo$$,$$seed$$),
    ($$Algarve Estate Hub$$,$$Sofia Duarte$$,$$prospect+algarve-estate@iaweb.pt$$,$$+351920000014$$,$$https://algarveestatehub.pt$$,$$Loule$$,$$Algarve$$,$$imobiliario$$,array[$$real estate algarve$$,$$luxury villas$$,$$property algarve$$],73,81,$$Alta$$,$$Conteudo internacional sem funil claro$$,$$Pedidos entram sem qualificacao$$,$$Criar captacao bilingue qualificada$$,$$Segmentar investidores e compradores$$,7000,56000,84000,672000,$$Algarve Estate Hub: captar compradores internacionais qualificados.$$ ,94,21,$$realestate$$,$$novo$$,$$seed$$),
    ($$ImoDouro Premium$$,$$Rita Moreira$$,$$prospect+imodouro@iaweb.pt$$,$$+351920000015$$,$$https://imodouro.pt$$,$$Vila Real$$,$$Norte$$,$$imobiliario$$,array[$$imobiliaria douro$$,$$quintas$$,$$vender casa$$],31,93,$$Critica$$,$$Presenca digital fraca para mercado premium$$,$$Baixa captacao de proprietarios$$,$$Reposicionar autoridade local$$,$$Criar avaliacao gratuita como CTA principal$$,6000,52000,72000,624000,$$ImoDouro Premium: captar proprietarios no Douro com autoridade.$$ ,86,55,$$realestate$$,$$novo$$,$$seed$$),

    ($$Mesa do Bairro$$,$$Marta Silva$$,$$prospect+mesa-bairro@iaweb.pt$$,$$+351920000016$$,$$https://mesadobairro.pt$$,$$Lisboa$$,$$Lisboa e Vale do Tejo$$,$$restaurantes$$,array[$$restaurante lisboa$$,$$reservas online$$,$$menu do dia$$],44,88,$$Alta$$,$$Reservas pouco visiveis no website$$,$$Menu sem chamada para acao$$,$$Aumentar reservas diretas$$,$$Melhorar presenca local no Google$$,1400,18000,16800,216000,$$Mesa do Bairro: transformar procura local em reservas diretas.$$ ,87,43,$$restaurant$$,$$novo$$,$$seed$$),
    ($$Bistro Foz$$,$$Luis Rocha$$,$$prospect+bistro-foz@iaweb.pt$$,$$+351920000017$$,$$https://bistrofoz.pt$$,$$Porto$$,$$Norte$$,$$restaurantes$$,array[$$bistro porto$$,$$jantar foz$$,$$reservas$$],57,76,$$Media$$,$$Boa localizacao mas pouca prova visual$$,$$Reservas dependem de terceiros$$,$$Captar reservas diretas$$,$$Valorizar ambiente e experiencia$$,900,9000,10800,108000,$$Bistro Foz: experiencia, menu e reservas num percurso direto.$$ ,85,28,$$restaurant$$,$$novo$$,$$seed$$),
    ($$Cantina Alentejana$$,$$Tiago Lopes$$,$$prospect+cantina-alentejana@iaweb.pt$$,$$+351920000018$$,$$https://cantinaalentejana.pt$$,$$Evora$$,$$Alentejo$$,$$restaurantes$$,array[$$restaurante evora$$,$$comida alentejana$$,$$reservar mesa$$],38,91,$$Critica$$,$$Website antigo e pouco mobile$$,$$Sem sistema claro de reservas$$,$$Criar homepage focada em reservas$$,$$Reforcar reviews e especialidades$$,1200,14000,14400,168000,$$Cantina Alentejana: reservas e tradicao com presenca moderna.$$ ,84,46,$$restaurant$$,$$novo$$,$$seed$$),
    ($$Mar e Brasa$$,$$Joana Matos$$,$$prospect+mar-e-brasa@iaweb.pt$$,$$+351920000019$$,$$https://marebrasa.pt$$,$$Setubal$$,$$Lisboa e Vale do Tejo$$,$$restaurantes$$,array[$$peixe grelhado$$,$$restaurante setubal$$,$$reservas$$],68,74,$$Media$$,$$Marca forte mas pouco automatizada$$,$$Campanhas sem captura propria$$,$$Criar base de clientes recorrentes$$,$$Melhorar reservas e pedidos de grupo$$,1000,8000,12000,96000,$$Mar e Brasa: reservas diretas para uma experiencia memoravel.$$ ,91,23,$$restaurant$$,$$novo$$,$$seed$$),
    ($$Pausa Cafe Coimbra$$,$$Ines Ramos$$,$$prospect+pausa-cafe@iaweb.pt$$,$$+351920000020$$,$$https://pausacafecoimbra.pt$$,$$Coimbra$$,$$Centro$$,$$restaurantes$$,array[$$brunch coimbra$$,$$cafe coimbra$$,$$reservas brunch$$],49,80,$$Alta$$,$$Oferta pouco clara para novos clientes$$,$$Redes sociais nao ligam a reservas$$,$$Converter pesquisa em visitas$$,$$Criar CTA para reservas e eventos$$,800,7000,9600,84000,$$Pausa Cafe Coimbra: brunch, reservas e eventos com clareza.$$ ,86,37,$$restaurant$$,$$novo$$,$$seed$$),

    ($$Lex Norte Advogados$$,$$Ana Ribeiro$$,$$prospect+lex-norte@iaweb.pt$$,$$+351920000021$$,$$https://lexnorte.pt$$,$$Braga$$,$$Norte$$,$$advocacia$$,array[$$advogado braga$$,$$direito laboral$$,$$consulta juridica$$],37,94,$$Critica$$,$$Autoridade juridica pouco visivel$$,$$Contacto inicial sem contexto$$,$$Gerar consultas qualificadas$$,$$Criar paginas por area de pratica$$,1000,50000,12000,600000,$$Lex Norte: autoridade juridica clara para consultas qualificadas.$$ ,85,48,$$lawyer$$,$$novo$$,$$seed$$),
    ($$Matos Legal Office$$,$$Sofia Matos$$,$$prospect+matos-legal@iaweb.pt$$,$$+351920000022$$,$$https://matoslegal.pt$$,$$Porto$$,$$Norte$$,$$advocacia$$,array[$$advogada porto$$,$$familia$$,$$herancas$$],58,83,$$Alta$$,$$Areas de pratica pouco diferenciadas$$,$$Prova de experiencia insuficiente$$,$$Aumentar confianca antes da consulta$$,$$Criar percurso para pedido de avaliacao$$,1000,22500,12000,270000,$$Matos Legal Office: clareza juridica e contacto seguro.$$ ,89,31,$$lawyer$$,$$novo$$,$$seed$$),
    ($$Defesa Fiscal Lisboa$$,$$Vasco Pereira$$,$$prospect+defesa-fiscal@iaweb.pt$$,$$+351920000023$$,$$https://defesafiscal.pt$$,$$Lisboa$$,$$Lisboa e Vale do Tejo$$,$$advocacia$$,array[$$direito fiscal$$,$$advogado fiscal$$,$$contencioso tributario$$],66,77,$$Media$$,$$Conteudo tecnico sem CTA comercial$$,$$Leads nao sao classificados$$,$$Captar empresas com necessidade juridica$$,$$Criar funil consultivo por caso$$,1500,28000,18000,336000,$$Defesa Fiscal Lisboa: apoio juridico fiscal com resposta estruturada.$$ ,91,25,$$lawyer$$,$$novo$$,$$seed$$),
    ($$Ordem Sul Legal$$,$$Ricardo Neves$$,$$prospect+ordem-sul@iaweb.pt$$,$$+351920000024$$,$$https://ordemsullegal.pt$$,$$Faro$$,$$Algarve$$,$$advocacia$$,array[$$advogado faro$$,$$imobiliario juridico$$,$$contratos$$],43,88,$$Alta$$,$$Website pouco orientado a clientes internacionais$$,$$Pouca prova institucional$$,$$Captar consultas de maior valor$$,$$Criar abordagem bilingue e premium$$,1200,26000,14400,312000,$$Ordem Sul Legal: suporte juridico premium no Algarve.$$ ,86,43,$$lawyer$$,$$novo$$,$$seed$$),
    ($$Coimbra Juridica$$,$$Helena Antunes$$,$$prospect+coimbra-juridica@iaweb.pt$$,$$+351920000025$$,$$https://coimbrajuridica.pt$$,$$Coimbra$$,$$Centro$$,$$advocacia$$,array[$$advogado coimbra$$,$$direito civil$$,$$consulta online$$],29,98,$$Critica$$,$$Baixa visibilidade local$$,$$Sem mecanismo de consulta inicial$$,$$Ganhar presenca nas pesquisas locais$$,$$Criar CTA de consulta rapida$$,1000,30000,12000,360000,$$Coimbra Juridica: consultas claras para quem procura resposta legal.$$ ,84,55,$$lawyer$$,$$novo$$,$$seed$$),

    ($$Conta Clara Porto$$,$$Nuno Teixeira$$,$$prospect+conta-clara-porto@iaweb.pt$$,$$+351920000026$$,$$https://contaclaraporto.pt$$,$$Porto$$,$$Norte$$,$$contabilidade$$,array[$$contabilista porto$$,$$contabilidade empresas$$,$$irs empresas$$],41,90,$$Alta$$,$$Oferta pouco clara para empresas$$,$$Pedidos entram sem triagem$$,$$Captar clientes recorrentes$$,$$Criar funil para reunioes de diagnostico$$,900,12000,10800,144000,$$Conta Clara Porto: contabilidade simples para empresas que querem crescer.$$ ,87,46,$$accounting$$,$$novo$$,$$seed$$),
    ($$Fiscalis Lisboa$$,$$Helena Duarte$$,$$prospect+fiscalis-lisboa@iaweb.pt$$,$$+351920000027$$,$$https://fiscalislisboa.pt$$,$$Lisboa$$,$$Lisboa e Vale do Tejo$$,$$contabilidade$$,array[$$contabilidade lisboa$$,$$consultoria fiscal$$,$$empresa$$],67,78,$$Media$$,$$Boa base mas captacao pouco previsivel$$,$$Follow-up comercial manual$$,$$Escalar pedidos qualificados$$,$$Automatizar resposta e proposta inicial$$,900,8500,10800,102000,$$Fiscalis Lisboa: contabilidade e consultoria com captacao organizada.$$ ,92,25,$$accounting$$,$$novo$$,$$seed$$),
    ($$Numeris Algarve$$,$$Patricia Alves$$,$$prospect+numeris-algarve@iaweb.pt$$,$$+351920000028$$,$$https://numerisalgarve.pt$$,$$Faro$$,$$Algarve$$,$$contabilidade$$,array[$$contabilidade algarve$$,$$alojamento local$$,$$fiscalidade$$],32,92,$$Critica$$,$$Baixa autoridade digital$$,$$Sem paginas para segmentos rentaveis$$,$$Captar negocios locais e alojamento local$$,$$Criar estrutura por servico fiscal$$,600,12000,7200,144000,$$Numeris Algarve: fiscalidade clara para negocios locais.$$ ,84,52,$$accounting$$,$$novo$$,$$seed$$),
    ($$Gestao e Contas Minho$$,$$Rita Fernandes$$,$$prospect+gestao-contas-minho@iaweb.pt$$,$$+351920000029$$,$$https://gestaocontasminho.pt$$,$$Guimaraes$$,$$Norte$$,$$contabilidade$$,array[$$contabilista guimaraes$$,$$gestao empresas$$,$$contas$$],55,81,$$Alta$$,$$Website institucional pouco comercial$$,$$Pouca diferenciacao por setor$$,$$Gerar reunioes com empresarios$$,$$Criar proposta clara por perfil de cliente$$,700,9000,8400,108000,$$Gestao e Contas Minho: contabilidade proxima para empresas ambiciosas.$$ ,88,33,$$accounting$$,$$novo$$,$$seed$$),
    ($$Coimbra Tax Partners$$,$$Miguel Sousa$$,$$prospect+coimbra-tax@iaweb.pt$$,$$+351920000030$$,$$https://coimbratax.pt$$,$$Coimbra$$,$$Centro$$,$$contabilidade$$,array[$$consultoria fiscal coimbra$$,$$contabilista$$,$$empresas$$],74,72,$$Media$$,$$Autoridade existe mas funil e pouco claro$$,$$Conteudo nao gera proxima acao$$,$$Converter reputacao em reunioes$$,$$Criar CTA consultivo e CRM simples$$,900,6500,10800,78000,$$Coimbra Tax Partners: consultoria fiscal com proxima acao clara.$$ ,94,20,$$accounting$$,$$novo$$,$$seed$$)
)
insert into public.prospects (
  empresa,
  contacto,
  email,
  telefone,
  website,
  cidade,
  regiao,
  nicho,
  keywords,
  score_digital,
  opportunity_score,
  priority_label,
  problemas_detectados,
  oportunidades,
  impacto_financeiro,
  homepage_gerada,
  score_projetado,
  melhoria_prevista,
  template_utilizado,
  status,
  source,
  created_at,
  updated_at
)
select
  empresa,
  contacto,
  email,
  telefone,
  website,
  cidade,
  regiao,
  nicho,
  keywords,
  score_digital,
  opportunity_score,
  priority_label,
  jsonb_build_array(problema_1, problema_2),
  jsonb_build_array(oportunidade_1, oportunidade_2),
  jsonb_build_object(
    'lostRevenueMonthly', jsonb_build_object('min', monthly_min, 'max', monthly_max),
    'lostRevenueAnnual', jsonb_build_object('min', annual_min, 'max', annual_max),
    'impactPhrase', $$Potencial estimado com base no cenario analisado, sem garantia de resultado.$$
  ),
  jsonb_build_object(
    'templateId', template_utilizado,
    'copy', jsonb_build_object('headline', homepage_headline)
  ),
  score_projetado,
  melhoria_prevista,
  template_utilizado,
  status,
  source,
  now(),
  now()
from seed_prospects
where not exists (
  select 1
  from public.prospects existing
  where existing.email = seed_prospects.email
);
