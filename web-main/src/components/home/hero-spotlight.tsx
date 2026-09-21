"use client";

import Link from "next/link";
import { useState } from "react";
import { HERO_SPOTLIGHT_DATA } from "@/lib/site-data";
import type { HeroCampaignData } from "@/lib/site-data";
import type { HeroSpotlight } from "@/lib/content-types";

type HeroSpotlightProps = { primary: HeroSpotlight };

function fallbackCampaign(value: HeroCampaignData): HeroSpotlight {
  return {
    isEvergreen: value.secondaryCardId === null,
    priority: value.secondaryCardId === null ? "Evergreen" : "P1",
    lifecycleState: value.statusTag,
    headline: value.headline,
    shortContext: value.context,
    statusTag: value.statusTag,
    primaryCta: { label: value.primaryCta, url: "/initiatives" },
    secondaryCta: { label: value.secondaryCta, url: value.secondaryRoute },
  };
}

export function HeroSpotlight({ primary }: HeroSpotlightProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const localCampaigns = Object.entries(HERO_SPOTLIGHT_DATA).filter(([key]) => key !== "evergreen");
  const activeCampaign = activeKey ? fallbackCampaign(HERO_SPOTLIGHT_DATA[activeKey]) : primary;
  const visual = activeCampaign.visualAssets;

  return (
    <section className="hero-section">
      <div className="site-container hero-section__grid">
        <div className="hero-section__copy">
          <p className="eyebrow">{activeCampaign.statusTag || "Galgotias Entrepreneurship Cell"}</p>
          <h1>{activeCampaign.headline}</h1>
          <p className="hero-section__context">{activeCampaign.shortContext}</p>
          <div className="hero-section__actions">
            {activeCampaign.primaryCta.url.startsWith("/") ? (
              <Link className="button button--crimson" href={activeCampaign.primaryCta.url}>{activeCampaign.primaryCta.label}</Link>
            ) : (
              <a className="button button--crimson" href={activeCampaign.primaryCta.url} target="_blank" rel="noreferrer">{activeCampaign.primaryCta.label}</a>
            )}
            {activeCampaign.secondaryCta ? <Link className="button button--outline" href={activeCampaign.secondaryCta.url}>{activeCampaign.secondaryCta.label}</Link> : null}
          </div>
        </div>

        <div className="hero-section__visual" aria-label="GEC campaign visual">
          {visual?.videoDesktopUrl || visual?.videoMobileUrl ? (
            <video className="hero-section__media" autoPlay muted loop playsInline poster={visual.staticDesktopUrl}>
              {visual.videoMobileUrl ? <source src={visual.videoMobileUrl} media="(max-width: 767px)" /> : null}
              {visual.videoDesktopUrl ? <source src={visual.videoDesktopUrl} /> : null}
            </video>
          ) : visual?.staticDesktopUrl || visual?.staticMobileUrl ? (
            <picture>
              {visual.staticMobileUrl ? <source media="(max-width: 767px)" srcSet={visual.staticMobileUrl} /> : null}
              <img className="hero-section__media" src={visual.staticDesktopUrl || visual.staticMobileUrl} alt="" />
            </picture>
          ) : (
            <div className="hero-section__visual-fallback"><span>Ideas in motion</span><strong>GEC</strong><span>People · Practice · Progress</span></div>
          )}
          <div className="hero-section__visual-note">{activeCampaign.lifecycleState || "Evergreen community"}</div>
        </div>
      </div>

      {localCampaigns.length ? (
        <div className="site-container hero-section__secondary" aria-label="More GEC spotlights">
          {localCampaigns.slice(0, 2).map(([key, campaign], index) => (
            <button key={key} type="button" className={`spotlight-selector ${activeKey === key ? "is-active" : ""}`} onClick={() => setActiveKey((current) => current === key ? null : key)}>
              <span>0{index + 1}</span><strong>{campaign.campaign}</strong><small>{campaign.statusTag}</small>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
