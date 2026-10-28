import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Separator, cn } from '@tessera/ui'

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id={id} ref={ref} className={cn('py-24 px-6', className)}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  )
}

interface SectionHeaderProps {
  number: string
  title: string
  subtitle?: string
}

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <div className="pb-6">
        <p className="section-label mb-3">{number}</p>
        <h2 className="text-3xl md:text-4xl font-black">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>}
      </div>
      <Separator />
    </div>
  )
}
