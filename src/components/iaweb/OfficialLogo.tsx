type OfficialLogoProps = {
  compact?: boolean
  priority?: boolean
  className?: string
}

export default function OfficialLogo({ compact = false, className = "" }: OfficialLogoProps) {
  return (
    <span
      className={`group/logo relative inline-flex shrink-0 items-center transition duration-300 hover:scale-[1.03] ${className}`}
      aria-label="IAWEB"
    >
      <span className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle_at_22%_50%,rgba(255,184,0,0.16),transparent_42%),radial-gradient(circle_at_78%_50%,rgba(0,163,255,0.18),transparent_46%)] opacity-65 blur-xl transition duration-300 group-hover/logo:opacity-100" />
      <span
        className={`relative inline-flex items-baseline font-black leading-none tracking-[-0.085em] text-white ${
          compact ? "text-[28px] sm:text-[32px]" : "text-[28px] md:text-[34px]"
        }`}
      >
        <span className="bg-gradient-to-r from-white via-[#FFF4C7] to-[#FFB800] bg-clip-text pr-[0.03em] text-transparent drop-shadow-[0_0_12px_rgba(255,184,0,0.16)]">
          IA
        </span>
        <span className="bg-gradient-to-r from-white via-[#BFEAFF] to-[#00A3FF] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(0,163,255,0.2)]">
          WEB
        </span>
      </span>
    </span>
  )
}
