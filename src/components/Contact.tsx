import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github, ArrowUpRight, Copy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Separator, Tooltip, TooltipContent, TooltipTrigger, buttonVariants, useToast } from '@tessera/ui'
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
  const toast = useToast()

  const handleCopy = (label: string, rawValue: string, description?: string) => {
    navigator.clipboard.writeText(rawValue)
    toast.add({
      title: `${label} copied`,
      description: description ?? rawValue,
      type: 'success',
    })
  }

  // mailto: silently does nothing when no mail client is registered. If the
  // page keeps focus after the click, assume that and copy the address instead.
  const handleMailto = () => {
    setTimeout(() => {
      if (document.hasFocus() && document.visibilityState === 'visible') {
        handleCopy('Email', resume.contact.email, 'No mail app found — address copied to clipboard.')
      }
    }, 700)
  }

  return (
    <Section id="contact">
      <div ref={ref}>
        <SectionHeader number="06" title="Get in touch" subtitle="Open to full-time roles and contract work. Response within a day." />

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            {contactConfig.map(({ Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                {i > 0 && <Separator />}
                <div className="flex items-center gap-5 py-4">
                  <span className="text-muted-foreground w-4 flex-shrink-0"><Icon size={16} /></span>
                  <span className="font-mono text-xs text-muted-foreground w-20 flex-shrink-0 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="flex items-center gap-2">
                    {href ? (
                      <a
                        href={href}
                        onClick={label === 'Email' ? handleMailto : undefined}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {value}
                        <ArrowUpRight size={12} className="text-muted-foreground" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">{value}</span>
                    )}
                    {(label === 'Email' || label === 'Phone') && (
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              color="neutral"
                              size="icon-xs"
                              aria-label={`Copy ${label.toLowerCase()}`}
                              onClick={() => handleCopy(label, label === 'Phone' ? value.replace(/\s/g, '') : value)}
                            />
                          }
                        >
                          <Copy />
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              Whether it's a full-time position, a contract project, or you just want to
              talk tech — my inbox is open.
            </p>
            <a
              href={`mailto:${resume.contact.email}`}
              onClick={handleMailto}
              className={buttonVariants({ size: 'lg' })}
            >
              <Mail />
              {resume.contact.email}
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
