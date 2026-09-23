import type {
  HeroSpotlight,
  Initiative,
  Story,
  Team,
  Person,
  Stakeholder,
  SubmissionData,
  SubmissionResponse,
} from './types';
import {
  FALLBACK_HERO_SPOTLIGHT,
  FALLBACK_INITIATIVES,
  FALLBACK_STORIES,
  FALLBACK_TEAMS,
  FALLBACK_PEOPLE,
  FALLBACK_STAKEHOLDERS,
} from './fallbackData';

// Re-export all types so consumers can import directly from '@/lib/api'
export type * from './types';
export * from './fallbackData';

/**
 * Resolves the configured API base URL.
 * Supports server-side API_BASE_URL and browser NEXT_PUBLIC_API_BASE_URL.
 */
export function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
  return url.trim().replace(/\/+$/, '');
}

/**
 * Generic fetch wrapper with next cache tags and robust fallback behavior.
 * Never throws an unhandled exception so the public website is guaranteed to never crash.
 */
async function fetchPublishedProjection<T>(
  endpoint: string,
  tag: string,
  fallbackData: T
): Promise<T> {
  const baseUrl = getApiBaseUrl();

  // If no base URL is configured (e.g. initial dev or disconnected preview), return fallback immediately
  if (!baseUrl) {
    return fallbackData;
  }

  const url = `${baseUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: {
        tags: [tag],
      },
    });

    if (!res.ok) {
      console.warn(
        `[GEC-API] Non-200 response (${res.status} ${res.statusText}) fetching ${endpoint}. Serving frozen fallback.`
      );
      return fallbackData;
    }

    const payload = await res.json();

    // Support both direct projection return and { data: ... } or { items: ... } envelope formats
    if (payload && typeof payload === 'object') {
      if ('data' in payload && payload.data !== null && payload.data !== undefined) {
        return payload.data as T;
      }
      if ('items' in payload && Array.isArray(payload.items)) {
        return payload.items as T;
      }
    }

    return payload as T;
  } catch (error) {
    console.warn(
      `[GEC-API] Network/parsing failure for ${url}. Serving frozen fallback. Details:`,
      error instanceof Error ? error.message : error
    );
    return fallbackData;
  }
}

/**
 * Fetches the active Dynamic Hero Spotlight projection.
 * Cache Tag: 'hero'
 * Endpoint: /v1/public/hero
 */
export async function getHeroSpotlight(): Promise<HeroSpotlight> {
  return fetchPublishedProjection<HeroSpotlight>(
    '/v1/public/hero',
    'hero',
    FALLBACK_HERO_SPOTLIGHT
  );
}

/**
 * Fetches published initiatives.
 * Cache Tag: 'initiatives'
 * Endpoint: /v1/public/initiatives
 */
export async function getInitiatives(): Promise<Initiative[]> {
  return fetchPublishedProjection<Initiative[]>(
    '/v1/public/initiatives',
    'initiatives',
    FALLBACK_INITIATIVES as unknown as Initiative[]
  );
}

/**
 * Fetches published stories and community updates.
 * Cache Tag: 'stories'
 * Endpoint: /v1/public/stories
 */
export async function getStories(): Promise<Story[]> {
  return fetchPublishedProjection<Story[]>(
    '/v1/public/stories',
    'stories',
    FALLBACK_STORIES as unknown as Story[]
  );
}

/**
 * Fetches published GEC team structures and focus areas.
 * Cache Tag: 'teams'
 * Endpoint: /v1/public/teams
 */
export async function getTeams(): Promise<Team[]> {
  return fetchPublishedProjection<Team[]>(
    '/v1/public/teams',
    'teams',
    FALLBACK_TEAMS as unknown as Team[]
  );
}

/**
 * Fetches leadership, mentors, and notable guest speakers.
 * Cache Tag: 'people'
 * Endpoint: /v1/public/people
 */
export async function getPeople(): Promise<Person[]> {
  return fetchPublishedProjection<Person[]>(
    '/v1/public/people',
    'people',
    FALLBACK_PEOPLE as unknown as Person[]
  );
}

/**
 * Fetches partners, supported startups, and ecosystem stakeholders.
 * Cache Tag: 'stakeholders'
 * Endpoint: /v1/public/stakeholders
 */
export async function getStakeholders(): Promise<Stakeholder[]> {
  return fetchPublishedProjection<Stakeholder[]>(
    '/v1/public/stakeholders',
    'stakeholders',
    FALLBACK_STAKEHOLDERS as unknown as Stakeholder[]
  );
}

/**
 * Submits public applications, recruitment forms, or inquiries to NestJS API.
 * Endpoint: POST /v1/public/submissions
 * Fails closed with user-friendly retry message if API is unreachable.
 */
export async function submitForm(
  data: SubmissionData
): Promise<SubmissionResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: false,
      message: 'Submission service is temporarily offline. Please try again shortly.',
    };
  }

  const url = `${baseUrl}/v1/public/submissions`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        json?.detail ||
        json?.message ||
        `Submission failed with status code ${res.status}.`;
      return {
        success: false,
        message: errorMsg,
      };
    }

    return {
      success: true,
      submissionId:
        json?.submissionId || json?.id || json?.data?.submissionId || undefined,
      message: json?.message || 'Application submitted successfully.',
      receivedAt: json?.receivedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('[GEC-API] Submission transmission error:', err);
    return {
      success: false,
      message: 'Unable to deliver your submission at this time. Please check your network and try again.',
    };
  }
}
