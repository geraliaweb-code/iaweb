import Image from 'next/image'

const LINKS = {
  Serviços: ['Geração de Leads', 'Qualificação IA', 'Distribuição Digital', 'Relatórios'],
  Processo: ['Diagnóstico', 'Ativação', 'Entrega', 'Escalamento'],
  Empresa: ['Sobre a IAWEB', 'Casos de Sucesso', 'Política de Privacidade', 'Contacto'],
}

export default function FooterSection() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/[0.05]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-1 space-y-5">
            {/* Logo */}
            <div className="isolate">
              <Image
                src="/brand/iaweb-logo.png"
                alt="IAWEB"
                width={250}
                height={80}
                className="h-16 w-auto mix-blend-screen"
              />
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              Aquisição inteligente para empresas de energia solar.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Sistema operacional · PT &amp; ES
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <p className="text-xs font-bold text-slate-500 tracking-[0.15em] uppercase">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} IAWEB. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-700">
            Construído com IA · Portugal
          </p>
        </div>
      </div>
    </footer>
  )
}
