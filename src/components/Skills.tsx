import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="skills" className="bg-gray-100 dark:bg-bg-surface/40">
      <SectionHeader number="03" title="Skills" />
      <div ref={ref} className="divide-y divide-gray-200 dark:divide-white/5">
        {resume.skills.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-12 py-5 items-baseline"
          >
            <span className="font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider">
              {group.category}
            </span>
            <span className="text-gray-800 dark:text-zinc-300 text-sm">
              {group.items.join(' · ')}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
