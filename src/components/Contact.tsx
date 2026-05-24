import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github, ArrowUpRight, Copy, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'

type ContactConfig = { Icon: LucideIcon; label: string; value: string; href: string | null }

const contactConfig: ContactConfig[] = [
  { Icon: Mail, label: 'Email', value: resume.contact.email, href: `mailto:${resume.contact.email}` },
  { Icon: Phone, label: 'Phone', value: resume.contact.phone, href: `tel:${resume.contact.phone.replace(/\s/g, '')}` },
  { Icon: Linkedin, label: 'LinkedIn', value: `/${resume.contact.linkedinHandle}`, href: resume.contact.linkedin },
  { Icon: Github, label: 'GitHub', value: `@${resume.contact.githubHandle}`, href: resume.contact.github },
  { Icon: MapPin, label: 'Location', value: resume.contact.location, href: null },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)

  const handleCopy = (label: string, rawValue: string) => {
    navigator.clipboard.writeText(rawValue)
    setCopiedLabel(label)
    setTimeout(() => setCopiedLabel(null), 2000)
  }

  return (
    <Section id="contact">
      <div ref={ref}>
        <SectionHeader number="06" title="Get in touch" subtitle="Open to full-time roles and contract work. Response within a day." />

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {contactConfig.map(({ Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex items-center gap-5 py-4"
              >
                <span className="text-gray-600 dark:text-zinc-600 w-4 flex-shrink-0"><Icon size={16} /></span>
                <span className="font-mono text-xs text-gray-600 dark:text-zinc-600 w-20 flex-shrink-0 uppercase tracking-wider">
                  {label}
                </span>
                <span className="flex items-center gap-2">
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors flex items-center gap-1 group"
                    >
                      {value}
                      <ArrowUpRight size={12} className="text-gray-400 dark:text-zinc-600 group-hover:text-brand transition-colors" />
                    </a>
                  ) : (
                    <span className="text-gray-700 dark:text-zinc-400 text-sm">{value}</span>
                  )}
                  {(label === 'Email' || label === 'Phone') && (
                    <button
                      onClick={() => handleCopy(label, label === 'Phone' ? value.replace(/\s/g, '') : value)}
                      title="Copy to clipboard"
                      className="flex items-center"
                    >
                      {copiedLabel === label
                        ? <Check size={12} className="text-green-500" />
                        : <Copy size={12} className="text-gray-400 dark:text-zinc-600 hover:text-gray-700 dark:hover:text-zinc-400 cursor-pointer" />
                      }
                    </button>
                  )}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-700 dark:text-zinc-400 leading-relaxed mb-8 text-sm">
              Whether it's a full-time position, a contract project, or you just want to
              talk tech — my inbox is open.
            </p>
            <a
              href={`mailto:${resume.contact.email}`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors"
            >
              <Mail size={15} />
              {resume.contact.email}
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
