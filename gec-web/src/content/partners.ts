// styled.html 2956–3008 ("1.8 Partners Section"). Drop a logo into
// public/partners/ and set `logo` on the entry; until then the box shows the name.
export type Partner = { name: string; tag: string; href: string; logo?: string };

export const PARTNERS_FALLBACK: Partner[] = [
  { name: 'STARTUP INDIA', href: 'https://www.startupindia.gov.in/', tag: 'DPIIT Recognized', logo: '/partners/startup-india.png' },
  { name: 'MSME', href: 'https://msme.gov.in/', tag: 'Ministry Host', logo: '/partners/msme.svg' },
  { name: 'IIC GU', href: 'https://iic.mic.gov.in/', tag: 'Innovation Council', logo: '/partners/iic-gu.png' },
  { name: 'AWS ACTIVATE', href: 'https://aws.amazon.com/startups/', tag: '$10k Cloud Credits', logo: '/partners/aws.svg' },
  { name: 'GITHUB CAMPUS', href: 'https://education.github.com/', tag: 'Dev Tools Tier', logo: '/partners/github.svg' },
  { name: 'WADHWANI', href: 'https://wadhwanifoundation.org/', tag: 'Curriculum Partner', logo: '/partners/wadhwani.png' },
];
