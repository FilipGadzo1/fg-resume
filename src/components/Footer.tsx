import { resume } from '../data/resume'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-gray-600 dark:text-zinc-600 text-xs">
        <span className="font-mono">{resume.name} · {new Date().getFullYear()}</span>
        <span>Built with React &amp; TypeScript</span>
        <a
          href={resume.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono hover:text-gray-800 dark:hover:text-zinc-400 transition-colors"
        >
          github.com/{resume.contact.githubHandle}
        </a>
      </div>
    </footer>
  )
}
