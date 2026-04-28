export default function Footer({ onToggleTheme = () => {} }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/60 bg-white/95 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
          <img src="/logo.svg" alt="Amurot" className="h-7 w-7 dark:invert dark:brightness-200" />
          <span className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Amurot</span>
          <span className="text-sm text-zinc-400 font-normal dark:text-zinc-500 sm:ml-4">
            © {year} Amurot. All rights reserved.
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:justify-end">
          <a href="#about" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200">
            About
          </a>
          <a href="#privacy" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200">
            Privacy
          </a>
          <a href="#terms" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200">
            Terms
          </a>
          <a href="#contact" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200">
            Contact
          </a>
          <button
            className="ml-2 p-2 rounded-full hover:bg-zinc-100 transition-colors dark:hover:bg-zinc-900"
            aria-label="Toggle theme"
            type="button"
            onClick={onToggleTheme}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </nav>
      </div>
    </footer>
  );
}
