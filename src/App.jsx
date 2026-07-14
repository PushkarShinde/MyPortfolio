import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import { Experiences } from './sections/Experiences'
import Testimonial from './sections/Testimonial'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

function App() {
  const location = useLocation();

  // Handle hash-based scroll when navigating from blog pages back to
  // homepage sections (e.g. /blog → "About" → /#about). React Router's
  // BrowserRouter does not auto-scroll to URL hashes on route change.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Small delay lets the DOM settle after route transition
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className='container mx-auto max-w-7xl'>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experiences />
      {/* <Testimonial/> */}
      <Contact />
      <Footer />
    </div>
  )
}

export default App