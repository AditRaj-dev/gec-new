import {
  CmsUser,
  HeroSpotlight,
  Person,
  Team,
  Initiative,
  Story,
  Partner,
  Speaker,
  Startup,
  Alumni,
  MediaAsset,
  Submission,
  GoogleForm,
  GoogleFormResponse,
  CopilotMessage,
  CopilotActionProposal,
  AuditLog,
  SiteSettings,
  UserRole,
} from './types';
import {
  mockUsers,
  mockHeroSpotlight,
  mockPeople,
  mockTeams,
  mockInitiatives,
  mockStories,
  mockPartners,
  mockSpeakers,
  mockStartups,
  mockAlumni,
  mockMediaAssets,
  mockSubmissions,
  mockGoogleForms,
  mockGoogleFormResponses,
  mockCopilotMessages,
  mockAuditLogs,
  mockSiteSettings,
} from './mock-data';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// In-memory access token storage (Security Rule 9.1: CMS holds access token in memory)
let inMemoryAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

// Local mock state storage for fallback mutations
class MockStore {
  users = [...mockUsers];
  heroSpotlight: HeroSpotlight = { ...mockHeroSpotlight };
  people = [...mockPeople];
  teams = [...mockTeams];
  initiatives = [...mockInitiatives];
  stories = [...mockStories];
  partners = [...mockPartners];
  speakers = [...mockSpeakers];
  startups = [...mockStartups];
  alumni = [...mockAlumni];
  mediaAssets = [...mockMediaAssets];
  submissions = [...mockSubmissions];
  googleForms = [...mockGoogleForms];
  formResponses = [...mockGoogleFormResponses];
  copilotMessages = [...mockCopilotMessages];
  auditLogs = [...mockAuditLogs];
  settings: SiteSettings = JSON.parse(JSON.stringify(mockSiteSettings));
}

const localStore = new MockStore();

// Generic API caller with token header and refresh on 401
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (inMemoryAccessToken) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // for httpOnly refresh cookie
    });

    if (res.status === 401 && endpoint !== '/v1/auth/refresh' && endpoint !== '/v1/auth/login') {
      // Attempt auto-refresh
      const refreshed = await refreshSession();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
        const retryRes = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        if (!retryRes.ok) {
          throw new Error(`API Error: ${retryRes.statusText}`);
        }
        return (await retryRes.json()) as T;
      }
    }

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    // API is offline or unreachable - throw so caller can fall back to mock
    throw error;
  }
}

// Helper to simulate asynchronous network latency for fallback
const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

export async function refreshSession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.accessToken);
      return true;
    }
  } catch {
    // Offline mode: keep token or re-mock
  }
  return false;
}

// Main API Client Export
export const apiClient = {
  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  async login(email: string, password: string):Promise<{ user: CmsUser; accessToken: string }> {
    try {
      const data = await apiFetch<{ user: CmsUser; accessToken: string }>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(data.accessToken);
      return data;
    } catch {
      await delay(200);
      const user = localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || localStore.users[0];
      const token = `mock_jwt_access_token_${Date.now()}`;
      setAccessToken(token);
      return { user, accessToken: token };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/v1/auth/logout', { method: 'POST' });
    } catch {
      // offline fallback
    } finally {
      setAccessToken(null);
    }
  },

  async getMe(): Promise<CmsUser> {
    try {
      return await apiFetch<CmsUser>('/v1/auth/me');
    } catch {
      await delay(100);
      return localStore.users[0];
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiFetch('/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      await delay(200);
      return { success: true, message: `Password reset instructions sent to ${email}` };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      return await apiFetch('/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    } catch {
      await delay(200);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // MODULE 1: DASHBOARD & HERO SPOTLIGHT
  // -------------------------------------------------------------
  async getHeroSpotlight(): Promise<HeroSpotlight> {
    try {
      return await apiFetch<HeroSpotlight>('/v1/cms/hero-spotlight');
    } catch {
      await delay(100);
      return { ...localStore.heroSpotlight };
    }
  },

  async updateHeroSpotlight(payload: Partial<HeroSpotlight>): Promise<HeroSpotlight> {
    try {
      return await apiFetch<HeroSpotlight>('/v1/cms/hero-spotlight', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch {
      await delay(200);
      localStore.heroSpotlight = {
        ...localStore.heroSpotlight,
        ...payload,
      };
      // Log audit
      localStore.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actorName: 'Current User',
        actorEmail: 'admin@gec.in',
        action: 'HERO_UPDATE',
        resource: 'Hero Spotlight',
        details: `Updated campaign: ${localStore.heroSpotlight.campaignName}`,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1',
      });
      return { ...localStore.heroSpotlight };
    }
  },

  async publishHeroSpotlight(): Promise<HeroSpotlight> {
    try {
      return await apiFetch<HeroSpotlight>('/v1/cms/hero-spotlight/publish', {
        method: 'POST',
      });
    } catch {
      await delay(200);
      localStore.heroSpotlight.publishStatus = 'Live';
      localStore.settings.general.lastSyncTimestamp = new Date().toISOString();
      return { ...localStore.heroSpotlight };
    }
  },

  // -------------------------------------------------------------
  // MODULE 2: PEOPLE
  // -------------------------------------------------------------
  async getPeople(): Promise<Person[]> {
    try {
      return await apiFetch<Person[]>('/v1/cms/people');
    } catch {
      await delay(100);
      return [...localStore.people];
    }
  },

  async createPerson(person: Omit<Person, 'id'>): Promise<Person> {
    try {
      return await apiFetch<Person>('/v1/cms/people', {
        method: 'POST',
        body: JSON.stringify(person),
      });
    } catch {
      await delay(150);
      const newPerson: Person = {
        ...person,
        id: `per-${Date.now()}`,
      };
      localStore.people.unshift(newPerson);
      return newPerson;
    }
  },

  async updatePerson(id: string, updates: Partial<Person>): Promise<Person> {
    try {
      return await apiFetch<Person>(`/v1/cms/people/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      await delay(150);
      const idx = localStore.people.findIndex(p => p.id === id);
      if (idx !== -1) {
        localStore.people[idx] = { ...localStore.people[idx], ...updates };
        return localStore.people[idx];
      }
      throw new Error('Person not found');
    }
  },

  async deletePerson(id: string): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/v1/cms/people/${id}`, { method: 'DELETE' });
    } catch {
      await delay(150);
      localStore.people = localStore.people.filter(p => p.id !== id);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // MODULE 3: TEAMS
  // -------------------------------------------------------------
  async getTeams(): Promise<Team[]> {
    try {
      return await apiFetch<Team[]>('/v1/cms/teams');
    } catch {
      await delay(100);
      return [...localStore.teams];
    }
  },

  async getTeamById(id: string): Promise<Team> {
    try {
      return await apiFetch<Team>(`/v1/cms/teams/${id}`);
    } catch {
      await delay(100);
      const team = localStore.teams.find(t => t.id === id || t.slug === id);
      if (!team) throw new Error('Team not found');
      return { ...team };
    }
  },

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    try {
      return await apiFetch<Team>(`/v1/cms/teams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      await delay(150);
      const idx = localStore.teams.findIndex(t => t.id === id);
      if (idx !== -1) {
        localStore.teams[idx] = { ...localStore.teams[idx], ...updates };
        return localStore.teams[idx];
      }
      throw new Error('Team not found');
    }
  },

  // -------------------------------------------------------------
  // MODULE 4: INITIATIVES
  // -------------------------------------------------------------
  async getInitiatives(): Promise<Initiative[]> {
    try {
      return await apiFetch<Initiative[]>('/v1/cms/initiatives');
    } catch {
      await delay(100);
      return [...localStore.initiatives];
    }
  },

  async getInitiativeById(id: string): Promise<Initiative> {
    try {
      return await apiFetch<Initiative>(`/v1/cms/initiatives/${id}`);
    } catch {
      await delay(100);
      const init = localStore.initiatives.find(i => i.id === id || i.slug === id);
      if (!init) throw new Error('Initiative not found');
      return { ...init };
    }
  },

  async createInitiative(initiative: Omit<Initiative, 'id' | 'updatedAt' | 'submissionsCount'>): Promise<Initiative> {
    try {
      return await apiFetch<Initiative>('/v1/cms/initiatives', {
        method: 'POST',
        body: JSON.stringify(initiative),
      });
    } catch {
      await delay(200);
      const newInit: Initiative = {
        ...initiative,
        id: `init-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        submissionsCount: 0,
      };
      localStore.initiatives.unshift(newInit);
      return newInit;
    }
  },

  async updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative> {
    try {
      return await apiFetch<Initiative>(`/v1/cms/initiatives/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      await delay(200);
      const idx = localStore.initiatives.findIndex(i => i.id === id);
      if (idx !== -1) {
        localStore.initiatives[idx] = {
          ...localStore.initiatives[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return localStore.initiatives[idx];
      }
      throw new Error('Initiative not found');
    }
  },

  async deleteInitiative(id: string): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/v1/cms/initiatives/${id}`, { method: 'DELETE' });
    } catch {
      await delay(150);
      localStore.initiatives = localStore.initiatives.filter(i => i.id !== id);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // MODULE 5: STORIES
  // -------------------------------------------------------------
  async getStories(): Promise<Story[]> {
    try {
      return await apiFetch<Story[]>('/v1/cms/stories');
    } catch {
      await delay(100);
      return [...localStore.stories];
    }
  },

  async createStory(story: Omit<Story, 'id'>): Promise<Story> {
    try {
      return await apiFetch<Story>('/v1/cms/stories', {
        method: 'POST',
        body: JSON.stringify(story),
      });
    } catch {
      await delay(200);
      const newStory: Story = {
        ...story,
        id: `sty-${Date.now()}`,
        viewsCount: 0,
      };
      localStore.stories.unshift(newStory);
      return newStory;
    }
  },

  async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    try {
      return await apiFetch<Story>(`/v1/cms/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      await delay(150);
      const idx = localStore.stories.findIndex(s => s.id === id);
      if (idx !== -1) {
        localStore.stories[idx] = { ...localStore.stories[idx], ...updates };
        return localStore.stories[idx];
      }
      throw new Error('Story not found');
    }
  },

  async deleteStory(id: string): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/v1/cms/stories/${id}`, { method: 'DELETE' });
    } catch {
      await delay(150);
      localStore.stories = localStore.stories.filter(s => s.id !== id);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // MODULE 6: STAKEHOLDERS
  // -------------------------------------------------------------
  async getStakeholders(): Promise<{
    partners: Partner[];
    speakers: Speaker[];
    startups: Startup[];
    alumni: Alumni[];
  }> {
    try {
      return await apiFetch('/v1/cms/stakeholders');
    } catch {
      await delay(100);
      return {
        partners: [...localStore.partners],
        speakers: [...localStore.speakers],
        startups: [...localStore.startups],
        alumni: [...localStore.alumni],
      };
    }
  },

  async createPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
    const newPartner: Partner = { ...partner, id: `part-${Date.now()}` };
    localStore.partners.push(newPartner);
    return newPartner;
  },

  async createSpeaker(speaker: Omit<Speaker, 'id'>): Promise<Speaker> {
    const newSpeaker: Speaker = { ...speaker, id: `spk-${Date.now()}` };
    localStore.speakers.push(newSpeaker);
    return newSpeaker;
  },

  async createStartup(startup: Omit<Startup, 'id'>): Promise<Startup> {
    const newStartup: Startup = { ...startup, id: `stu-${Date.now()}` };
    localStore.startups.push(newStartup);
    return newStartup;
  },

  // -------------------------------------------------------------
  // MODULE 7: MEDIA & R2 DIRECT UPLOAD WORKFLOW
  // -------------------------------------------------------------
  async getMediaAssets(): Promise<MediaAsset[]> {
    try {
      return await apiFetch<MediaAsset[]>('/v1/cms/media');
    } catch {
      await delay(100);
      return [...localStore.mediaAssets];
    }
  },

  async presignUpload(filename: string, mimeType: string, sizeBytes: number, purpose: string) {
    try {
      return await apiFetch<{ uploadUrl: string; assetKey: string; assetId: string }>('/v1/uploads/presign', {
        method: 'POST',
        body: JSON.stringify({ filename, mimeType, sizeBytes, purpose }),
      });
    } catch {
      await delay(150);
      const assetId = `med-${Date.now()}`;
      const assetKey = `public/${purpose}/${assetId}/v1-${filename}`;
      return {
        uploadUrl: `https://mock-r2-upload.gec.in/${assetKey}`,
        assetKey,
        assetId,
      };
    }
  },

  async completeUpload(assetId: string, assetKey: string, name: string, mimeType: string, sizeBytes: number, aspectRatio = '16:9') {
    try {
      return await apiFetch<MediaAsset>('/v1/uploads/complete', {
        method: 'POST',
        body: JSON.stringify({ assetId, assetKey, name, mimeType, sizeBytes, aspectRatio }),
      });
    } catch {
      await delay(200);
      const newAsset: MediaAsset = {
        id: assetId,
        name,
        category: mimeType.startsWith('video/') ? 'Videos' : 'Images',
        aspectRatio: aspectRatio as any,
        cdnUrl: `https://media-staging.gec.in/${assetKey}`,
        key: assetKey,
        mimeType,
        sizeBytes,
        referenceCount: 0,
        references: [],
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User',
      };
      localStore.mediaAssets.unshift(newAsset);
      return newAsset;
    }
  },

  async deleteMediaAsset(id: string): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/v1/cms/media/${id}`, { method: 'DELETE' });
    } catch {
      await delay(100);
      localStore.mediaAssets = localStore.mediaAssets.filter(m => m.id !== id);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // MODULE 8: SUBMISSIONS
  // -------------------------------------------------------------
  async getSubmissions(): Promise<Submission[]> {
    try {
      return await apiFetch<Submission[]>('/v1/cms/submissions');
    } catch {
      await delay(100);
      return [...localStore.submissions];
    }
  },

  async updateSubmissionStatus(id: string, status: Submission['status'], notes?: string): Promise<Submission> {
    try {
      return await apiFetch<Submission>(`/v1/cms/submissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      await delay(150);
      const sub = localStore.submissions.find(s => s.id === id);
      if (sub) {
        sub.status = status;
        if (notes !== undefined) sub.notes = notes;
        return { ...sub };
      }
      throw new Error('Submission not found');
    }
  },

  // -------------------------------------------------------------
  // MODULE 9: GOOGLE FORMS & AI COPILOT
  // -------------------------------------------------------------
  async getGoogleForms(): Promise<GoogleForm[]> {
    try {
      return await apiFetch<GoogleForm[]>('/v1/cms/google-forms');
    } catch {
      await delay(100);
      return [...localStore.googleForms];
    }
  },

  async syncGoogleFormResponses(formId: string): Promise<{ syncedCount: number; lastSyncAt: string }> {
    try {
      return await apiFetch<{ syncedCount: number; lastSyncAt: string }>(`/v1/cms/google-forms/${formId}/sync`, {
        method: 'POST',
      });
    } catch {
      await delay(600);
      const form = localStore.googleForms.find(f => f.id === formId);
      const now = new Date().toISOString();
      if (form) {
        form.lastResponseSyncAt = now;
        form.responseCount += 2;
      }
      return { syncedCount: 2, lastSyncAt: now };
    }
  },

  async verifyGoogleFormManualUpload(formId: string): Promise<{ verified: boolean; message: string }> {
    try {
      return await apiFetch(`/v1/cms/google-forms/${formId}/verify-manual-upload`, {
        method: 'POST',
      });
    } catch {
      await delay(500);
      const form = localStore.googleForms.find(f => f.id === formId);
      if (form) {
        form.manualUploadVerified = true;
        form.lifecycleState = 'ready_for_review';
        form.manualItemIds = ['item_upload_verified_99'];
        return {
          verified: true,
          message: 'Verified 1 manual file-upload question in Google Forms My Drive.',
        };
      }
      throw new Error('Form not found');
    }
  },

  async exportFormResponsesToSheet(formId: string, sheetName: string): Promise<{ sheetUrl: string }> {
    try {
      return await apiFetch(`/v1/cms/google-forms/${formId}/export-sheet`, {
        method: 'POST',
        body: JSON.stringify({ sheetName }),
      });
    } catch {
      await delay(400);
      const form = localStore.googleForms.find(f => f.id === formId);
      const url = `https://docs.google.com/spreadsheets/d/export_${formId}_${Date.now()}`;
      if (form) form.sheetUrl = url;
      return { sheetUrl: url };
    }
  },

  async getFormResponses(formId: string): Promise<GoogleFormResponse[]> {
    try {
      return await apiFetch<GoogleFormResponse[]>(`/v1/cms/google-forms/${formId}/responses`);
    } catch {
      await delay(100);
      return localStore.formResponses.filter(r => r.formId === formId);
    }
  },

  // Copilot Chat & Confirmation Flow
  async sendCopilotMessage(content: string, conversationId = 'conv-001'): Promise<CopilotMessage> {
    try {
      return await apiFetch<CopilotMessage>('/v1/cms/copilot/message', {
        method: 'POST',
        body: JSON.stringify({ content, conversationId }),
      });
    } catch {
      await delay(500);
      const userMsg: CopilotMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      localStore.copilotMessages.push(userMsg);

      // Intelligent simulated assistant response based on prompt
      let assistantMsg: CopilotMessage;
      const lower = content.toLowerCase();

      if (lower.includes('hero') || lower.includes('spotlight') || lower.includes('headline')) {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          role: 'assistant',
          content: `I've analyzed your request for the Hero Spotlight. I generated a proposed update that updates the campaign copy and sets the urgency badge. You can review the diff below and confirm with 1 click.`,
          timestamp: new Date().toISOString(),
          proposal: {
            id: `prop-${Date.now()}`,
            conversationId,
            actionType: 'update_draft',
            targetId: 'hero-camp-001',
            targetVersion: 'v1.3',
            preview: {
              summary: 'Proposed Hero Spotlight copy revision based on your prompt',
              details: { campaign: 'Startup Development Program Cohort 04' },
              diff: [
                { field: 'Headline', before: localStore.heroSpotlight.headline, after: 'APPLICATIONS CLOSING: STARTUP DEVELOPMENT PROGRAM 2026' },
                { field: 'Eyebrow / Badge', before: localStore.heroSpotlight.eyebrowBadge, after: 'URGENT · 24 HOURS REMAINING' },
              ],
            },
            status: 'proposed',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
            idempotencyKey: `idem-copilot-${Date.now()}`,
          },
        };
      } else if (lower.includes('form') || lower.includes('google')) {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          role: 'assistant',
          content: `I've constructed a validated GoogleFormPlan with 4 questions and 1 file-upload requirement. Notice that because file-upload questions cannot be created via Google API directly, a manual setup checkpoint will be created.`,
          timestamp: new Date().toISOString(),
          proposal: {
            id: `prop-${Date.now()}`,
            conversationId,
            actionType: 'create_google_form',
            preview: {
              summary: 'Generate Google Form: "Pitch & Innovation Sprint Intake"',
              details: {
                questionsCount: 4,
                manualUploadRequired: true,
                driveStorage: 'Automation Account My Drive',
              },
            },
            status: 'proposed',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
            idempotencyKey: `idem-form-gen-${Date.now()}`,
          },
        };
      } else {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          role: 'assistant',
          content: `I am your GEC CMS AI Copilot powered by Gemini. I can help you draft editorial stories, build Google Form plans, update hero spotlight campaigns, or formulate complex submission filter queries. What would you like to accomplish?`,
          timestamp: new Date().toISOString(),
        };
      }

      localStore.copilotMessages.push(assistantMsg);
      return assistantMsg;
    }
  },

  async confirmCopilotProposal(proposalId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiFetch('/v1/cms/copilot/confirm-action', {
        method: 'POST',
        body: JSON.stringify({ proposalId }),
      });
    } catch {
      await delay(400);
      // Find proposal in messages
      for (const msg of localStore.copilotMessages) {
        if (msg.proposal && msg.proposal.id === proposalId) {
          msg.proposal.status = 'succeeded';
          if (msg.proposal.actionType === 'update_draft') {
            localStore.heroSpotlight.status = 'Urgency / Deadline';
            localStore.heroSpotlight.eyebrowBadge = '48 HOURS LEFT · FINAL APPLICATION WINDOW';
          }
          break;
        }
      }
      return { success: true, message: 'Proposal executed and verified successfully.' };
    }
  },

  // -------------------------------------------------------------
  // MODULE 10: ANALYTICS
  // -------------------------------------------------------------
  async getAnalyticsOverview() {
    try {
      return await apiFetch('/v1/cms/analytics/overview');
    } catch {
      await delay(100);
      return {
        traffic: {
          totalPageviews: 148920,
          uniqueVisitors: 42150,
          avgDurationSec: 184,
          bounceRatePct: 28.4,
        },
        pageDistribution: [
          { page: 'P1 Home', views: 82400, pct: 55 },
          { page: 'P4 Initiatives', views: 32600, pct: 22 },
          { page: 'P3 Teams', views: 16400, pct: 11 },
          { page: 'P5 Stories', views: 11800, pct: 8 },
          { page: 'P2 About', views: 5720, pct: 4 },
        ],
        teamRecruitmentDemand: [
          { team: 'Team 06: Tech', apps: 48 },
          { team: 'Team 01: Startup Dev', apps: 42 },
          { team: 'Team 03: Marketing', apps: 35 },
          { team: 'Team 05: Media', apps: 31 },
          { team: 'Team 02: PR', apps: 29 },
          { team: 'Team 07: Career Connect', apps: 22 },
          { team: 'Team 04: Events', apps: 19 },
        ],
      };
    }
  },

  // -------------------------------------------------------------
  // MODULE 11: USERS, RBAC, AUDIT & SETTINGS
  // -------------------------------------------------------------
  async getUsers(): Promise<CmsUser[]> {
    try {
      return await apiFetch<CmsUser[]>('/v1/cms/users');
    } catch {
      await delay(100);
      return [...localStore.users];
    }
  },

  async createUser(user: Omit<CmsUser, 'id'>): Promise<CmsUser> {
    try {
      return await apiFetch<CmsUser>('/v1/cms/users', {
        method: 'POST',
        body: JSON.stringify(user),
      });
    } catch {
      await delay(150);
      const newUser: CmsUser = { ...user, id: `usr-${Date.now()}` };
      localStore.users.push(newUser);
      return newUser;
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      return await apiFetch<AuditLog[]>('/v1/cms/audit');
    } catch {
      await delay(100);
      return [...localStore.auditLogs];
    }
  },

  async getSiteSettings(): Promise<SiteSettings> {
    try {
      return await apiFetch<SiteSettings>('/v1/cms/settings');
    } catch {
      await delay(100);
      return JSON.parse(JSON.stringify(localStore.settings));
    }
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
      return await apiFetch<SiteSettings>('/v1/cms/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch {
      await delay(200);
      localStore.settings = { ...localStore.settings, ...settings };
      localStore.settings.general.lastSyncTimestamp = new Date().toISOString();
      return JSON.parse(JSON.stringify(localStore.settings));
    }
  },

  async purgeCdnCache(): Promise<{ success: boolean; purgedPathsCount: number; timestamp: string }> {
    try {
      return await apiFetch('/v1/cms/settings/purge-cache', { method: 'POST' });
    } catch {
      await delay(400);
      const now = new Date().toISOString();
      localStore.settings.general.lastSyncTimestamp = now;
      localStore.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actorName: 'Current User',
        actorEmail: 'admin@gec.in',
        action: 'CACHE_PURGE',
        resource: 'Cloudflare CDN',
        details: 'Instant cache purge across all 5 public website routes',
        timestamp: now,
        ipAddress: '127.0.0.1',
      });
      return {
        success: true,
        purgedPathsCount: 5,
        timestamp: now,
      };
    }
  },
};
