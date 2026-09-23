import crypto from 'node:crypto';
import type {
  RevalidationPayload,
  RevalidationResponse,
  ApiProblemError,
} from './types';

/**
 * Thread-safe, memory-bounded in-memory LRU Nonce Tracker with automatic TTL expiration.
 * Defends against replay attacks without unbounded memory growth.
 */
export class NonceTracker {
  private nonces = new Map<string, number>();
  private readonly maxEntries: number;

  constructor(maxEntries = 10000) {
    this.maxEntries = maxEntries;
  }

  /**
   * Cleans up expired nonces based on current epoch time.
   */
  private cleanup(now: number): void {
    for (const [nonce, expiresAt] of this.nonces.entries()) {
      if (expiresAt <= now) {
        this.nonces.delete(nonce);
      }
    }
  }

  /**
   * Checks if a nonce has already been seen and is still valid.
   */
  public has(nonce: string): boolean {
    const now = Date.now();
    this.cleanup(now);
    return this.nonces.has(nonce);
  }

  /**
   * Records a nonce with a given TTL. Evicts oldest entries when capacity is exceeded.
   */
  public track(nonce: string, ttlMs = 300_000): void {
    const now = Date.now();
    this.cleanup(now);

    if (this.nonces.size >= this.maxEntries) {
      // Evict oldest entry (Map preserves insertion order in JS)
      const oldestKey = this.nonces.keys().next().value;
      if (oldestKey) {
        this.nonces.delete(oldestKey);
      }
    }

    this.nonces.set(nonce, now + ttlMs);
  }

  /**
   * Clears all stored nonces (useful for testing).
   */
  public clear(): void {
    this.nonces.clear();
  }

  /**
   * Returns current count of stored nonces.
   */
  public get size(): number {
    return this.nonces.size;
  }
}

// Global singleton nonce tracker for the server runtime
export const globalNonceTracker = new NonceTracker();

/**
 * Parses timestamp from header string.
 * Supports:
 * 1. Unix epoch in seconds (e.g. 1774076259)
 * 2. Unix epoch in milliseconds (e.g. 1774076259000)
 * 3. ISO 8601 string (e.g. "2026-09-20T07:07:39.000Z")
 */
export function parseTimestamp(timestampHeader: string): number | null {
  if (!timestampHeader || typeof timestampHeader !== 'string') {
    return null;
  }

  const trimmed = timestampHeader.trim();

  // If purely numeric, check whether seconds or milliseconds
  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    if (!Number.isFinite(num)) return null;
    return num > 1e11 ? num : num * 1000;
  }

  // Parse ISO 8601 or RFC 2822
  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Validates timestamp drift against maximum allowed drift window (default: 300 seconds).
 */
export function validateTimestampDrift(
  timestampMs: number,
  maxDriftSeconds = 300,
  referenceNowMs = Date.now()
): { valid: boolean; driftSeconds: number } {
  const driftSeconds = Math.abs(referenceNowMs - timestampMs) / 1000;
  return {
    valid: driftSeconds <= maxDriftSeconds,
    driftSeconds,
  };
}

/**
 * Primary canonical payload builder recommended for GEC Outbox -> Next.js web handshake.
 * Standard format: `${timestamp}.${nonce}.${rawBody}`
 */
export function buildCanonicalPayload(
  timestamp: string,
  nonce: string,
  rawBody: string
): string {
  return `${timestamp}.${nonce}.${rawBody}`;
}

/**
 * Computes HMAC-SHA256 hex string for a given payload and secret.
 */
export function computeHmacSha256(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data, 'utf8').digest('hex');
}

/**
 * Timing-safe comparison of two hex-encoded HMAC signatures to prevent timing attacks.
 */
export function timingSafeEqualHex(a: string, b: string): boolean {
  const cleanA = a.trim().toLowerCase();
  const cleanB = b.trim().toLowerCase();

  if (cleanA.length !== cleanB.length) {
    return false;
  }

  try {
    const bufA = Buffer.from(cleanA, 'hex');
    const bufB = Buffer.from(cleanB, 'hex');
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Validates an incoming HMAC signature against canonical payload candidates.
 * Checks primary format `${timestamp}.${nonce}.${rawBody}`, plus alternative standard formats
 * (colon-delimited, raw body, canonical structured event string, and deterministic JSON).
 */
export function verifyRevalidationSignature(
  rawBody: string,
  timestampHeader: string,
  nonceHeader: string,
  parsedPayload: RevalidationPayload | null,
  providedSignature: string,
  secret: string
): boolean {
  if (!providedSignature || !secret) {
    return false;
  }

  // Remove optional "sha256=" prefix if provided
  const cleanSignature = providedSignature.startsWith('sha256=')
    ? providedSignature.slice(7)
    : providedSignature;

  // Build candidate canonical strings
  const candidates: string[] = [
    // 1. Primary standard: timestamp.nonce.rawBody
    buildCanonicalPayload(timestampHeader, nonceHeader, rawBody),
    // 2. Colon-delimited: timestamp:nonce:rawBody
    `${timestampHeader}:${nonceHeader}:${rawBody}`,
    // 3. Raw body alone
    rawBody,
  ];

  if (parsedPayload && typeof parsedPayload === 'object') {
    const eventUuid = parsedPayload.eventUuid || '';
    const sortedTags = Array.isArray(parsedPayload.tags)
      ? [...parsedPayload.tags].sort().join(',')
      : '';
    const sortedPaths = Array.isArray(parsedPayload.paths)
      ? [...parsedPayload.paths].sort().join(',')
      : '';

    // 4. Structured canonical format with eventUuid, tags, paths, timestamp, nonce
    candidates.push(
      `${eventUuid}:${sortedTags}:${sortedPaths}:${timestampHeader}:${nonceHeader}`
    );
    candidates.push(
      `${timestampHeader}:${nonceHeader}:${eventUuid}:${sortedTags}:${sortedPaths}`
    );

    // 5. Deterministic sorted JSON
    try {
      const canonicalObj = {
        eventUuid,
        nonce: nonceHeader,
        paths: Array.isArray(parsedPayload.paths)
          ? [...parsedPayload.paths].sort()
          : [],
        tags: Array.isArray(parsedPayload.tags)
          ? [...parsedPayload.tags].sort()
          : [],
        timestamp: timestampHeader,
      };
      candidates.push(JSON.stringify(canonicalObj));
    } catch {
      // Ignore JSON sorting error
    }
  }

  // Check each candidate using constant-time comparison
  for (const candidate of candidates) {
    const expectedHex = computeHmacSha256(secret, candidate);
    if (timingSafeEqualHex(cleanSignature, expectedHex)) {
      return true;
    }
  }

  return false;
}

export interface RevalidationHandshakeResult {
  status: number;
  data: RevalidationResponse | ApiProblemError;
}

/**
 * Pure processing engine for the revalidation handshake.
 * Validates HMAC, timestamps, nonces, payload schema, and executes cache callbacks.
 */
export async function processRevalidationHandshake(
  headers: {
    signature: string | null;
    timestamp: string | null;
    nonce: string | null;
  },
  rawBody: string,
  secret: string | undefined,
  callbacks?: {
    onRevalidateTag?: (tag: string) => void;
    onRevalidatePath?: (path: string) => void;
  },
  nonceTracker: NonceTracker = globalNonceTracker
): Promise<RevalidationHandshakeResult> {
  const requestId = crypto.randomUUID();

  // 1. Verify server configuration
  if (!secret) {
    console.error(`[Revalidate][${requestId}] REVALIDATION_HMAC_SECRET is missing on the server.`);
    return {
      status: 500,
      data: {
        status: 500,
        code: 'SERVER_CONFIGURATION_ERROR',
        title: 'Server configuration error',
        detail: 'Revalidation secret is not configured on the server.',
        requestId,
      },
    };
  }

  // 2. Validate required security headers
  const { signature, timestamp: timestampHeader, nonce } = headers;
  if (!signature || !timestampHeader || !nonce) {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'MISSING_SECURITY_HEADERS',
        title: 'Missing security headers',
        detail: 'Headers x-gec-signature, x-gec-timestamp, and x-gec-nonce are required.',
        requestId,
      },
    };
  }

  // 3. Validate timestamp format and clock drift (<= 300 seconds)
  const timestampMs = parseTimestamp(timestampHeader);
  if (timestampMs === null) {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_TIMESTAMP',
        title: 'Invalid timestamp format',
        detail: 'Header x-gec-timestamp must be a valid epoch number (seconds or milliseconds) or ISO 8601 string.',
        requestId,
      },
    };
  }

  const { valid: isDriftValid, driftSeconds } = validateTimestampDrift(timestampMs, 300);
  if (!isDriftValid) {
    return {
      status: 401,
      data: {
        status: 401,
        code: 'TIMESTAMP_DRIFT_EXCEEDED',
        title: 'Timestamp expired',
        detail: `Request timestamp drift (${Math.round(driftSeconds)}s) exceeds allowed window of 300s.`,
        requestId,
      },
    };
  }

  // 4. Check for replay attack via Nonce tracker
  if (nonceTracker.has(nonce)) {
    return {
      status: 401,
      data: {
        status: 401,
        code: 'REPLAY_ATTACK_DETECTED',
        title: 'Replay attack prevented',
        detail: 'Request nonce has already been consumed within the active revalidation window.',
        requestId,
      },
    };
  }

  // 5. Parse JSON payload
  let payload: RevalidationPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_JSON',
        title: 'Malformed JSON payload',
        detail: 'The revalidation body must be valid JSON.',
        requestId,
      },
    };
  }

  // 6. Validate payload structure
  if (!payload || typeof payload !== 'object') {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_PAYLOAD',
        title: 'Invalid payload',
        detail: 'Payload must be a JSON object.',
        requestId,
      },
    };
  }

  if (!payload.eventUuid || typeof payload.eventUuid !== 'string' || !payload.eventUuid.trim()) {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_PAYLOAD',
        title: 'Missing eventUuid',
        detail: 'Payload property "eventUuid" is required and must be a non-empty string.',
        requestId,
      },
    };
  }

  if (payload.tags !== undefined && !Array.isArray(payload.tags)) {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_PAYLOAD',
        title: 'Invalid tags format',
        detail: 'Payload property "tags", if provided, must be an array of strings.',
        requestId,
      },
    };
  }

  if (payload.paths !== undefined && !Array.isArray(payload.paths)) {
    return {
      status: 400,
      data: {
        status: 400,
        code: 'INVALID_PAYLOAD',
        title: 'Invalid paths format',
        detail: 'Payload property "paths", if provided, must be an array of strings.',
        requestId,
      },
    };
  }

  // 7. Verify HMAC-SHA256 signature
  const isSignatureValid = verifyRevalidationSignature(
    rawBody,
    timestampHeader,
    nonce,
    payload,
    signature,
    secret
  );

  if (!isSignatureValid) {
    return {
      status: 401,
      data: {
        status: 401,
        code: 'INVALID_SIGNATURE',
        title: 'Unauthorized',
        detail: 'HMAC-SHA256 signature verification failed.',
        requestId,
      },
    };
  }

  // 8. Signature is verified; mark nonce as consumed
  nonceTracker.track(nonce, 300_000);

  // 9. Execute revalidations
  const revalidatedTags: string[] = [];
  const revalidatedPaths: string[] = [];

  if (Array.isArray(payload.tags)) {
    for (const rawTag of payload.tags) {
      if (typeof rawTag === 'string') {
        const tag = rawTag.trim();
        if (tag) {
          callbacks?.onRevalidateTag?.(tag);
          revalidatedTags.push(tag);
        }
      }
    }
  }

  if (Array.isArray(payload.paths)) {
    for (const rawPath of payload.paths) {
      if (typeof rawPath === 'string') {
        const path = rawPath.trim();
        if (path) {
          callbacks?.onRevalidatePath?.(path);
          revalidatedPaths.push(path);
        }
      }
    }
  }

  // 10. Return 200 OK success envelope
  return {
    status: 200,
    data: {
      revalidated: true,
      eventUuid: payload.eventUuid,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
    },
  };
}
