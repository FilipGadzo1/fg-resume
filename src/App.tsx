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

export default function App() {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <div className="min-h-screen text-gray-900 dark:text-white">
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
    </ThemeProvider>
  )
}
