import Link from "next/link";
import { ArrowLink } from "@/components/arrow-link";
import { SectionHeading } from "@/components/section-heading";
import { HeroSpotlight } from "@/components/home/hero-spotlight";
import { getHeroSpotlight, getInitiatives, getPeople, getStories, getStakeholders } from "@/lib/public-content";
import { ecosystemActions, happenings, impactAreas, MILESTONES, PARTNERS, SPEAKERS } from "@/lib/site-data";

export default async function Home() {
  const [hero, remoteInitiatives, remoteStories, remotePeople, remoteStakeholders] = await Promise.all([
    getHeroSpotlight(), getInitiatives(), getStories(), getPeople("mentors"), getStakeholders(),
  ]);
  const initiatives = remoteInitiatives.slice(0, 3);
  const stories = remoteStories.slice(0, 3);
  const speakers = remotePeople.length ? remotePeople.slice(0, 8).map((person) => ({ name: person.name, org: person.roleTitle, role: person.category })) : SPEAKERS;
  const partners = remoteStakeholders.filter((item) => item.type === "partner").slice(0, 6).map((item) => ({ name: item.name, org: item.designation || "Ecosystem partner" }));

  return (
    <div className="home-page">
      <HeroSpotlight primary={hero} />

      <section className="home-section home-section--crimson">
        <div className="site-container">
          <SectionHeading eyebrow="What’s happening" title="Always something in motion." body="Ideas are being pitched. Teams are building. Founders are sharing. Opportunities are opening." />
          <div className="happenings-grid">
            {happenings.map((item, index) => (
              <Link key={item.title} href={item.href} className={`happening-card happening-card--${item.accent} happening-card--${index === 0 ? "lead" : ""}`}>
                <span className="card-kicker">{item.label}</span><h3>{item.title}</h3><p>{item.copy}</p><span className="card-link">Explore <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="site-container">
          <div className="section-row"><SectionHeading eyebrow="Initiatives" title="Built for people who want to build." body="Move beyond theory through startup development, pitching, workshops, and ecosystem exposure." /><ArrowLink href="/initiatives">Explore all initiatives</ArrowLink></div>
          <div className="initiative-grid">
            {initiatives.map((item) => <Link className="initiative-card" key={item.id} href="/initiatives"><span className="initiative-card__number">{item.id}</span><h3>{item.title}</h3><p>{item.tagline}</p><span className="initiative-card__meta">{item.badge}</span><span className="card-link">Learn more <span aria-hidden="true">↗</span></span></Link>)}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink">
        <div className="site-container impact-grid">
          <div><SectionHeading eyebrow="Impact" title="Entrepreneurship is learned by doing." body="The GEC experience gives students space to work together, lead, solve problems, pitch ideas, and execute." /><p className="impact-note">Not just an organisation. A launchpad for growth.</p></div>
          <div className="impact-areas">{impactAreas.map((area) => <span key={area}>{area}</span>)}</div>
        </div>
      </section>

      <section className="home-section home-section--sand">
        <div className="site-container"><SectionHeading align="center" eyebrow="Spotlight" title="Moments that shaped GEC." body="Not every milestone belongs in a statistic. Explore the experiences, conversations, and decisions that shaped this community." /><div className="milestone-grid">{MILESTONES.map((item) => <article className="milestone-card" key={item.year}><span>{item.year}</span><h3>{item.title}</h3><p>{item.summary}</p></article>)}</div></div>
      </section>

      <section className="home-section">
        <div className="site-container"><div className="section-row"><SectionHeading eyebrow="Stories" title="Every venture starts with a story." body="Meet the people, teams, and ideas turning curiosity into experiments, products, and companies." /><ArrowLink href="/stories">Explore stories</ArrowLink></div><div className="story-grid">{stories.map((story) => <Link className="story-card" href="/stories" key={story.id}><span className="card-kicker">{story.category}</span><h3>{story.title}</h3><p>{story.excerpt}</p><span className="card-link">Read the story <span aria-hidden="true">↗</span></span></Link>)}</div></div>
      </section>

      <section className="home-section home-section--crimson">
        <div className="site-container"><SectionHeading align="center" eyebrow="People who build" title="Ideas from people who built them." body="Conversations with founders, operators, mentors, and leaders who share the realities of company building." /><div className="people-grid">{speakers.map((speaker) => <article className="person-card" key={speaker.name}><div className="person-card__avatar" aria-hidden="true">{speaker.name.slice(0, 1)}</div><h3>{speaker.name}</h3><p>{speaker.org}</p><span>{speaker.role}</span></article>)}</div><div className="section-actions"><ArrowLink href="/stories">Discover our speakers</ArrowLink></div></div>
      </section>

      <section className="home-section">
        <div className="site-container"><SectionHeading align="center" eyebrow="Partners" title="Built with an ecosystem." body="Entrepreneurship does not happen in isolation. GEC works alongside people and communities who create room for student innovators." /><div className="partner-grid">{(partners.length ? partners : PARTNERS).map((partner) => <div className="partner-card" key={partner.name}><strong>{partner.name}</strong><span>{partner.org}</span></div>)}</div></div>
      </section>

      <section className="home-cta"><div className="site-container home-cta__inner"><p className="eyebrow">Start where you are</p><h2>Your idea doesn’t need to be perfect. It needs a beginning.</h2><p>Whether you want to build a startup, develop entrepreneurial skills, find collaborators, or explore what’s possible, there is a place for you here.</p><div className="home-cta__actions"><Link className="button button--gold" href="/about">Explore GEC</Link><Link className="button button--light" href="/initiatives">Discover initiatives</Link></div></div></section>

      <section className="home-section home-section--sand home-section--compact"><div className="site-container action-strip"><div><p className="eyebrow">A next step can be small</p><h2>Find the path that fits you.</h2></div><div className="action-strip__list">{ecosystemActions.slice(0, 3).map((action) => <span key={action}>{action}</span>)}</div></div></section>
    </div>
  );
}
