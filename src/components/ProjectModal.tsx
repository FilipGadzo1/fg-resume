import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, X } from 'lucide-react'
import type { Project } from '../data/resume'

type Props = {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = project.images ?? []

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <motion.div
        className="relative z-10 w-full max-w-5xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-[1.4fr_1fr]">

          {/* Left: image gallery */}
          <div className="bg-gray-100 dark:bg-zinc-950 p-5 flex flex-col gap-3 border-r border-gray-200 dark:border-zinc-800 min-h-[400px]">
            <div className="flex-1 rounded-xl overflow-hidden bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={images[activeIndex]}
                  alt={`${project.name} screenshot ${activeIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400 dark:text-zinc-600 text-sm font-mono">
                  No images yet
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? 'border-brand opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="p-6 flex flex-col gap-5 overflow-y-auto">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-gray-900 dark:text-white font-bold text-xl leading-tight">
                  {project.name}
                </h2>
                <span className="font-mono text-xs text-brand uppercase tracking-wider">
                  {project.language}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-zinc-600 hover:text-gray-900 dark:hover:text-white transition-colors p-1 flex-shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed flex-1">
              {project.description}
            </p>

            {project.tech && project.tech.length > 0 && (
              <div>
                <p className="font-mono text-xs text-gray-400 dark:text-zinc-600 uppercase tracking-wider mb-2">
                  Tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 font-mono text-xs text-gray-700 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-brand text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  View Live <ExternalLink size={14} />
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg px-4 py-2.5 text-sm hover:border-gray-400 dark:hover:border-zinc-500 transition-colors"
              >
                GitHub <Github size={14} />
              </a>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}
