import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@tessera/ui'
import { ThemeProvider } from './context/ThemeContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Backdrop from './components/Backdrop'

export default function App() {
  return (
    <ThemeProvider>
      <Toaster>
        <ScrollProgress />
        {/* No background on this wrapper: the fixed 3D backdrop sits behind it (body paints the page color). */}
        <div className="min-h-screen text-foreground">
          <Backdrop />
          <Nav />
          <main>
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Education />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
        <Analytics />
      </Toaster>
    </ThemeProvider>
  )
}
