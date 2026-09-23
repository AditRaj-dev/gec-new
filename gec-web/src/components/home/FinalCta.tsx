import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './final-cta.css';

// styled.html 3011–3030 ("1.9 Final CTA").
export function FinalCta() {
  return (
    <section
      className="wf-section surface-crimson gec-shader-host gec-fallback-liquid final-cta"
      data-surface="crimson"
    >
      <ShaderLayer family="liquid" />

      <div className="brand-card final-cta__card">
        <span className="status-badge badge-gold final-cta__badge">YOUR INVITATION TO BUILD</span>
        <h2 className="h2-section final-cta__heading">
          Your Idea Doesn’t Need to Be Perfect.
          <br />
          <span className="final-cta__heading-accent">It Needs a Beginning.</span>
        </h2>
        <p className="body-editorial final-cta__lede">
          Whether you want to build a startup, develop entrepreneurial skills, find collaborators, or simply explore
          what&rsquo;s possible — there is a place for you here.
        </p>
        <div className="final-cta__actions">
          <ViewTransitionLink href="/about" className="gec-btn btn-crimson final-cta__cta">
            Explore GEC
          </ViewTransitionLink>
          <ViewTransitionLink href="/initiatives" className="gec-btn btn-outline-ink final-cta__cta">
            Discover Initiatives
          </ViewTransitionLink>
        </div>
      </div>
    </section>
  );
}
