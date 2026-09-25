const NAV_ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/teams', label: 'Teams' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/stories', label: 'Stories' },
];

const MOBILE_NAV_ROUTES = [
  { href: '/', label: '01. Home' },
  { href: '/about', label: '02. About' },
  { href: '/teams', label: '03. Teams' },
  { href: '/initiatives', label: '04. Initiatives' },
  { href: '/stories', label: '05. Stories' },
];

const FOOTER_NAV_ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About GEC' },
  { href: '/teams', label: 'The 7 Teams' },
  { href: '/initiatives', label: 'Initiatives & SDP' },
  { href: '/stories', label: 'Stories & Portfolio' },
];

const SOCIALS = [
  {
    href: 'https://www.instagram.com/galgotiasecell/',
    label: 'Instagram',
    handle: '@galgotiasecell',
    icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.3-1.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z',
  },
  {
    href: 'https://www.linkedin.com/company/ecell-gu/',
    label: 'LinkedIn',
    handle: 'Galgotias E-Cell',
    icon: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z',
  },
  {
    href: 'mailto:contact@ecellgu.in',
    label: 'Email',
    handle: 'contact@ecellgu.in',
    icon: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.2 7H4v.9l8 5.3 8-5.3V7h-.2L12 12.2Z',
  },
];

// Same files the home Partners strip uses (public/partners/).
const PARTNERS = [
  { name: 'Startup India', logo: '/partners/startup-india.png' },
  { name: 'MSME', logo: '/partners/msme.svg' },
  { name: 'IIC GU', logo: '/partners/iic-gu.png' },
  { name: 'AWS Activate', logo: '/partners/aws.svg' },
  { name: 'GitHub Campus', logo: '/partners/github.svg' },
  { name: 'Wadhwani', logo: '/partners/wadhwani.png' },
];

export type NavLink = { href: string; label: string };
export type FooterSocial = (typeof SOCIALS)[number];
export type FooterPartner = { name: string; logo: string };
export type SiteNav = {
  routes: NavLink[];
  mobileRoutes: NavLink[];
  footerRoutes: NavLink[];
  socials: FooterSocial[];
  footerPartners: FooterPartner[];
};

export const SITE_NAV_FALLBACK: SiteNav = {
  routes: NAV_ROUTES,
  mobileRoutes: MOBILE_NAV_ROUTES,
  footerRoutes: FOOTER_NAV_ROUTES,
  socials: [...SOCIALS],
  footerPartners: PARTNERS,
};
