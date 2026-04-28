export default function Apps() {
  return (
    <section
      id="apps"
      aria-labelledby="apps-title"
      className="border-t border-zinc-200/60 py-20 md:py-24 dark:border-zinc-800/60"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="apps-title" className="amurot-reveal text-2xl font-medium tracking-tight text-zinc-950 md:text-3xl">
            Product vision
          </h2>
          <p
            className="amurot-reveal mt-3 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
            data-reveal-delay="60"
          >
            A small ecosystem of focused utilities — each one designed to remove friction from everyday work.
          </p>
        </div>

        <p className="amurot-reveal text-sm text-zinc-500 dark:text-zinc-400" data-reveal-delay="90">
          Apps are in development.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          className="card-hover amurot-reveal rounded-2xl border border-zinc-200/60 bg-white/70 p-7 dark:border-white/10 dark:bg-white/5"
          data-reveal-delay="20"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium tracking-tight text-zinc-950 dark:text-zinc-100">Utility One</h3>
            <span className="badge">Coming soon</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            A minimal utility with subtle AI assistance.
          </p>
        </article>

        <article
          className="card-hover amurot-reveal rounded-2xl border border-zinc-200/60 bg-white/70 p-7 dark:border-white/10 dark:bg-white/5"
          data-reveal-delay="60"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium tracking-tight text-zinc-950 dark:text-zinc-100">Utility Two</h3>
            <span className="badge">Coming soon</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Designed for real workflows — calm and precise.
          </p>
        </article>

        <article
          className="card-hover amurot-reveal rounded-2xl border border-zinc-200/60 bg-white/70 p-7 dark:border-white/10 dark:bg-white/5"
          data-reveal-delay="100"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium tracking-tight text-zinc-950 dark:text-zinc-100">Utility Three</h3>
            <span className="badge">Coming soon</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Quietly intelligent automation, without noise.
          </p>
        </article>
      </div>
    </section>
  );
}
