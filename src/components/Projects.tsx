import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'
import type { Project } from '../data/resume'
import ProjectModal from './ProjectModal'

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <Section id="projects" className="bg-gray-100 dark:bg-bg-surface/40">
      <SectionHeader number="05" title="Projects" subtitle="Personal projects built outside of work." />
      <div ref={ref} className="grid md:grid-cols-2 gap-5">
        {resume.projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group card-clean rounded-xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight mb-1">
                  {project.name}
                </h3>
                <span className="font-mono text-xs text-gray-600 dark:text-zinc-600 uppercase tracking-wider">
                  {project.language}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-zinc-600 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="GitHub repository"
                >
                  <Github size={17} />
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-zinc-600 hover:text-brand transition-colors"
                    aria-label="Live demo"
                  >
                    <ExternalLink size={17} />
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-700 dark:text-zinc-500 text-sm leading-relaxed flex-1">
              {project.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand text-xs font-mono hover:underline"
                >
                  View live <ExternalLink size={11} />
                </a>
              ) : (
                <span />
              )}
              {project.images && project.images.length > 0 && (
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700 rounded-md px-2.5 py-1 hover:border-gray-400 dark:hover:border-zinc-500 hover:text-gray-800 dark:hover:text-zinc-300 transition-colors"
                >
                  Details <span className="text-brand">→</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}

        <motion.a
          href={resume.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group card-clean rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]"
        >
          <Github size={24} className="text-gray-500 dark:text-zinc-600 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
          <div>
            <p className="text-gray-700 dark:text-zinc-400 text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              More on GitHub
            </p>
            <p className="text-gray-600 dark:text-zinc-600 font-mono text-xs mt-0.5">
              @{resume.contact.githubHandle}
            </p>
          </div>
        </motion.a>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.name}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  )
}
