import "server-only";
import { HERO_SPOTLIGHT_DATA, PEOPLE as fallbackPeople, STAKEHOLDERS as fallbackStakeholders, initiatives as fallbackInitiatives, stories as fallbackStories, teams as fallbackTeamsData } from "@/lib/site-data";
import type { HeroSpotlight, Initiative, Person, Stakeholder, Story, Team } from "@/lib/content-types";

const API_BASE_URL = (process.env.GEC_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");
const CACHE_SECONDS = 300;

async function readPublic<T>(path: string, tag: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: CACHE_SECONDS, tags: [`gec:${tag}`] }, headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch { return null; }
}

function collection(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (value && typeof value === "object" && Array.isArray((value as { items?: unknown }).items)) return collection((value as { items: unknown }).items);
  return [];
}
function object(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function string(value: unknown, fallback = "") { return typeof value === "string" ? value : fallback; }

function fallbackHero(): HeroSpotlight {
  const source = HERO_SPOTLIGHT_DATA.evergreen;
  return { isEvergreen: true, priority: "Evergreen", lifecycleState: "Announcement", headline: source.headline, shortContext: source.context, statusTag: source.statusTag, primaryCta: { label: "Explore initiatives", url: "/initiatives" }, secondaryCta: { label: "Discover GEC", url: "/about" } };
}
export async function getHeroSpotlight(): Promise<HeroSpotlight> {
  const value = await readPublic<unknown>("/v1/public/hero", "hero");
  const item = object(value); const primary = object(item.primaryCta);
  if (!string(item.headline) || !string(item.shortContext) || !string(primary.label) || !string(primary.url)) return fallbackHero();
  const secondary = object(item.secondaryCta);
  return { id: string(item.id) || undefined, isEvergreen: item.isEvergreen === true, priority: item.priority === "P0" || item.priority === "P1" || item.priority === "P2" ? item.priority : "Evergreen", lifecycleState: string(item.lifecycleState) || undefined, headline: string(item.headline), shortContext: string(item.shortContext), statusTag: string(item.statusTag) || undefined, visualAssets: object(item.visualAssets) as HeroSpotlight["visualAssets"], primaryCta: { label: string(primary.label), url: string(primary.url) }, secondaryCta: string(secondary.label) && string(secondary.url) ? { label: string(secondary.label), url: string(secondary.url) } : undefined, publishedAt: string(item.publishedAt) || undefined };
}

export async function getInitiatives(): Promise<Initiative[]> {
  const remote = collection(await readPublic<unknown>("/v1/public/initiatives", "initiatives")).map(normalizeInitiative);
  return remote.length ? remote : fallbackInitiatives.map((item) => ({ id: item.number, slug: item.route.replace(/^\/initiatives\//, ""), title: item.title, status: item.badge.toLowerCase().includes("open") ? "open" : "ongoing", badge: item.badge, tagline: item.summary, summary: item.summary, overview: item.desc, timeline: [], eligibility: [item.audience], faqs: [], data: { overview: item.desc, timeline: [], eligibility: [item.audience], faqs: [] }, cta: { isOpen: item.badge.toLowerCase().includes("open"), label: item.applyTitle, link: item.route } }));
}
function normalizeInitiative(item: Record<string, unknown>, index: number): Initiative {
  const data = object(item.data); const cta = object(data.cta); const statusValue = string(cta.status, "ongoing").toLowerCase(); const status: Initiative["status"] = statusValue === "open" || statusValue === "upcoming" || statusValue === "closed" ? statusValue : "ongoing";
  const timeline = Array.isArray(data.timeline) ? data.timeline.map((step) => { const value = object(step); return { title: string(value.title, string(value.phase, "Next step")), description: string(value.description, string(value.desc)) || undefined }; }) : [];
  const eligibility = Array.isArray(data.eligibility) ? data.eligibility.filter((entry): entry is string => typeof entry === "string") : [];
  const faqs = Array.isArray(data.faqs) ? data.faqs.map((faq) => { const value = object(faq); return { question: string(value.question, string(value.q, "Question")), answer: string(value.answer, string(value.a, "Details will be shared soon.")) }; }) : [];
  return { id: string(item.id, String(index + 1)), slug: string(item.slug, String(index + 1)), title: string(item.title, "Initiative"), status, badge: string(cta.badge, status), tagline: string(data.tagline, string(data.overview, string(item.title))), summary: string(data.tagline, string(data.overview, string(item.title))), overview: string(data.overview) || undefined, timeline, eligibility, faqs, data: { overview: string(data.overview) || undefined, timeline, eligibility, faqs }, cta: { isOpen: status === "open", label: string(cta.label, `Apply to ${string(item.title, "this initiative")}`), link: string(cta.link, `/initiatives/${string(item.slug, String(index + 1))}`) } };
}

export async function getStories(): Promise<Story[]> {
  const remote = collection(await readPublic<unknown>("/v1/public/stories", "stories")).map(normalizeStory);
  return remote.length ? remote : fallbackStories.map((item, index) => ({ id: String(index + 1), title: item.title, category: item.category, excerpt: item.excerpt, isFeatured: item.isFeatured, tags: [], data: { authorName: undefined } }));
}
function normalizeStory(item: Record<string, unknown>): Story { const data = object(item.data); const authorName = string(data.authorName) || undefined; return { id: string(item.id, string(item.slug, string(item.title))), title: string(item.title, "Story"), category: string(data.category, "News"), excerpt: string(data.excerpt, "A new story from the GEC ecosystem."), content: string(data.content) || undefined, coverImageUrl: string(data.coverImageUrl) || undefined, authorName, isFeatured: data.isFeatured === true, tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : undefined, data: { authorName } }; }

export async function getPeople(category?: string): Promise<Person[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const remote = collection(await readPublic<unknown>(`/v1/public/people${query}`, "people")).map((item) => {
    const data = object(item.data);
    const profile = { bio: string(data.bio) || undefined, socialLinks: object(data.socialLinks) as Record<string, string> };
    return { id: string(item.id, string(item.title)), name: string(data.name, string(item.title, "GEC community")), category: string(data.category, category || "people"), roleTitle: string(data.roleTitle, "GEC community"), bio: profile.bio, avatarUrl: string(data.avatarUrl) || undefined, socialLinks: profile.socialLinks, data: profile };
  });
  if (remote.length) return remote;
  return fallbackPeople.filter((person) => !category || person.category === category).map((person) => ({
    id: person.id,
    name: person.name,
    category: person.category,
    roleTitle: person.roleTitle,
    bio: person.bio,
    avatarUrl: undefined,
    socialLinks: person.socialLinks,
    data: { bio: person.bio, socialLinks: person.socialLinks },
  }));
}

export async function getStakeholders(type?: string): Promise<Stakeholder[]> {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  const remote = collection(await readPublic<unknown>(`/v1/public/stakeholders${query}`, "stakeholders")).map((item) => {
    const data = object(item.data);
    const description = string(data.description) || undefined;
    const metadata = object(data.metadata);
    return { id: string(item.id, string(item.title)), name: string(data.name, string(item.title, "Ecosystem partner")), type: string(data.type, type || "partner"), designation: string(data.designation) || undefined, logoOrAvatarUrl: string(data.logoOrAvatarUrl) || undefined, websiteUrl: string(data.websiteUrl) || undefined, description, metadata, data: { description, metadata } };
  });
  if (remote.length) return remote;
  return fallbackStakeholders.filter((stakeholder) => !type || stakeholder.type === type).map((stakeholder) => ({
    id: stakeholder.id,
    name: stakeholder.name,
    type: stakeholder.type,
    designation: stakeholder.designation,
    logoOrAvatarUrl: undefined,
    websiteUrl: stakeholder.websiteUrl,
    description: stakeholder.description,
    metadata: stakeholder.metadata,
    data: { description: stakeholder.description, metadata: stakeholder.metadata },
  }));
}

export async function getTeams(): Promise<Team[]> {
  const remote = collection(await readPublic<unknown>("/v1/public/teams", "teams")).map(normalizeTeam);
  return remote.length ? remote : fallbackTeamsData.map((team) => ({ id: team.number, slug: team.route.replace(/^\/teams\//, ""), number: team.number, name: team.name, headline: team.headline, description: team.description, responsibilities: team.responsibilities || [], recruitment: team.recruitment || "Join a team that turns intention into action.", data: { leadName: team.headName, leadRole: team.headRole, responsibilities: team.responsibilities }, head: { name: team.headName, role: team.headRole }, recruitmentSettings: { acceptsApplications: true } }));
}
function normalizeTeam(item: Record<string, unknown>, index: number): Team { const data = object(item.data); const responsibilities = Array.isArray(data.responsibilities) ? data.responsibilities.filter((entry): entry is string => typeof entry === "string") : []; return { id: string(item.id, String(index + 1)), slug: string(item.slug, String(index + 1)), number: String(index + 1).padStart(2, "0"), name: string(item.title, "GEC team"), headline: string(data.headline, string(item.title, "GEC team")), description: string(data.description, "A student team building useful opportunities across GEC."), responsibilities, recruitment: string(data.recruitment, "Join a team that turns intention into action."), data: { leadName: string(data.leadName) || undefined, leadRole: string(data.leadRole) || undefined, responsibilities }, head: string(data.headName) ? { name: string(data.headName), role: string(data.headRole, "Team lead") } : undefined, recruitmentSettings: { acceptsApplications: data.acceptsApplications !== false } }; }
