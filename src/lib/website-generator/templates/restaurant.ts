import type { WebsiteTemplate } from "../types"

export const restaurantTemplate: WebsiteTemplate = {
  id: "restaurant",
  nicheAliases: ["restaurantes", "restaurante", "restaurant"],
  palette: {
    name: "Preto, creme e vermelho vinho",
    colors: ["#111111", "#FFF7ED", "#8B1E3F"],
    labels: ["ambiente", "apetite", "reserva"],
  },
  headline: (company) => `${company}: transformar visitas em reservas, pedidos e clientes recorrentes.`,
  subheadline: () => "Homepage visual para comunicar ambiente, menu, localizacao e reserva com minimo atrito.",
  cta: "Reservar mesa",
  services: ["Reservas online", "Menu em destaque", "Eventos e grupos", "Pedidos e contactos"],
  about: (company) => `${company} passa a vender experiencia antes da chegada do cliente, com menu, ambiente e CTA claro.`,
  differentiators: ["Ambiente visivel", "Menu facil", "Reserva rapida", "Localizacao clara"],
  testimonials: ["Reservei em poucos segundos.", "O site transmitiu exatamente o ambiente do restaurante."],
  faq: [
    { question: "O objetivo principal e reserva?", answer: "Sim, o fluxo reduz passos entre descoberta e reserva." },
    { question: "Pode captar grupos?", answer: "Sim, a estrutura destaca eventos, menus e pedidos especiais." },
  ],
  contactCta: () => "Transformar procura em reserva.",
  footer: (company) => `${company} - reservas, experiencia e contacto sem friccao.`,
  structure: ["Hero apetecivel", "Menu", "Reservas", "Prova social", "Localizacao", "Contacto"],
  packageName: "Homepage Premium desde EUR 299",
}
