import { useEffect } from 'react';

import { initAmurotEffects } from './lib/amurotEffects.js';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Philosophy from './components/Philosophy.jsx';
import Apps from './components/Apps.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
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
        <Header />

        <Hero />

        <main id="main" className="mx-auto max-w-6xl px-6">
          <About />
          <Philosophy />
          <Apps />
        </main>

        <Footer />
      </div>
    </>
  );
}
