import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

export default function Education() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="education">
      <SectionHeader number="04" title="Education" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-12"
      >
        <div className="md:text-right">
          <p className="font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider">
            {resume.education.period}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{resume.education.school}</h3>
          <p className="text-brand text-sm font-medium mb-1">{resume.education.degree}</p>
          <p className="text-gray-600 dark:text-zinc-600 text-sm">{resume.education.location}</p>
        </div>
      </motion.div>
    </Section>
  )
}
