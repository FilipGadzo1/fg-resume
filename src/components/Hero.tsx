import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react'
import { resume } from '../data/resume'
import { fadeUp } from '../lib/motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.p {...fadeUp(0.1)} className="section-label mb-6">
              {resume.title} · {resume.contact.location}
            </motion.p>

            <motion.h1
              {...fadeUp(0.2)}
              className="text-[clamp(4rem,12vw,9rem)] font-black leading-none tracking-tight text-gray-900 dark:text-white mb-8"
            >
              {resume.nameFirst}
              <br />
              <span className="text-brand">{resume.nameLast}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.35)} className="text-gray-700 dark:text-zinc-400 text-lg max-w-xl leading-relaxed mb-10">
              {resume.bio}
            </motion.p>

            <motion.div {...fadeUp(0.55)} className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-200 dark:border-white/10">
              {resume.stats.map(({ value, label }, i) => (
                <div key={label} className={`flex flex-col ${i > 0 ? 'pl-6 border-l border-gray-200 dark:border-white/10' : ''}`}>
                  <span className="text-2xl font-black text-brand leading-none">{value}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-600 mt-1">{label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap items-center gap-3 mt-8">
              <a
                href={`mailto:${resume.contact.email}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors"
              >
                <Mail size={15} />
                Email me
              </a>
              <a
                href="/Filip_Gadzo_CV.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 dark:border-white/10 hover:border-brand/50 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-all"
              >
                <Download size={15} />
                Download CV
              </a>
              <a
                href={resume.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 dark:border-white/10 hover:border-brand/50 text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-all"
              >
                <Github size={15} />
                GitHub
              </a>
              <a
                href={resume.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 dark:border-white/10 hover:border-brand/50 text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-all"
              >
                <Linkedin size={15} />
                LinkedIn
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="w-64 h-80 lg:w-72 lg:h-88 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/8">
                <img src="/photo.jpg" alt={resume.name} className="w-full h-full object-cover object-bottom scale-[2]" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-2xl border-2 border-brand -z-10" />
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.5)} className="md:hidden mt-10 flex justify-center">
          <div className="w-40 h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/8">
            <img src="/photo.jpg" alt={resume.name} className="w-full h-full object-cover object-center scale-[2]" />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 dark:text-zinc-600 hover:text-gray-700 dark:hover:text-zinc-400 transition-colors"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <ArrowDown size={13} />
        </motion.span>
      </motion.a>
    </section>
  )
}
