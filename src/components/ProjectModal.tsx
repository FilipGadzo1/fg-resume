import { useRef } from 'react'
import { Github, ExternalLink } from 'lucide-react'
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  buttonVariants,
} from '@tessera/ui'
import type { Project } from '../data/resume'

type Props = {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  // Keep the last project mounted while the dialog animates closed.
  const last = useRef<Project | null>(null)
  if (project) last.current = project
  const shown = project ?? last.current
  const images = shown?.images ?? []

  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="max-w-5xl md:grid md:grid-cols-[1.4fr_1fr] gap-0 p-0 overflow-hidden">
        {shown && (
          <>
            <div className="bg-muted/50 p-4 md:p-5 md:border-r border-b md:border-b-0 border-border min-w-0">
              {images.length > 0 ? (
                <Carousel loop className="relative">
                  <CarouselContent>
                    {images.map((src, i) => (
                      <CarouselItem key={src} className="h-52 md:h-80 px-1">
                        <img
                          src={src}
                          alt={`${shown.name} screenshot ${i + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-3">
                      <CarouselPrevious />
                      <CarouselDots />
                      <CarouselNext />
                    </div>
                  )}
                </Carousel>
              ) : (
                <span className="text-muted-foreground text-sm font-mono">No images yet</span>
              )}
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-4 md:gap-5 overflow-y-auto">
              <div className="pr-8">
                <DialogTitle className="text-xl font-bold leading-tight">{shown.name}</DialogTitle>
                <span className="font-mono text-xs text-primary uppercase tracking-wider">
                  {shown.language}
                </span>
              </div>

              <DialogDescription className="text-sm leading-relaxed">
                {shown.description}
              </DialogDescription>

              {shown.tech && shown.tech.length > 0 && (
                <div>
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Tech stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shown.tech.map((tag) => (
                      <Badge key={tag} variant="outline" color="neutral" className="font-mono">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-auto pt-1">
                {shown.live && (
                  <a
                    href={shown.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ size: 'md' })}
                  >
                    View Live <ExternalLink />
                  </a>
                )}
                <a
                  href={shown.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', color: 'neutral', size: 'md' })}
                >
                  GitHub <Github />
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
