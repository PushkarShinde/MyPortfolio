import { useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // On the homepage, use plain anchor links for smooth in-page scroll.
  // On other pages (e.g. /blogs), use router Links to navigate back to /#section.
  const sectionLinks = [
    { label: "Home", hash: "home" },
    { label: "About", hash: "about" },
    { label: "Work", hash: "work" },
    { label: "Contact", hash: "contact" },
  ];

  return (
    <ul className="nav-ul">
      {sectionLinks.map(({ label, hash }) => (
        <li key={hash} className="nav-li">
          {isHome ? (
            <a href={`#${hash}`} className="nav-link">
              {label}
            </a>
          ) : (
            <Link to={`/#${hash}`} className="nav-link">
              {label}
            </Link>
          )}
        </li>
      ))}
      <li className="nav-li">
        <Link
          to="/blogs"
          className={`nav-link ${
            location.pathname.startsWith("/blogs")
              ? "text-white"
              : ""
          }`}
        >
          Blogs
        </Link>
      </li>
    </ul>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-0">
          <Link to="/" className="text-xl font-bold transition-colors text-neutral-400 hover:text-white">
            Pushkar Shinde
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden"
          >
            <img
              src={isMenuOpen ? "/assets/close.svg" : "/assets/menu.svg"}
              alt="toggle menu"
              className="w-6 h-6"
            />
          </button>

          <nav className='hidden sm:flex'>
            <Navigation />
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          className='block overflow-hidden text-center sm:hidden'
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: '100vh' }}
          transition={{ duration: 0.75 }}
        >
          <nav className="pb-5">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </div>
  )
}

export default Navbar;