import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStories } from '@/lib/api';
import { withStoryContent } from '@/lib/storyContent';
import { RouteHero } from '@/components/route/RouteHero';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';

type Props = { params: Promise<{ slug: string }> };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

export async function generateStaticParams() {
  return (await getStories()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = (await getStories()).find((s) => s.slug === slug);
  return story
    ? { title: `${story.title} | GEC Stories`, description: story.excerpt }
    : { title: 'Story not found | GEC Stories' };
}

/**
 * One story: hero, cover + byline, then the long-form body with its pull quote after
 * the first section. Stories without a body still render the cover, byline and tags.
 */
export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const stories = (await getStories()).map(withStoryContent);
  const i = stories.findIndex((s) => s.slug === slug);
  if (i === -1) notFound();
  const story = stories[i];
  const next = stories[(i + 1) % stories.length];

  return (
    <main aria-label={story.title}>
      <RouteHero
        kicker={story.category.toUpperCase()}
        title={story.title}
        lede={story.excerpt}
        anchors={[{ href: '/stories', label: '← All stories' }]}
      />

      <section className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap rt-grid">
          <div className="rt-c7 rt-cover">
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS URL, dimensions unknown */}
            {story.coverImage && <img src={story.coverImage} alt="" />}
            {story.startupName && <span className="rt-cover__tag rt-mono">{story.startupName}</span>}
          </div>
          <aside className="rt-c5 brand-card rt-stack" style={{ alignSelf: 'start' }}>
            {story.authorOrFounder && (
              <div><span className="rt-mono rt-muted">Founder</span><p className="h3-card">{story.authorOrFounder}</p></div>
            )}
            <div className="rt-mono rt-muted">{[story.readTime, fmtDate(story.publishedAt)].filter(Boolean).join(' · ')}</div>
            {story.metrics && (
              <dl className="rt-metrics">
                {story.metrics.map((m) => (
                  <div key={m.label}><dt className="rt-mono rt-muted">{m.label}</dt><dd>{m.value}</dd></div>
                ))}
              </dl>
            )}
            {story.tags && story.tags.length > 0 && (
              <div className="rt-chips" style={{ marginTop: 14 }}>
                {story.tags.map((t) => <span key={t} className="status-badge badge-outline">{t}</span>)}
              </div>
            )}
          </aside>
        </div>
      </section>

      {story.body && (
        <section className="wf-section surface-cream">
          <article className="rt-article">
            {story.body.map((sec, n) => (
              <div key={n}>
                {sec.heading && <h2 className="h3-card">{sec.heading}</h2>}
                {sec.paragraphs.map((p) => <p key={p.slice(0, 32)} className="body-editorial">{p}</p>)}
                {n === 0 && story.pullQuote && (
                  <blockquote className="rt-pull">
                    <p className="rt-quote">“{story.pullQuote.text}”</p>
                    <cite className="rt-mono rt-muted">{story.pullQuote.by}</cite>
                  </blockquote>
                )}
              </div>
            ))}
          </article>
        </section>
      )}

      {next && next.slug !== story.slug && (
        <section className="wf-section surface-sand gec-shader-host" data-surface="sand">
          <ShaderLayer family="halftone" />
          <div className="rt-wrap">
            <span className="editorial-kicker">NEXT ON THE SHELF</span>
            <ViewTransitionLink href={`/stories/${next.slug}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <h2 className="h2-section" style={{ marginTop: 8 }}>{next.title} →</h2>
              <p className="body-editorial" style={{ marginTop: 8, maxWidth: '62ch' }}>{next.excerpt}</p>
            </ViewTransitionLink>
          </div>
        </section>
      )}
    </main>
  );
}
