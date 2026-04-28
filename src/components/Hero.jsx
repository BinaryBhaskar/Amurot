export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-minus-header flex items-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full text-zinc-200/60 dark:text-zinc-800/60"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="amurot-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <radialGradient id="amurot-fade" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.85" />
              <stop offset="55%" stopColor="white" stopOpacity="0.35" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="amurot-mask">
              <rect width="1200" height="700" fill="url(#amurot-fade)" />
            </mask>
          </defs>
          <rect width="1200" height="700" fill="url(#amurot-grid)" mask="url(#amurot-mask)" />
        </svg>

        <svg
          className="absolute -bottom-20 left-1/2 h-[360px] w-[1200px] -translate-x-1/2 opacity-80"
          viewBox="0 0 1200 360"
          fill="none"
        >
          <g className="amurot-drift" style={{ transformOrigin: '50% 50%' }}>
            <path
              d="M0 210 C 121 170, 240 250, 360 210 S 600 170, 720 210 960 250, 1200 210"
              className="stroke-current text-sky-200/70 dark:text-sky-400/20"
              strokeWidth="1.25"
            />
            <path
              d="M0 250 C 160 210, 280 290, 440 250 S 720 210, 880 250 1040 290, 1200 250"
              className="stroke-current text-violet-200/55 dark:text-violet-400/16"
              strokeWidth="1.25"
            />
            <path
              d="M0 290 C 140 260, 320 320, 500 290 S 780 260, 940 290 1100 320, 1200 290"
              className="stroke-current text-cyan-200/55 dark:text-cyan-400/14"
              strokeWidth="1.25"
            />
          </g>
        </svg>

        <div className="absolute left-1/2 top-[640px] -translate-x-1/2">
          <div className="amurot-parallax" data-parallax-layer="18">
            <div className="amurot-float h-[520px] w-[520px] rounded-full bg-linear-to-br from-sky-300/30 via-cyan-200/10 to-violet-300/30 blur-3xl dark:from-sky-500/12 dark:via-cyan-500/6 dark:to-violet-500/12"></div>
          </div>
        </div>
        <div className="absolute right-[-120px] top-20">
          <div className="amurot-parallax" data-parallax-layer="12">
            <div className="amurot-float-slower h-[420px] w-[420px] rounded-full bg-linear-to-br from-violet-300/22 via-sky-200/10 to-cyan-200/22 blur-3xl dark:from-violet-500/10 dark:via-sky-500/6 dark:to-cyan-500/10"></div>
          </div>
        </div>
        <div className="absolute -left-40 top-[220px]">
          <div className="amurot-parallax" data-parallax-layer="10">
            <div className="amurot-float h-[460px] w-[460px] rounded-full bg-linear-to-br from-cyan-200/20 via-sky-200/10 to-violet-200/20 blur-3xl dark:from-cyan-500/10 dark:via-sky-500/6 dark:to-violet-500/10"></div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="amurot-reveal text-balance text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-100 md:text-6xl">
            AI assisted utility apps for{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              calm productivity
            </span>
          </h1>
          <p
            className="amurot-reveal mt-5 text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg"
            data-reveal-delay="60"
          >
            Minimal tools that feel invisible - practical, elegant, and quietly intelligent.
          </p>
          <div className="amurot-reveal mt-10 flex items-center justify-center" data-reveal-delay="110">
            <a
              className="btn btn-primary border-2 border-transparent transition-all duration-200 ease-out hover:border-transparent hover:bg-gradient-to-r hover:from-sky-400 hover:via-blue-500 hover:to-blue-400 hover:text-white"
              href="#apps"
            >
              View apps
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-40 w-full z-20 bg-gradient-to-b from-white/0 via-white/0 to-white dark:from-zinc-950/0 dark:via-zinc-950/0 dark:to-zinc-950" />
    </section>
  );
}
