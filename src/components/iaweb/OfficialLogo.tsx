import Image from "next/image"

type OfficialLogoProps = {
  compact?: boolean
  priority?: boolean
  className?: string
}

export default function OfficialLogo({ compact = false, priority = false, className = "" }: OfficialLogoProps) {
  return (
    <span
      className={`group/logo relative inline-flex shrink-0 items-center rounded-xl transition duration-300 hover:scale-[1.03] ${className}`}
    >
      <span className="absolute inset-[-8px] rounded-2xl bg-[radial-gradient(circle_at_20%_50%,rgba(0,163,255,0.18),transparent_42%),radial-gradient(circle_at_80%_50%,rgba(255,184,0,0.14),transparent_42%)] opacity-70 blur-xl transition duration-300 group-hover/logo:opacity-100" />
      <Image
        src="/branding/logo-horizontal-navbar.png"
        alt="IAWEB"
        width={260}
        height={60}
        priority={priority}
        className={`relative w-auto object-contain drop-shadow-[0_0_14px_rgba(0,163,255,0.12)] ${
          compact ? "h-9 sm:h-10" : "h-10 md:h-12 xl:h-14"
        }`}
      />
    </span>
  )
}
