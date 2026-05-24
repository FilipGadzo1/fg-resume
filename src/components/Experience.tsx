import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeader number="02" title="Experience" subtitle="Where I've worked and what I've shipped." />
      <div className="space-y-12">
        {resume.experience.map((job, i) => (
          <ExperienceEntry key={job.company} job={job} index={i} />
        ))}
      </div>
    </Section>
  )
}

function ExperienceEntry({ job, index }: { job: (typeof resume.experience)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-12"
    >
      <div className="md:text-right md:pt-1">
        <p className="font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider mb-2">
          {job.period}
        </p>
        {job.current && (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
            Current
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">{job.company}</h3>
        <p className="text-brand text-sm font-medium mb-5">{job.role}</p>
        <ul className="space-y-2.5">
          {job.highlights.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="flex gap-3 text-gray-800 dark:text-zinc-400 text-sm leading-relaxed"
            >
              <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full bg-brand block" />
              {point}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
