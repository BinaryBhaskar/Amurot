export default function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="border-t border-zinc-200/60 py-20 md:py-24 dark:border-zinc-800/60"
    >
      <h2 id="philosophy-title" className="amurot-reveal text-2xl font-medium tracking-tight text-zinc-950 md:text-3xl">
        Philosophy
      </h2>
      <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
        Everything we build is guided by a few simple principles.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <div
          className="amurot-reveal rounded-xl border border-zinc-100 bg-white/60 p-10 flex flex-col items-start dark:border-zinc-800/70 dark:bg-zinc-950/40"
          data-reveal-delay="40"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="h-7 w-7 text-sky-400"
            >
              <path d="M12 5V9" />
              <path d="M12 15V19" />
              <path d="M5 12H9" />
              <path d="M15 12H19" />
            </svg>
          </div>
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Simplicity</div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">
              We remove the unnecessary so you can focus on what matters.
            </div>
          </div>
        </div>

        <div
          className="amurot-reveal rounded-xl border border-zinc-100 bg-white/60 p-10 flex flex-col items-start dark:border-zinc-800/70 dark:bg-zinc-950/40"
          data-reveal-delay="80"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-sky-400"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Efficiency</div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">
              Powerful features, thoughtfully designed to save your time.
            </div>
          </div>
        </div>

        <div
          className="amurot-reveal rounded-xl border border-zinc-100 bg-white/60 p-10 flex flex-col items-start dark:border-zinc-800/70 dark:bg-zinc-950/40"
          data-reveal-delay="120"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-sky-400"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Calm</div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">
              A peaceful experience that helps you stay in the flow.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
