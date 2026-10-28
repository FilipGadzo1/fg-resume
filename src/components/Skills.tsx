import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge, Separator } from '@tessera/ui'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="skills" className="bg-muted/40">
      <SectionHeader number="03" title="Skills" />
      <div ref={ref}>
        {resume.skills.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07 }}
          >
            {i > 0 && <Separator />}
            <div className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-12 py-5 items-baseline">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item} variant="outline" color="neutral">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
