import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonVariants, cn } from '@tessera/ui'
import { Section, SectionHeader } from './Section'
import { resume } from '../data/resume'
import type { Project } from '../data/resume'
import ProjectModal from './ProjectModal'

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <Section id="projects" className="bg-muted/40">
      <SectionHeader number="05" title="Projects" subtitle="Personal projects built outside of work." />
      <div ref={ref} className="grid md:grid-cols-2 gap-5">
        {resume.projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex"
          >
            <Card className="w-full gap-4">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <CardTitle role="heading" aria-level={3} className="text-lg font-bold leading-tight">
                    {project.name}
                  </CardTitle>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {project.language}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub repository"
                    className={buttonVariants({ variant: 'ghost', color: 'neutral', size: 'icon-sm' })}
                  >
                    <Github />
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live demo"
                      className={buttonVariants({ variant: 'ghost', color: 'neutral', size: 'icon-sm' })}
                    >
                      <ExternalLink />
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                {project.tech && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tag) => (
                      <Badge key={tag} size="sm" className="font-mono">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="justify-between gap-2">
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'link', color: 'primary', size: 'sm' }), 'font-mono px-0')}
                  >
                    View live <ExternalLink />
                  </a>
                ) : (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'link', color: 'primary', size: 'sm' }), 'font-mono px-0')}
                  >
                    View on GitHub <Github />
                  </a>
                )}
                {project.images && project.images.length > 0 && (
                  <Button
                    variant="outline"
                    color="neutral"
                    size="xs"
                    className="font-mono"
                    onClick={() => setSelectedProject(project)}
                  >
                    Details <span className="text-primary">→</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        <motion.a
          href={resume.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group flex"
        >
          <Card className="w-full items-center justify-center gap-3 text-center min-h-[140px] transition-colors group-hover:border-primary/50">
            <Github size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <p className="text-sm font-medium">More on GitHub</p>
              <p className="text-muted-foreground font-mono text-xs mt-0.5">@{resume.contact.githubHandle}</p>
            </div>
          </Card>
        </motion.a>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  )
}
