import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Download } from 'lucide-react'
import { resume } from '../data/resume'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'About', href: '#about', disabled: false },
  { label: 'Experience', href: '#experience', disabled: false },
  { label: 'Projects', href: '#projects', disabled: false },
  { label: 'Contact', href: '#contact', disabled: false },
]

function NavLink({ label, href, disabled, desktop }: { label: string; href: string; disabled: boolean; desktop?: boolean }) {
  if (disabled) {
    return (
      <span className={`cursor-not-allowed text-zinc-400 dark:text-zinc-700 ${desktop ? 'text-sm font-medium flex items-center gap-1.5' : 'text-xs'}`}>
        {label}
        {desktop && (
          <span className="font-mono text-[9px] uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 px-1.5 py-0.5 rounded">soon</span>
        )}
      </span>
    )
  }
  return (
    <a
      href={href}
      className={`transition-colors text-zinc-700 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white ${desktop ? 'text-sm font-medium' : 'text-xs'}`}
    >
      {label}
    </a>
  )
}

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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-100/95 dark:bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-300 dark:border-white/5 shadow-sm'
          : 'bg-zinc-100/80 dark:bg-transparent backdrop-blur-sm border-b border-zinc-200/60 dark:border-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-sm font-bold tracking-widest text-zinc-900 dark:text-white hover:text-brand dark:hover:text-brand transition-colors"
        >
          FG
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink {...link} desktop />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="/Filip_Gadzo_CV.pdf"
            download
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-400 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 hover:border-zinc-600 hover:bg-zinc-200 dark:hover:text-white dark:hover:border-brand/40 font-mono transition-all"
          >
            <Download size={13} />
            CV
          </a>
          <a
            href={resume.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <ThemeToggle />
          <a
            href={`mailto:${resume.contact.email}`}
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white/10 text-sm text-white dark:text-zinc-300 hover:bg-brand dark:hover:bg-brand dark:hover:text-white font-medium transition-all"
          >
            Hire me
          </a>
        </div>

        <div className="flex md:hidden gap-5">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </nav>
    </motion.header>
  )
}
