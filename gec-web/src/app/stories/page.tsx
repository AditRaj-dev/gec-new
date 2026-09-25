import type { Metadata } from 'next';
import { getStories } from '@/lib/api';
import { getList, getSingleton } from '@/lib/content';
import { withStoryContent } from '@/lib/storyContent';
import { SPEAKERS_FALLBACK } from '@/content/speakers';
import { DISPATCH_FALLBACK } from '@/content/dispatch';
import { ROUTE_COPY_FALLBACK } from '@/content/routeCopy';
import { RouteHero } from '@/components/route/RouteHero';
import { SubscribeForm } from '@/components/route/SubscribeForm';
import { FinalCta } from '@/components/home/FinalCta';
import { ShaderLayer } from '@/components/ShaderLayer';
import { PortfolioGrid } from '@/components/stories/PortfolioGrid';
import { SpeakersTrail } from '@/components/home/Speakers';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { DockedBin, OpenDispatchButton } from '@/components/dispatch-bin/DispatchBin';

export const metadata: Metadata = {
  title: 'Stories',
  description: "Founder stories, startup case studies, the GEC Dispatch newsletter and the portfolio of startups built by Galgotias University students.",
  alternates: { canonical: '/stories' },
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

export default async function StoriesPage() {
  const [storiesData, speakers, issues, { hero, cta }] = await Promise.all([
    getStories(),
    getList('speakers', SPEAKERS_FALLBACK),
    getList('dispatch-issues', DISPATCH_FALLBACK),
    getSingleton('route-copy', ROUTE_COPY_FALLBACK).then((r) => r.stories),
  ]);
  // Featured = newest story, spread = the next three (route layouts plan, defaults).
  const [featured, ...more] = storiesData.map(withStoryContent);
  const spread = more.slice(0, 3);
  // headingLine1/headingLine2 are copy-layer-only fields (not real FinalCta props); keep them
  // out of the spread below and rebuild the two-line heading markup here instead.
  const { headingLine1, headingLine2, ...finalCtaProps } = cta;

  return (
    <main aria-label="GEC Stories">
      <RouteHero {...hero} />

      {featured && (
        <section className="wf-section surface-sand gec-shader-host" data-surface="sand">
          <ShaderLayer family="halftone" />
          <div className="rt-wrap rt-grid" style={{ alignItems: 'center' }}>
            <div className="rt-c7 rt-cover">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS URL, dimensions unknown */}
              {featured.coverImage && <img src={featured.coverImage} alt="" />}
              {featured.startupName && <span className="rt-cover__tag rt-mono">{featured.startupName}</span>}
            </div>
            <div className="rt-c5 rt-stack">
              <span className="editorial-kicker">FEATURED {featured.category.toUpperCase()}</span>
              <h2 className="h2-section">{featured.title}</h2>
              <p className="body-editorial">{featured.excerpt}</p>
              <div className="rt-mono rt-muted">
                {[featured.authorOrFounder, featured.readTime, fmtDate(featured.publishedAt)].filter(Boolean).join(' · ')}
              </div>
              {featured.pullQuote && (
                <blockquote className="rt-pull">
                  <p className="rt-quote">“{featured.pullQuote.text}”</p>
                  <cite className="rt-mono rt-muted">{featured.pullQuote.by}</cite>
                </blockquote>
              )}
              {featured.metrics && (
                <dl className="rt-metrics">
                  {featured.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}><dt className="rt-mono rt-muted">{m.label}</dt><dd>{m.value}</dd></div>
                  ))}
                </dl>
              )}
              <ViewTransitionLink href={`/stories/${featured.slug}`} className="rt-link">Read the story →</ViewTransitionLink>
            </div>
          </div>
        </section>
      )}

      {spread.length > 0 && (
        <section className="wf-section surface-cream gec-shader-host" data-surface="cream">
          <ShaderLayer family="hatch" />
          <div className="rt-wrap">
            <div className="rt-head">
              <div className="rt-head__copy">
                <span className="editorial-kicker">FOUNDER VOICES</span>
                <h2 className="h2-section">Dispatches From the Ground.</h2>
              </div>
            </div>
            <div className="rt-spread">
              {spread.map((s, i) => (
                <ViewTransitionLink key={s.id} href={`/stories/${s.slug}`} className="brand-card rt-stack">
                  <span className="editorial-kicker">{s.category.toUpperCase()}</span>
                  <h3 className={i === 0 ? 'h2-section' : 'h3-card'}>{s.title}</h3>
                  <p className="body-editorial">{s.excerpt}</p>
                  {s.metrics?.[0] && (
                    <div className="rt-hl"><span className="rt-mono">{s.metrics[0].label}:</span> {s.metrics[0].value}</div>
                  )}
                  <div className="rt-mono rt-muted">{[s.readTime, fmtDate(s.publishedAt)].filter(Boolean).join(' · ')}</div>
                  <span className="rt-link">Read the story →</span>
                </ViewTransitionLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="portfolio" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap">
          <div className="rt-head">
            <div className="rt-head__copy">
              <span className="editorial-kicker">VENTURE SHOWCASE</span>
              <h2 className="h2-section">Built at Galgotias.</h2>
              <p className="body-editorial">
                Discover startups and student ventures emerging from the Galgotias entrepreneurial ecosystem.
              </p>
            </div>
          </div>
          <PortfolioGrid />
        </div>
      </section>

      <section id="speakers" className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap">
          <div className="rt-head">
            <div className="rt-head__copy">
              <span className="editorial-kicker">THE GREEN ROOM</span>
              <h2 className="h2-section">Founders Who Took Our Stage.</h2>
              <p className="body-editorial">
                Entrepreneurs and operators who have spoken to Galgotias students at GEC sessions and the E-Summit.
              </p>
            </div>
          </div>
        </div>
        <SpeakersTrail speakers={speakers} />
      </section>

      {/* id="dispatch" is the /newsletter redirect target (next.config.ts). */}
      <section id="dispatch" className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap rt-grid" style={{ alignItems: 'center' }}>
          <div className="rt-c5 rt-stack">
            <span className="editorial-kicker">THE GEC DISPATCH</span>
            <h2 className="h2-section">Hot Off the Press.</h2>
            <p className="body-editorial">
              Every issue of the Dispatch, printed as a front page and tossed in the bin. The bin follows you around
              the site; here it lands on the page.
            </p>
            <OpenDispatchButton className="gec-btn btn-crimson">Read the latest issue →</OpenDispatchButton>
            <SubscribeForm />
          </div>
          <div className="rt-c7 rt-bin-stage">
            <DockedBin issues={issues} />
            <div className="rt-mono rt-muted">Click the bin · or catch it in the corner of any page</div>
          </div>
        </div>
      </section>

      <FinalCta
        {...finalCtaProps}
        heading={
          <>
            {headingLine1}
            <br />
            <span className="final-cta__heading-accent">{headingLine2}</span>
          </>
        }
      />
    </main>
  );
}
