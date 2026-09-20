export type UserRole = 
  | 'super_admin' 
  | 'core_admin' 
  | 'team_head' 
  | 'content_editor' 
  | 'viewer';

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamScope?: string; // e.g., 'team_01' for Team Heads
  active: boolean;
  avatarUrl?: string;
  lastLogin?: string;
}

export type HeroPriority = 'P0' | 'P1' | 'P2';

export type HeroGroundLifecycle = 
  | 'Announcement'
  | 'Applications Open'
  | 'Registrations Growing'
  | 'Urgency / Deadline'
  | 'Live'
  | 'Completed'
  | 'Results / Highlights'
  | 'Stories';

export type HeroPublishStatus = 'Draft' | 'Scheduled' | 'Live' | 'Expired' | 'Archived';

export interface HeroSpotlight {
  id: string;
  campaignName: string;
  status: HeroGroundLifecycle;
  priority: HeroPriority;
  headline: string;
  supportingText: string;
  eyebrowBadge: string;
  desktopVideo: string;
  mobileVideo: string;
  desktopPoster: string;
  mobilePoster: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  startDatetime: string;
  endDatetime: string;
  publishStatus: HeroPublishStatus;
  fallbackBehavior: 'evergreen_brand' | 'next_priority';
  secondaryItems?: Array<{
    id: string;
    indexNum: string;
    title: string;
    category: string;
    url: string;
  }>;
}

export type PeopleTier = 
  | 'leadership_tier_1' 
  | 'mentors_tier_2' 
  | 'team_heads_tier_3' 
  | 'coordinators_tier_3' 
  | 'members_tier_4' 
  | 'alumni_tier_4';

export interface Person {
  id: string;
  fullName: string;
  designation: string;
  tier: PeopleTier;
  department?: string;
  graduationYear?: string;
  avatarUrl: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  bio?: string;
  active: boolean;
  teamId?: string;
}

export interface TeamPillar {
  id: string;
  title: string;
  scope: string;
}

export interface Team {
  id: string; // 'team_01' to 'team_07'
  number: string; // '01' to '07'
  name: string;
  slug: string;
  accentColor: string; // hex code
  themeBadge: string;
  tagline: string;
  mission: string;
  overview: string;
  headId: string;
  headName: string;
  headDesignation: string;
  headPhoto: string;
  coordinators: Array<{ id: string; name: string; role: string; photo: string }>;
  membersCount: number;
  responsibilities: TeamPillar[]; // 6 pillars
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  gallery: string[];
  recruitmentStatus: 'open' | 'closed';
  recruitmentDeadline?: string;
  applicationsCount: number;
}

export type InitiativeStatus = 
  | 'Coming Soon'
  | 'Applications Open'
  | 'Ongoing'
  | 'Completed'
  | 'Archived';

export interface InitiativeStage {
  stageNum: string;
  title: string;
  targetDates: string;
  description: string;
  status: 'upcoming' | 'current' | 'completed';
}

export interface InitiativeFaq {
  question: string;
  answer: string;
}

export interface Initiative {
  id: string;
  title: string;
  slug: string;
  cohortId: string;
  category: 'Program' | 'Competition' | 'Workshop' | 'Summit';
  status: InitiativeStatus;
  featuredOnHome: boolean;
  excerpt: string;
  description: string;
  coverImage: string;
  stages: InitiativeStage[]; // 4 stages
  eligibility: string[];
  mentors: string[];
  speakers: string[];
  faqs: InitiativeFaq[];
  ctaLabel: string;
  ctaUrl: string;
  customFormFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'file' | 'select';
    required: boolean;
  }>;
  submissionsCount: number;
  updatedAt: string;
}

export type StoryCategory = 
  | 'News' 
  | 'Founder Story' 
  | 'Startup Story' 
  | 'Event Story' 
  | 'Featured Story';

export type StoryStatus = 'Draft' | 'In Review' | 'Published' | 'Scheduled' | 'Archived';

export interface Story {
  id: string;
  title: string;
  slug: string;
  category: StoryCategory;
  status: StoryStatus;
  author: string;
  authorRole: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  body: string;
  quote?: string;
  featuredOnHome: boolean; // Bento Slot 1
  featuredOnMagazineLead: boolean; // Page 05 §5.2
  publishedAt?: string;
  scheduledFor?: string;
  viewsCount?: number;
}

export interface Partner {
  id: string;
  name: string;
  category: 'Incubation' | 'Media' | 'Cloud' | 'Funding' | 'Corporate';
  logoUrl: string;
  websiteUrl: string;
  featuredOnHome: boolean;
  orderRank: number;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  company: string;
  portraitUrl: string;
  eventName: string;
  socialUrl?: string;
  featuredOnHome: boolean;
}

export interface Startup {
  id: string;
  name: string;
  logoUrl: string;
  pitch: string;
  founders: string[];
  cohortYear: string;
  sector: 'Tech' | 'Consumer' | 'Health' | 'Climate' | 'SaaS' | 'EdTech';
  stage: 'Idea Lab' | 'Incubated' | 'Bootstrapped' | 'Seed' | 'Alumni';
  websiteUrl: string;
  featured: boolean;
}

export interface Alumni {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  graduationYear: string;
  avatarUrl: string;
  linkedinUrl?: string;
  testimonial?: string;
}

export type MediaCategory = 'Images' | 'Videos' | 'Galleries' | 'Documents' | 'Brand Assets';
export type MediaAspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'free';

export interface MediaAsset {
  id: string;
  name: string;
  category: MediaCategory;
  aspectRatio: MediaAspectRatio;
  cdnUrl: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
  referenceCount: number;
  references: string[];
  uploadedAt: string;
  uploadedBy: string;
}

export type SubmissionStatus = 'New' | 'Reviewed' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Archived';
export type SubmissionFormType = 
  | 'Initiative Application'
  | 'Event Registration'
  | 'Startup Pitch'
  | 'Join Team Application'
  | 'Partnership Inquiry';

export interface Submission {
  id: string;
  formType: SubmissionFormType;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  teamTarget?: string;
  initiativeTarget?: string;
  status: SubmissionStatus;
  submittedAt: string;
  attachmentUrl?: string;
  answers: Record<string, string>;
  notes?: string;
}

export type GoogleFormLifecycleState =
  | 'proposed'
  | 'unpublished'
  | 'needs_manual_upload_setup'
  | 'ready_for_review'
  | 'published'
  | 'closed'
  | 'failed'
  | 'external_missing';

export interface GoogleFormItem {
  id: string;
  title: string;
  kind: 'text' | 'choice' | 'scale' | 'date' | 'time' | 'rating' | 'file_upload';
  required: boolean;
  options?: string[];
  isManualFileUpload?: boolean;
}

export interface GoogleForm {
  id: string;
  title: string;
  description: string;
  lifecycleState: GoogleFormLifecycleState;
  responderUri: string;
  editUri: string;
  manualUploadSetupRequired: boolean;
  manualUploadVerified: boolean;
  manualItemIds: string[];
  lastResponseSyncAt?: string;
  responseCount: number;
  driveFolderId?: string;
  sheetUrl?: string;
  items: GoogleFormItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GoogleFormResponse {
  id: string;
  formId: string;
  responseId: string;
  submittedAt: string;
  respondentEmail: string;
  answers: Record<string, string>;
}

export interface CopilotActionProposal {
  id: string;
  conversationId: string;
  actionType: 'update_draft' | 'create_google_form' | 'update_google_form' | 'publish_google_form';
  targetId?: string;
  targetVersion?: string;
  preview: {
    summary: string;
    details: Record<string, any>;
    diff?: Array<{ field: string; before: string; after: string }>;
  };
  status: 'proposed' | 'confirmed' | 'executing' | 'succeeded' | 'failed' | 'expired';
  expiresAt: string;
  idempotencyKey: string;
}

export interface CopilotMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  proposal?: CopilotActionProposal;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface SiteSettings {
  general: {
    siteName: string;
    portalName: string;
    environment: string;
    liveSyncStatus: 'synced' | 'pending' | 'syncing';
    lastSyncTimestamp: string;
  };
  announcementTicker: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    highlightWord?: string;
  };
  impactCounters: {
    startupsIncubated: number;
    eventsConducted: number;
    studentFootfall: number;
    fundingRaisedLakhs: number;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
    keywords: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    discord: string;
  };
  contactInfo: {
    email: string;
    supportEmail: string;
    phone: string;
    location: string;
  };
}
