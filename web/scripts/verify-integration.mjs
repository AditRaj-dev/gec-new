import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Helper to calculate HMAC-SHA256
function computeHmac(secret, payload) {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

console.log('=== RUNNING PUBLIC WEB & CACHE INTEGRATION VERIFICATION ===\n');

// --------------------------------------------------------------------------
// TEST 1: Revalidation Security & Nonce Deduplication Logic
// --------------------------------------------------------------------------
console.log('Test 1: Revalidation Security & Nonce Deduplication');

import {
  NonceTracker,
  parseTimestamp,
  validateTimestampDrift,
  buildCanonicalPayload,
  verifyRevalidationSignature,
  computeHmacSha256,
  timingSafeEqualHex,
  processRevalidationHandshake,
} from '../src/lib/revalidation.ts';

const tracker = new NonceTracker(5);

// 1.1 Nonce tracking
assert.strictEqual(tracker.has('nonce-1'), false, 'nonce-1 should not exist yet');
tracker.track('nonce-1', 1000);
assert.strictEqual(tracker.has('nonce-1'), true, 'nonce-1 should be detected');

// 1.2 Replay detection
assert.strictEqual(tracker.has('nonce-1'), true, 'nonce-1 replay should be detected');

// 1.3 Capacity and LRU eviction
tracker.track('nonce-2', 10000);
tracker.track('nonce-3', 10000);
tracker.track('nonce-4', 10000);
tracker.track('nonce-5', 10000);
assert.strictEqual(tracker.size, 5, 'tracker size should be 5');

// Adding 6th should evict the oldest (nonce-1)
tracker.track('nonce-6', 10000);
assert.strictEqual(tracker.size, 5, 'tracker size should remain bounded at 5');
assert.strictEqual(tracker.has('nonce-1'), false, 'oldest nonce-1 should have been evicted');
assert.strictEqual(tracker.has('nonce-6'), true, 'nonce-6 should be present');

// 1.4 Timestamp parsing (numeric seconds, numeric ms, ISO 8601)
const nowEpochSec = Math.floor(Date.now() / 1000);
const nowEpochMs = Date.now();
const nowIso = new Date().toISOString();

const parsedSec = parseTimestamp(String(nowEpochSec));
assert.ok(parsedSec !== null && Math.abs(parsedSec - nowEpochMs) < 2000, 'Epoch seconds should parse to ms');

const parsedMs = parseTimestamp(String(nowEpochMs));
assert.strictEqual(parsedMs, nowEpochMs, 'Epoch ms should parse directly');

const parsedIso = parseTimestamp(nowIso);
assert.ok(parsedIso !== null && Math.abs(parsedIso - nowEpochMs) < 2000, 'ISO timestamp should parse to ms');

assert.strictEqual(parseTimestamp('invalid-date'), null, 'Invalid timestamp should return null');

// 1.5 Drift validation (<= 300s passes, > 300s fails)
const fresh = validateTimestampDrift(Date.now() - 60_000, 300); // 1 min ago
assert.strictEqual(fresh.valid, true, 'Drift of 60s should be valid');

const stale = validateTimestampDrift(Date.now() - 400_000, 300); // ~6.6 min ago
assert.strictEqual(stale.valid, false, 'Drift of 400s should be invalid');
assert.ok(stale.driftSeconds > 300, 'Drift seconds should exceed 300');

console.log('✓ Nonce deduplication and timestamp drift validation passed.');

// --------------------------------------------------------------------------
// TEST 2: HMAC-SHA256 Canonical Handshake Verification
// --------------------------------------------------------------------------
console.log('Test 2: HMAC Signature and Canonical Formats');

const testSecret = 'dev-revalidation-secret-at-least-256-bits-long-example';
const testTimestamp = String(Math.floor(Date.now() / 1000));
const testNonce = crypto.randomUUID();
const payloadObj = {
  eventUuid: 'evt-test-12345',
  tags: ['hero', 'initiatives'],
  paths: ['/'],
};
const rawBody = JSON.stringify(payloadObj);

// Candidate 1: Standard canonical format (${timestamp}.${nonce}.${rawBody})
const canonical = buildCanonicalPayload(testTimestamp, testNonce, rawBody);
const validSignature = computeHmacSha256(testSecret, canonical);

// Verify valid signature
const isVerified = verifyRevalidationSignature(
  rawBody,
  testTimestamp,
  testNonce,
  payloadObj,
  validSignature,
  testSecret
);
assert.strictEqual(isVerified, true, 'Primary canonical payload format must verify');

// Verify with sha256= prefix
const isVerifiedPrefix = verifyRevalidationSignature(
  rawBody,
  testTimestamp,
  testNonce,
  payloadObj,
  `sha256=${validSignature}`,
  testSecret
);
assert.strictEqual(isVerifiedPrefix, true, 'Signature with sha256= prefix must verify');

// Candidate 2: Colon-delimited format (${timestamp}:${nonce}:${rawBody})
const colonCanonical = `${testTimestamp}:${testNonce}:${rawBody}`;
const colonSig = computeHmacSha256(testSecret, colonCanonical);
assert.strictEqual(
  verifyRevalidationSignature(rawBody, testTimestamp, testNonce, payloadObj, colonSig, testSecret),
  true,
  'Colon-delimited signature format must verify'
);

// Candidate 3: Deterministic JSON
const deterministicJson = JSON.stringify({
  eventUuid: payloadObj.eventUuid,
  nonce: testNonce,
  paths: ['/'],
  tags: ['hero', 'initiatives'],
  timestamp: testTimestamp,
});
const jsonSig = computeHmacSha256(testSecret, deterministicJson);
assert.strictEqual(
  verifyRevalidationSignature(rawBody, testTimestamp, testNonce, payloadObj, jsonSig, testSecret),
  true,
  'Deterministic JSON signature format must verify'
);

// Tampered payload detection
const tamperedBody = JSON.stringify({ ...payloadObj, eventUuid: 'evt-hacked-999' });
assert.strictEqual(
  verifyRevalidationSignature(tamperedBody, testTimestamp, testNonce, payloadObj, validSignature, testSecret),
  false,
  'Tampered payload must be rejected'
);

// Wrong secret detection
assert.strictEqual(
  verifyRevalidationSignature(rawBody, testTimestamp, testNonce, payloadObj, validSignature, 'wrong-secret'),
  false,
  'Invalid secret must be rejected'
);

// Timing safe equality
assert.strictEqual(timingSafeEqualHex('abcdef', 'abcdef'), true);
assert.strictEqual(timingSafeEqualHex('abcdef', '123456'), false);
assert.strictEqual(timingSafeEqualHex('abcdef', 'abc'), false);

console.log('✓ HMAC handshake and canonical verification passed.');

// --------------------------------------------------------------------------
// TEST 3: Public API Client & Fallback Projections
// --------------------------------------------------------------------------
console.log('Test 3: Public API Client Projections & Fallback Guarantees');

import {
  getHeroSpotlight,
  getInitiatives,
  getStories,
  getTeams,
  getPeople,
  getStakeholders,
  submitForm,
  FALLBACK_HERO_SPOTLIGHT,
  FALLBACK_INITIATIVES,
  FALLBACK_STORIES,
  FALLBACK_TEAMS,
  FALLBACK_PEOPLE,
  FALLBACK_STAKEHOLDERS,
} from '../src/lib/api.ts';

// 3.1 Verify fallback data is frozen
assert.throws(() => {
  // @ts-ignore
  FALLBACK_HERO_SPOTLIGHT.headline = 'Hacked';
}, 'Frozen fallback objects should not be mutable');

// 3.2 Verify API client returns frozen fallback projections when API_BASE_URL is unconfigured
const hero = await getHeroSpotlight();
assert.strictEqual(hero.headline, FALLBACK_HERO_SPOTLIGHT.headline);
assert.strictEqual(hero.badgeText, "Incubation Cohort '26 Open");

const initiatives = await getInitiatives();
assert.strictEqual(initiatives.length, FALLBACK_INITIATIVES.length);
assert.strictEqual(initiatives[0].title, 'Incubation & Venture Studio');

const stories = await getStories();
assert.strictEqual(stories.length, FALLBACK_STORIES.length);
assert.strictEqual(stories[0].category, 'Founder Story');

const teams = await getTeams();
assert.strictEqual(teams.length, 7, 'Must have exactly 7 GEC teams');
assert.strictEqual(teams[0].slug, 'startup-development');

const people = await getPeople();
assert.strictEqual(people.length >= 6, true, 'Must include leadership and mentors');
const president = people.find((p) => p.role === 'President');
assert.strictEqual(president?.name, 'Simran Jaiswal');

const stakeholders = await getStakeholders();
assert.strictEqual(stakeholders.length >= 3, true);

// 3.3 Verify submitForm fails closed with a retry message
const submissionResult = await submitForm({
  formType: 'incubation',
  fullName: 'Aryan Sharma',
  email: 'aryan@example.com',
  organizationOrCollege: 'Galgotias University',
  message: 'Seeking incubation for IoT venture',
});
assert.strictEqual(submissionResult.success, false);
assert.ok(submissionResult.message.length > 0);

console.log('✓ Public API client and frozen fallback projections verified.');

// --------------------------------------------------------------------------
// TEST 4: Revalidation Handshake Engine Simulation
// --------------------------------------------------------------------------
console.log('Test 4: Revalidation Handshake Process Simulation');

const simulatedTracker = new NonceTracker();
const executedTags = [];
const executedPaths = [];
const callbacks = {
  onRevalidateTag: (t) => executedTags.push(t),
  onRevalidatePath: (p) => executedPaths.push(p),
};

// 4.1 Valid Revalidation Request -> Expect 200 OK
const validNonce = crypto.randomUUID();
const validTs = String(Math.floor(Date.now() / 1000));
const validPayload = {
  eventUuid: 'evt-reval-001',
  tags: ['hero', 'initiatives'],
  paths: ['/'],
};
const validPayloadStr = JSON.stringify(validPayload);
const validSig = computeHmacSha256(
  testSecret,
  buildCanonicalPayload(validTs, validNonce, validPayloadStr)
);

const res1 = await processRevalidationHandshake(
  {
    signature: validSig,
    timestamp: validTs,
    nonce: validNonce,
  },
  validPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);

assert.strictEqual(res1.status, 200, 'Valid handshake must return 200 OK');
assert.strictEqual(res1.data.revalidated, true);
assert.strictEqual(res1.data.eventUuid, 'evt-reval-001');
assert.deepStrictEqual(res1.data.tags, ['hero', 'initiatives']);
assert.deepStrictEqual(res1.data.paths, ['/']);
assert.deepStrictEqual(executedTags, ['hero', 'initiatives']);
assert.deepStrictEqual(executedPaths, ['/']);

// 4.2 Replay Attack with identical nonce -> Expect 401
const res2 = await processRevalidationHandshake(
  {
    signature: validSig,
    timestamp: validTs,
    nonce: validNonce, // Reused nonce!
  },
  validPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);
assert.strictEqual(res2.status, 401, 'Replayed nonce must be rejected with 401');
assert.strictEqual(res2.data.code, 'REPLAY_ATTACK_DETECTED');

// 4.3 Stale Timestamp (> 300s) -> Expect 401
const staleTs = String(Math.floor(Date.now() / 1000) - 350); // 350s drift
const staleNonce = crypto.randomUUID();
const staleSig = computeHmacSha256(
  testSecret,
  buildCanonicalPayload(staleTs, staleNonce, validPayloadStr)
);

const res3 = await processRevalidationHandshake(
  {
    signature: staleSig,
    timestamp: staleTs,
    nonce: staleNonce,
  },
  validPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);
assert.strictEqual(res3.status, 401, 'Stale timestamp drift > 300s must return 401');
assert.strictEqual(res3.data.code, 'TIMESTAMP_DRIFT_EXCEEDED');

// 4.4 Tampered Signature -> Expect 401
const res4 = await processRevalidationHandshake(
  {
    signature: 'deadbeef0123456789abcdef0123456789abcdef0123456789abcdef01234567',
    timestamp: validTs,
    nonce: crypto.randomUUID(),
  },
  validPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);
assert.strictEqual(res4.status, 401, 'Tampered signature must return 401');
assert.strictEqual(res4.data.code, 'INVALID_SIGNATURE');

// 4.5 Missing Header -> Expect 400
const res5 = await processRevalidationHandshake(
  {
    signature: validSig,
    timestamp: validTs,
    nonce: null, // missing nonce
  },
  validPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);
assert.strictEqual(res5.status, 400, 'Missing nonce header must return 400');
assert.strictEqual(res5.data.code, 'MISSING_SECURITY_HEADERS');

// 4.6 Missing eventUuid -> Expect 400
const invalidPayload = { tags: ['hero'] };
const invalidPayloadStr = JSON.stringify(invalidPayload);
const invalidPayloadNonce = crypto.randomUUID();
const invalidPayloadSig = computeHmacSha256(
  testSecret,
  buildCanonicalPayload(validTs, invalidPayloadNonce, invalidPayloadStr)
);

const res6 = await processRevalidationHandshake(
  {
    signature: invalidPayloadSig,
    timestamp: validTs,
    nonce: invalidPayloadNonce,
  },
  invalidPayloadStr,
  testSecret,
  callbacks,
  simulatedTracker
);
assert.strictEqual(res6.status, 400, 'Missing eventUuid must return 400');
assert.strictEqual(res6.data.code, 'INVALID_PAYLOAD');

// 4.7 Missing server secret -> Expect 500
const res7 = await processRevalidationHandshake(
  {
    signature: validSig,
    timestamp: validTs,
    nonce: crypto.randomUUID(),
  },
  validPayloadStr,
  undefined, // missing secret on server
  callbacks,
  simulatedTracker
);
assert.strictEqual(res7.status, 500, 'Missing secret on server must return 500');
assert.strictEqual(res7.data.code, 'SERVER_CONFIGURATION_ERROR');

console.log('✓ Revalidation handshake simulation passed all test cases.');

console.log('\n=== ALL INTEGRATION VERIFICATIONS PASSED SUCCESSFULLY ===');
