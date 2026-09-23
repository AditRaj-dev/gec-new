'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '@/lib/motion';
import { parseMetric, formatMetric } from '@/lib/metric';
import { ShaderLayer } from '@/components/ShaderLayer';
import './impact.css';

// styled.html 2669–2723 ("1.4 Impact").
const PILLARS = ['Leadership', 'Communication', 'Teamwork', 'Ideation', 'Problem Solving', 'Execution'];

const METRICS = [
  { value: '35+', title: 'Events & Experiences', subtitle: 'Summits, Hackathons & Mixers' },
  { value: '12,000+', title: 'Students Engaged', subtitle: 'Campus-Wide Ecosystem Reach' },
  { value: '45+', title: 'Startups Supported', subtitle: 'Incubated & Mentored Ventures' },
  { value: '28+', title: 'Speakers & Mentors', subtitle: 'Unicorn Founders & Industry VCs' },
] as const;

/**
 * Renders the wireframe's final string on the server. Once `active` (the
 * matrix is 40% visible and motion is allowed), counts up from 0 by writing
 * `textContent` from a ref so there's no re-render per frame.
 */
function MetricDigit({ value, active }: { value: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const metric = parseMetric(value);
    const controls = animate(0, metric.value, {
      duration: 1.2,
      ease: EASE.spring,
      onUpdate(latest) {
        el.textContent = formatMetric(latest, metric);
      },
    });
    return () => controls.stop();
  }, [active, value]);

  return (
    <div className="metric-digit-slot" ref={ref}>
      {value}
    </div>
  );
}

export function Impact() {
  const matrixRef = useRef<HTMLDivElement>(null);
  const inView = useInView(matrixRef, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const animated = inView && !prefersReducedMotion;

  return (
    <section
      className="wf-section surface-charcoal gec-shader-host gec-fallback-specular"
      data-surface="charcoal"
    >
      <ShaderLayer family="specular" />

      <div className="impact__intro">
        <span className="editorial-kicker">REAL COMPETENCIES · VERIFIED OUTCOMES</span>
        <h2 className="h2-section impact__heading">Entrepreneurship Is Learned by Doing.</h2>
        <p className="body-editorial impact__lede">
          Through GEC, students work together, communicate, lead, solve problems, pitch ideas, and experience what
          it takes to execute.
        </p>

        <div className="impact__pillars">
          {PILLARS.map((pillar) => (
            <span className="status-badge impact__pillar" key={pillar}>
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <div className="metrics-4col-matrix" ref={matrixRef}>
        {METRICS.map((metric) => (
          <div className="metric-counter-container" key={metric.title}>
            <MetricDigit value={metric.value} active={animated} />
            <div className="impact__metric-title">{metric.title}</div>
            <div className="impact__metric-subtitle">{metric.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="impact__footer">
        <span className="impact__footer-text">NOT JUST AN ORGANISATION. A LAUNCHPAD FOR GROWTH.</span>
      </div>
    </section>
  );
}
