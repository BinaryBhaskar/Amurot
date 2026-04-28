export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-24">
      <div className="card relative overflow-hidden px-6 py-10 md:px-12 md:py-12" data-dotfield-host>
        <div className="pointer-events-none absolute inset-0 hidden md:block" data-dotfield aria-hidden="true">
          <canvas className="absolute inset-0 h-full w-full" data-dotfield-canvas></canvas>
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 bg-linear-to-br from-sky-200/18 via-transparent to-violet-200/14 dark:from-sky-500/10 dark:to-violet-500/10"></div>
            <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/10 to-white/35 dark:from-zinc-950/0 dark:via-zinc-950/25 dark:to-zinc-950/55"></div>
          </div>
        </div>

        <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-start">
          <h2
            id="about-title"
            className="amurot-reveal text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-100 md:text-3xl"
          >
            About Amurot
          </h2>

          <div
            className="amurot-reveal space-y-4 text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
            data-reveal-delay="70"
          >
            <p>
              Amurot is a small team dedicated to building intelligent, minimal utility apps that enhance productivity
              without adding noise. We believe in tools that feel invisible — practical, elegant, and quietly intelligent.
            </p>
            <p>
              Our mission is to create tools that seamlessly integrate into your workflow, allowing you to focus on what
              truly matters. We prioritize simplicity, efficiency, and a calm user experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
