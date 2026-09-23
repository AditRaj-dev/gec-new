/**
 * Type definitions for GEC Public Web Projections & Handshake Contracts.
 * Following architecture.md Section 6 and deployment.md Section 6.5.
 */

export interface HeroSpotlight {
  uuid?: string;
  badgeText: string;
  badgeSubtext?: string;
  headline: string;
  highlightedWord?: string;
  leadParagraph: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  featuredProgram?: {
    tag: string;
    title: string;
    badge: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    footerText: string;
    footerCta: {
      label: string;
      href: string;
    };
  };
  metrics: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
}

export interface Initiative {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  category: string;
  status: 'Open' | 'Upcoming' | 'Active' | 'Closed' | string;
  pillarNumber?: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  coverImage?: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  category: 'Founder Story' | 'Startup Story' | 'News' | 'Event' | string;
  excerpt: string;
  authorOrFounder?: string;
  startupName?: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
  readTime?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  focusAreas: string[];
  leadName?: string;
  leadTitle?: string;
  memberCount?: number;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  category: 'leadership' | 'mentor' | 'speaker' | 'team_head' | 'alumni' | string;
  organization?: string;
  photoUrl?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Stakeholder {
  id: string;
  name: string;
  category: 'partner' | 'startup' | 'ecosystem' | 'alumni' | string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  stage?: string;
  founder?: string;
}

export interface SubmissionData {
  formType: 'incubation' | 'contact' | 'recruitment' | 'pitch' | string;
  fullName: string;
  email: string;
  phone?: string;
  organizationOrCollege?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface SubmissionResponse {
  success: boolean;
  submissionId?: string;
  message: string;
  receivedAt?: string;
}

export interface RevalidationPayload {
  eventUuid: string;
  tags?: string[];
  paths?: string[];
}

export interface RevalidationResponse {
  revalidated: boolean;
  eventUuid: string;
  tags: string[];
  paths: string[];
  timestamp: string;
}

export interface ApiProblemError {
  status: number;
  code: string;
  title: string;
  detail: string;
  requestId?: string;
}
