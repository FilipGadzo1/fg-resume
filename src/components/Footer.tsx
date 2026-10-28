import { Separator } from '@tessera/ui'
import { resume } from '../data/resume'

export default function Footer() {
  return (
    <footer>
      <Separator />
      <div className="py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
          <span className="font-mono">{resume.name} · {new Date().getFullYear()}</span>
          <span>Built with React, TypeScript &amp; Tessera</span>
          <a
            href={resume.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-foreground transition-colors"
          >
            github.com/{resume.contact.githubHandle}
          </a>
        </div>
      </div>
    </footer>
  )
}
