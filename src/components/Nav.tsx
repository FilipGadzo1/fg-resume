import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Download } from 'lucide-react'
import { buttonVariants, cn } from '@tessera/ui'
import { resume } from '../data/resume'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 border-b backdrop-blur-lg transition-all duration-300',
        scrolled
          ? 'bg-background/90 border-border shadow-sm'
          : 'bg-background/60 border-transparent',
      )}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-sm font-bold tracking-widest hover:text-primary transition-colors"
        >
          FG
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={buttonVariants({ variant: 'ghost', color: 'neutral', size: 'sm' })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/Filip_Gadzo_CV.pdf"
            download
            className={cn(
              buttonVariants({ variant: 'outline', color: 'neutral', size: 'sm' }),
              'hidden md:inline-flex font-mono',
            )}
          >
            <Download />
            CV
          </a>
          <a
            href={resume.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={buttonVariants({ variant: 'ghost', color: 'neutral', size: 'icon-sm' })}
          >
            <Github />
          </a>
          <ThemeToggle />
          <a
            href="#contact"
            className={cn(buttonVariants({ size: 'sm' }), 'hidden md:inline-flex')}
          >
            Hire me
          </a>
        </div>

        <div className="flex md:hidden gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  )
}
