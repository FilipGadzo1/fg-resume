import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="about" className="bg-gray-100 dark:bg-bg-surface/40">
      <SectionHeader number="01" title="About" />

      <div ref={ref} className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-gray-800 dark:text-zinc-300 text-lg leading-relaxed mb-5">
            I'm a full-stack developer based in Uppsala, Sweden. I've spent the last 3+ years
            working on enterprise fintech software for Apollo Global Management — complex
            trading and financial workflows that have to be both rock-solid and easy to use.
          </p>
          <p className="text-gray-700 dark:text-zinc-500 leading-relaxed">
            I care about the details: readable code, coherent UI behavior, and software
            that stays maintainable as teams and requirements change. I integrate AI tools
            like Claude and Cursor into my daily workflow, which means I ship faster without
            cutting corners.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-6"
        >
          <dl className="space-y-0">
            {[
              { label: 'Location', value: resume.contact.location },
              { label: 'Focus', value: 'Frontend & Full-Stack' },
              { label: 'Experience', value: '3+ years' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-6 py-4 border-b border-gray-200 dark:border-white/5">
                <dt className="w-28 font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider flex-shrink-0 pt-0.5">
                  {label}
                </dt>
                <dd className="text-gray-800 dark:text-zinc-300 font-medium text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider mb-3">Languages</p>
            <div className="space-y-2.5">
              {resume.languages.map(({ name, level, proficiency }) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-700 dark:text-zinc-400">{name}</span>
                  <div className="flex-1 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${proficiency}%` }} />
                  </div>
                  <span className="font-mono text-xs text-gray-600 dark:text-zinc-600 w-10 text-right">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
