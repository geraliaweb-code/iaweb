import type { NicheEngine } from "./types"

export const restaurantNiche: NicheEngine = {
  id: "restaurantes",
  label: "Restaurantes",
  pains: [
    "Clientes decidem rapidamente com base em fotos, menu e reviews.",
    "Reservas e pedidos podem ficar espalhados por plataformas e mensagens.",
    "A experiencia do restaurante nem sempre aparece bem no digital.",
  ],
  opportunities: [
    "Criar pagina rapida com menu, reservas e localizacao.",
    "Melhorar apresentacao visual de pratos e ambiente.",
    "Captar eventos, grupos e reservas diretas sem depender so de plataformas.",
  ],
  objections: [
    "As redes sociais ja chegam.",
    "Nao precisamos de site, temos Google Maps.",
    "O cliente quer ver o menu rapido.",
  ],
  salesArguments: [
    "Redes sociais ajudam, mas o cliente precisa de uma pagina clara para decidir.",
    "Reservas diretas reduzem dependencia de terceiros.",
    "Menu, fotos e prova social podem aumentar visitas com pouca friccao.",
  ],
  estimatedRoi: "EUR 1.000-8.000/mes em reservas, eventos e pedidos diretos que podem estar dispersos.",
  keywords: ["restaurante", "reservas", "menu", "eventos privados", "restaurante perto de mim"],
  personalizedDiagnosis:
    "Restaurantes precisam de uma presenca rapida, visual e orientada a reservas para transformar interesse em mesas ocupadas.",
}
