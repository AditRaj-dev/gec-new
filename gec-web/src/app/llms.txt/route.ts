import { getStories } from '@/lib/api';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

// /llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants and agents.
// Google ignores it; robots.txt still governs crawling. Cheap to serve, so we ship it.
export async function GET() {
  const stories = await getStories();
  const body = `# ${SITE_NAME} (GEC)

> ${SITE_DESCRIPTION} Based at Galgotias University, Greater Noida, Uttar Pradesh, India.

GEC is run by students in seven teams and helps students go from idea to prototype to incubation (with GICRISE, the university's incubator). Contact: contact@ecellgu.in.

## Main pages

- [Home](${SITE_URL}/): what GEC is, current campaign, programmes, impact numbers, milestones, speakers, partners
- [Initiatives](${SITE_URL}/initiatives): Startup Development Program (SDP), pitching sessions, founder workshops, Ideathon problem statements and application forms
- [Teams](${SITE_URL}/teams): the seven student teams (Startup Development & Incubation, PR & Networking, Marketing & Campus Ambassador, Event Management & Operations, Digital Media & Storytelling, Technical & Product Lab, Career Connect & Talent Ops) and how to join
- [Stories](${SITE_URL}/stories): founder stories, startup portfolio and the GEC Dispatch newsletter
- [About](${SITE_URL}/about): mission, vision, leadership and history

## Stories

${stories.map((s) => `- [${s.title}](${SITE_URL}/stories/${s.slug}): ${s.excerpt}`).join('\n')}

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
- [Instagram](https://www.instagram.com/galgotiasecell/)
- [LinkedIn](https://www.linkedin.com/company/ecell-gu/)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
