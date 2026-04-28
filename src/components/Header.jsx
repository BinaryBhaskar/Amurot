export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#" className="group inline-flex items-center gap-3">
          <img src="/logo.svg" alt="Amurot" className="h-7 w-7" />
          <span className="text-lg font-medium tracking-tight text-zinc-900 group-hover:text-zinc-950 sm:text-xl">
            Amurot
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#apps"
            className="inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-medium bg-white text-zinc-900 shadow-lg transition-all duration-200 ease-out border-2 border-transparent hover:border-sky-400"
          >
            View apps
          </a>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 focus:outline-none"
            aria-label="Open menu"
            type="button"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
              <rect x="6" y="9" width="14" height="2" rx="1" fill="#18181B" />
              <rect x="6" y="13" width="18" height="2" rx="1" fill="#18181B" />
              <rect x="6" y="17" width="12" height="2" rx="1" fill="#18181B" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
