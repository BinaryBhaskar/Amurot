export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.svg" alt="Amurot" className="h-7 w-7" />
          <span className="text-lg font-medium tracking-tight text-zinc-900 whitespace-nowrap">Amurot</span>
          <span className="ml-4 text-sm text-zinc-400 font-normal whitespace-nowrap">
            © {year} Amurot. All rights reserved.
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <a href="#about" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            About
          </a>
          <a href="#privacy" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            Privacy
          </a>
          <a href="#terms" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            Terms
          </a>
          <a href="#contact" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            Contact
          </a>
          <button
            className="ml-2 p-2 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Toggle theme"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zinc-400"
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
