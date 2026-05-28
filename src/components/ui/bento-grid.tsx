import { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={cn('grid w-full auto-rows-[22rem] grid-cols-3 gap-4', className)}>
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string
  className: string
  background: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any
  description: string
  href: string
  cta: string
}) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl',
      'bg-white/[0.025] border border-white/[0.07]',
      '[box-shadow:0_-20px_80px_-20px_rgba(251,191,36,0.04)_inset]',
      className,
    )}
  >
    <div className="absolute inset-0">{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon
        className="h-10 w-10 origin-left transform-gpu text-amber-400/70 transition-all duration-300 ease-in-out group-hover:scale-75"
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-bold text-white mt-2">{name}</h3>
      <p className="max-w-lg text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>

    <div
      className={cn(
        'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="pointer-events-auto text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
        asChild
      >
        <a href={href}>
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-amber-500/[0.02] rounded-2xl" />
  </div>
)

export { BentoCard, BentoGrid }
