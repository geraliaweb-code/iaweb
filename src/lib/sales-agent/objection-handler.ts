import { buildSalesContext } from "./message-engine"
import type { ObjectionKey, SalesAgentInput } from "./types"

export function generateObjectionResponses(input: SalesAgentInput): Record<ObjectionKey, string> {
  const context = buildSalesContext(input)

  return {
    nao_tenho_interesse_agora: `Percebo perfeitamente. A ideia nao e pressionar. Posso enviar-lhe apenas a simulacao para guardar? Assim, quando fizer sentido, ja tem uma referencia clara do que pode melhorar na ${context.company}.`,
    ja_tenho_site: `Claro, e isso e bom. A questao aqui nao e ter ou nao ter site. E perceber se o site atual esta a gerar confianca, contactos e oportunidades. A simulacao compara o estado atual com uma versao mais orientada a captacao.`,
    esta_caro: `Entendo. O ponto importante e comparar o investimento com a oportunidade que pode estar a ficar invisivel. Se a melhoria ajudar a captar apenas alguns contactos qualificados, o retorno pode justificar a decisao. Podemos comecar pelo passo mais leve.`,
    tenho_alguem: `Sem problema. Nesse caso, a simulacao pode ate servir como referencia estrategica para essa pessoa. O objetivo e mostrar o que a ${context.company} pode comunicar melhor para ganhar mais credibilidade e contactos.`,
    depois_vejo: `Combinado. Para facilitar, posso enviar um resumo curto com o score atual, score projetado e a simulacao visual. Assim fica com tudo para ver quando tiver disponibilidade.`,
    nao_acredito: `E uma duvida justa. Tambem nao prometemos resultados garantidos. O que mostramos e uma melhoria concreta na clareza, confianca e caminho de contacto. Depois medimos com dados reais: visitas, pedidos e conversas geradas.`,
  }
}
