// Canonical site identity, shared by metadata, sitemap, robots and JSON-LD.
// ponytail: domain guessed from the footer's contact@ecellgu.in; set NEXT_PUBLIC_SITE_URL in each deploy.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ecellgu.in').replace(/\/+$/, '');

// Only production gets indexed; Vercel previews/staging stay out of search. Non-Vercel hosts count as production.
export const INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

export const SITE_NAME = 'Galgotias Entrepreneurship Cell';
export const SITE_SHORT = 'GEC';
export const SITE_DESCRIPTION =
  'Official Entrepreneurship Cell of Galgotias University. Igniting student innovation, startup incubation, and high-impact venture creation.';

export const SOCIALS = [
  'https://www.instagram.com/galgotiasecell/',
  'https://www.linkedin.com/company/ecell-gu/',
];

/** Organization entity for Google's Knowledge Graph (home page JSON-LD). */
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ['GEC', 'E-Cell Galgotias'],
  url: SITE_URL,
  logo: `${SITE_URL}/gec-logo-512.png`,
  description: SITE_DESCRIPTION,
  email: 'contact@ecellgu.in',
  sameAs: SOCIALS,
  parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Galgotias University', url: 'https://www.galgotiasuniversity.edu.in' },
  address: { '@type': 'PostalAddress', addressLocality: 'Greater Noida', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
};

/** Serialise JSON-LD for a <script> tag; escapes `<` so content can't close the tag. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
