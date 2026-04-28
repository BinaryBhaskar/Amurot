import { useEffect, useState } from 'react';

import { initAmurotEffects } from './lib/amurotEffects.js';
import { useDarkMode } from './lib/useDarkMode.js';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Philosophy from './components/Philosophy.jsx';
import Apps from './components/Apps.jsx';
import Footer from './components/Footer.jsx';
import MobileMenu from './components/MobileMenu.jsx';

export default function App() {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cleanup = initAmurotEffects();
    return cleanup;
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="relative">
        <Header onOpenMenu={() => setMenuOpen(true)} />

        <Hero />

        <main id="main" className="mx-auto max-w-6xl px-6">
          <About />
          <Philosophy />
          <Apps />
        </main>

        <Footer onToggleTheme={toggleDarkMode} />
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />
    </>
  );
}
