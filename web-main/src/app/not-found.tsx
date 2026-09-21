import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="site-container relative z-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <p className="font-mono text-sm font-bold tracking-[0.18em] text-[var(--gec-crimson)]">
          404 / OFF THE MAP
        </p>
        <div>
          <h1 className="display-title">This idea has not been built yet.</h1>
          <p className="lead-copy mb-8">
            The page may have moved, or the route may still be waiting for its
            first version.
          </p>
          <Link className="button-primary" href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}

