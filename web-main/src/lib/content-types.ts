export type ContentPriority = "P0" | "P1" | "P2" | "Evergreen";

export type ContentCta = {
  label: string;
  url: string;
};

export type HeroVisualAssets = {
  videoDesktopUrl?: string;
  videoMobileUrl?: string;
  staticDesktopUrl?: string;
  staticMobileUrl?: string;
};

export type HeroSpotlight = {
  id?: string;
  isEvergreen: boolean;
  priority: ContentPriority;
  lifecycleState?: string;
  headline: string;
  shortContext: string;
  statusTag?: string;
  visualAssets?: HeroVisualAssets;
  primaryCta: ContentCta;
  secondaryCta?: ContentCta;
  publishedAt?: string;
};

export type PublicContentEnvelope<T> = {
  id: string;
  entityType?: string;
  slug: string;
  version?: number;
  title: string;
  data: T;
  publishedAt?: string;
};

export type PublicInitiative = Initiative;

export type PublicStory = Story;

export type PublicPerson = Person;

export type PublicStakeholder = Stakeholder;

export type PublicTeam = Team;

export type SubmissionType =
  | "initiative_application"
  | "recruitment"
  | "pitch"
  | "contact";

export type PublicSubmissionInput = {
  submissionType: SubmissionType;
  targetEntityId?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  payload: Record<string, unknown>;
  attachmentKeys?: string[];
};

export type Initiative = {
  id: string;
  slug: string;
  title: string;
  status: "open" | "ongoing" | "upcoming" | "closed";
  badge: string;
  tagline: string;
  summary: string;
  overview?: string;
  timeline: { title: string; description?: string }[];
  eligibility: string[];
  faqs: { question: string; answer: string }[];
  cta?: { isOpen: boolean; label?: string; link?: string };
  data: { overview?: string; timeline: { title: string; description?: string }[]; eligibility: string[]; faqs: { question: string; answer: string }[] };
};

export type Team = {
  id: string;
  slug: string;
  number: string;
  name: string;
  headline: string;
  description: string;
  responsibilities: string[];
  recruitment: string;
  data: { leadName?: string; leadRole?: string; responsibilities?: string[] };
  head?: { name: string; role: string };
  recruitmentSettings?: { acceptsApplications: boolean };
};

export type Person = {
  id: string;
  name: string;
  category: string;
  roleTitle: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
  data: { bio?: string; socialLinks?: Record<string, string> };
};

export type Story = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  coverImageUrl?: string;
  authorName?: string;
  isFeatured: boolean;
  tags?: string[];
  data: { authorName?: string };
};

export type Stakeholder = {
  id: string;
  name: string;
  type: string;
  designation?: string;
  logoOrAvatarUrl?: string;
  websiteUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  data: { metadata?: Record<string, unknown>; description?: string };
};
