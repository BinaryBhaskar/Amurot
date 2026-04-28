import { useEffect, useRef, useState } from 'react';

export default function MobileMenu({ open, onClose, isDark, onToggleDarkMode }) {
  const closeBtnRef = useRef(null);

  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    let timeoutId = 0;

    if (open) {
      setShouldRender(true);
      // Next frame so transitions can run.
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      timeoutId = window.setTimeout(() => setShouldRender(false), 260);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    if (isVisible) closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [shouldRender, isVisible, onClose]);

  if (!shouldRender) return null;

  const onNavClick = () => onClose();

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className={`absolute inset-0 transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100 bg-black/20 dark:bg-black/50' : 'opacity-0 bg-black/0'
        }`}
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[340px] max-w-[92vw] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-full flex-col">
          <div className="px-6 pb-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="Amurot" className="h-7 w-7 dark:invert dark:brightness-200" />
                <div className="min-w-0">
                  <div className="text-base font-medium tracking-tight">Amurot</div>
                  <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">AI-assisted utility apps</div>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="-mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Close"
                onClick={onClose}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-zinc-600 dark:text-zinc-300">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6">
            <div className="border-t border-zinc-200/70 dark:border-zinc-800/70" />
          </div>

          <div className="px-6 pt-5">
            <nav className="space-y-1">
              <a
                href="#apps"
                onClick={onNavClick}
                className="flex items-center gap-4 rounded-xl px-2 py-3 text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-zinc-500 dark:text-zinc-400"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="7"
                      height="7"
                      rx="1.25"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <rect
                      x="13"
                      y="4"
                      width="7"
                      height="7"
                      rx="1.25"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <rect
                      x="4"
                      y="13"
                      width="7"
                      height="7"
                      rx="1.25"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <rect
                      x="13"
                      y="13"
                      width="7"
                      height="7"
                      rx="1.25"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                  </svg>
                </span>
                View apps
              </a>

              <a
                href="#about"
                onClick={onNavClick}
                className="flex items-center gap-4 rounded-xl px-2 py-3 text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-zinc-500 dark:text-zinc-400">
                    <path
                      d="M12 17v-6m0-3h.01"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                About
              </a>

              <a
                href="#terms"
                onClick={onNavClick}
                className="flex items-center gap-4 rounded-xl px-2 py-3 text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-zinc-500 dark:text-zinc-400">
                    <path
                      d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Help
              </a>

              <a
                href="#contact"
                onClick={onNavClick}
                className="flex items-center gap-4 rounded-xl px-2 py-3 text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-zinc-500 dark:text-zinc-400">
                    <path
                      d="M4 6h16v12H4V6Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 7l8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Contact
              </a>
            </nav>
          </div>

          <div className="mt-auto">
            <div className="px-6">
              <div className="border-t border-zinc-200/70 dark:border-zinc-800/70" />
            </div>

            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-500 dark:text-zinc-400">
                  <path
                    d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Dark mode
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={onToggleDarkMode}
                className="relative inline-flex h-7 w-12 items-center rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-zinc-950 shadow-sm transition-transform ${
                    isDark ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
