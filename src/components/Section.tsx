import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className = '' }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id={id} ref={ref} className={`py-24 px-6 ${className}`}>
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
    <div className="mb-14 flex items-end gap-6 pb-6 border-b border-gray-200 dark:border-white/5">
      <div className="flex-1">
        <p className="section-label mb-3">{number}</p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-gray-600 dark:text-zinc-500 text-sm mt-2">{subtitle}</p>}
      </div>
    </div>
  )
}
