# GEC Dispatch — Email Sending Service

> **Status:** Planned, not built. Decisions locked on 2026-09-25.
> **Provider:** [Resend](https://resend.com) (transactional API).
> **Purpose of this doc:** Give any agent or developer, in any session, everything needed to build the Dispatch email sender, or to move it to another provider without touching the rest of the system.
> **Related:** CMS plan (private artifact): https://claude.ai/artifact/5WNt7WHSYMRdykPRmWLTcE · Email template: [`docs/email-templates/dispatch-issue.html`](email-templates/dispatch-issue.html)

---

## 1. What this is

The GEC Dispatch is the cell's newsletter. On the website it lives in the floating Dispatch bin (`gec-web/src/components/dispatch-bin/`) and the newsletter bookshelf. Each issue edited in the CMS can also be **emailed to subscribers**.

Scope:
- Subscribe from the site → confirm by email (double opt-in).
- Core Admin sends or schedules an issue to confirmed subscribers.
- Editors can send test emails to themselves.
- Bounces, spam complaints and unsubscribes are tracked and respected.
- Per-issue stats: sent, delivered, opened, clicked, bounced, complained, unsubscribed.

Out of scope for now: segments beyond "all confirmed subscribers", A/B tests, automations/drip sequences.

---

## 2. The one rule that makes migration easy

**Resend is a pipe, not a database.** Everything that matters lives in GEC's own database and repo:

| Thing | Lives in | Never in |
|---|---|---|
| Subscriber list + status | GEC Postgres (`subscribers`) | Resend Audiences / Contacts |
| Email HTML template | Repo (`docs/email-templates/` → later `api/src/modules/email/templates/`) | Resend templates |
| Merge-tag rendering | GEC API | Resend variables |
| Unsubscribe links + handling | GEC API (signed token endpoint) | Resend-hosted unsubscribe page |
| Scheduling | GEC outbox (`scheduled_at`) | Resend `scheduled_at` |
| Send history + stats | GEC Postgres (`email_messages`, `email_events`) | Resend dashboard only |

We **do not use** Resend Broadcasts, Audiences, Contacts, Templates or hosted unsubscribe. They are convenient but would lock the list and history inside Resend.

Consequence: moving to another provider means rewriting **one provider file** plus env vars and DNS. See §10.

---

## 3. Resend facts (verified 2026-09-25 — re-check before building)

| Item | Value |
|---|---|
| Send one | `POST https://api.resend.com/emails` |
| Send batch | `POST https://api.resend.com/emails/batch` — up to **100 emails per request**; supports custom `headers`, `tags`, `scheduled_at`; **no attachments** in batch |
| Idempotency | `Idempotency-Key` header, ≤256 chars, unique per request, expires after 24 h |
| Webhook signing | Svix: headers `svix-id`, `svix-timestamp`, `svix-signature`; verify with `resend.webhooks.verify()` or the `svix` library's `Webhook.verify()`; secret is on the webhook's page in the Resend dashboard |
| Email webhook events | `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`, `email.opened`, `email.clicked`, `email.failed`, `email.suppressed`, `email.scheduled`, `email.received` |
| Free plan | 3,000 emails / month, **100 / day**, 3 domains |
| Pro plan | $20 / month, 50,000 emails / month, $0.90 per extra 1,000 |

⚠️ **Free tier caps at 100 emails a day.** Any list over ~100 confirmed subscribers needs Pro, or the sender must spread one issue over several days (`EMAIL_DAILY_CAP`, §7). **Chosen: daily cap on Free** (see §13).

Sources: [pricing](https://resend.com/pricing) · [batch API](https://resend.com/docs/api-reference/emails/send-batch-emails) · [event types](https://resend.com/docs/dashboard/webhooks/event-types) · [verify webhooks](https://resend.com/docs/dashboard/webhooks/verify-webhooks-requests)

---

## 4. Existing code to build on

| Path | What it gives you |
|---|---|
| `gec-web/src/components/route/SubscribeForm.tsx` | Site subscribe form. Calls `submitForm({ formType: 'newsletter', email, metadata: { source } })` from `gec-web/src/lib/api.ts`. |
| `api/src/modules/submissions/` | Receives that form today. Newsletter submissions must also create a `subscribers` row (status `pending`) and send the confirm email. |
| `api/src/modules/outbox/outbox.service.ts` | Postgres-backed outbox (`outbox_events`): `createEvent(eventType, payload)`, polling processor, retries (`max_attempts` 5), `next_attempt_at`. **Use it for every send.** |
| `api/src/modules/audit/` | Audit log. Log who scheduled/sent/cancelled each send. |
| `api/src/config/configuration.ts` | Add the env vars from §7 here. |
| `gec-web/src/lib/dispatchData.ts` | Current hardcoded issue archive (`GEC_DISPATCH_ARCHIVE`). Moves to the API as `DispatchIssue` in CMS Phase 0. |
| `docs/email-templates/dispatch-issue.html` | The email template (table layout, inline styles, 600 px, mobile stacking at ≤620 px). |

Stack: NestJS API with Postgres (`CoreDatabaseService`, raw SQL) and Mongo. Follow the existing module layout (`*.module.ts`, `*.service.ts`, controllers split into `cms-*` and `public-*`).

---

## 5. Architecture

```
Site subscribe form ──► api submissions ──► subscribers (pending) ──► confirm email ──► /email/confirm?token ──► confirmed

CMS "Send issue" (Core Admin)
   │
   ▼
email_sends row (status scheduled, scheduled_at)
   │  at scheduled_at, outbox event "email.send.plan"
   ▼
Planner: snapshot confirmed subscribers → email_messages rows (status queued), chunk into batches of ≤100
   │  one outbox event "email.send.batch" per chunk (idempotency key = `${sendId}:${batchNo}`)
   ▼
Batch worker: render template per recipient → EmailProvider.sendBatch() → store provider_message_id, status sent
   │
   ▼
Provider webhook ──► POST /webhooks/email/resend ──► EmailProvider.parseWebhook() ──► normalized events
   └─► email_events rows; update email_messages.status; bounced/complained/unsubscribed → subscribers.status
```

Rules:
- Rendering happens in GEC, per recipient (merge tags differ: `first_name`, `unsubscribe_url`).
- Every recipient row exists **before** any provider call, so a crash mid-send resumes safely: the batch worker skips rows already `sent`.
- The subscriber snapshot is taken once per send; people who subscribe during a send get the next issue.
- Only `confirmed` subscribers are ever sent issues. `pending` ones only get the confirm email.

---

## 6. The provider boundary

This is the only interface the rest of the email module talks to. It exists because switching providers is an explicit requirement.

```ts
// api/src/modules/email/providers/email-provider.ts
export interface OutgoingEmail {
  to: string;
  from: string;               // "The GEC Dispatch <dispatch@…>"
  replyTo?: string;
  subject: string;
  html: string;
  text: string;               // plain-text version, always sent
  headers: Record<string, string>; // List-Unsubscribe etc. (§8)
  tags: Record<string, string>;    // { send_id, message_id, kind: 'issue' | 'confirm' | 'test' }
}

export interface SendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;             // provider error text, stored on the message row
  retryable?: boolean;        // true for rate limits / 5xx
}

export type NormalizedEventType =
  | 'sent' | 'delivered' | 'delayed' | 'bounced' | 'complained'
  | 'opened' | 'clicked' | 'failed' | 'suppressed';

export interface NormalizedEvent {
  type: NormalizedEventType;
  providerMessageId: string;
  at: string;                 // ISO time from the provider
  bounceKind?: 'hard' | 'soft';
  url?: string;               // for clicked
  raw: unknown;               // full provider payload, stored for debugging
}

export interface EmailProvider {
  readonly name: string;      // 'resend'
  readonly maxBatch: number;  // 100 for Resend
  sendBatch(emails: OutgoingEmail[], idempotencyKey: string): Promise<SendResult[]>; // same order as input
  parseWebhook(rawBody: Buffer, headers: Record<string, string>): NormalizedEvent[]; // throws if signature invalid
}
```

`resend.provider.ts` is the only file that imports the `resend` SDK or knows Resend URLs, headers, event names or payload shapes. The provider is picked by `EMAIL_PROVIDER` in the module's factory.

### Resend event mapping

| Resend event | Normalized | Effect |
|---|---|---|
| `email.sent` | `sent` | message → sent |
| `email.delivered` | `delivered` | message → delivered |
| `email.delivery_delayed` | `delayed` | none (log only) |
| `email.bounced` | `bounced` | message → bounced; **hard** bounce → subscriber `bounced` |
| `email.complained` | `complained` | message → complained; subscriber → `unsubscribed` (reason `complaint`) |
| `email.opened` | `opened` | stats only |
| `email.clicked` | `clicked` | stats only, keep `url` |
| `email.failed` | `failed` | message → failed |
| `email.suppressed` | `suppressed` | message → suppressed; subscriber → `bounced` |
| `email.scheduled`, `email.received`, `domain.*`, `contact.*`, `suppression.*` | — | ignore (we don't use these features) |

Check the exact bounce payload shape (hard vs soft) against Resend docs when building; if Resend doesn't separate them, treat every `email.bounced` as hard.

---

## 7. Configuration

| Env var | Example | Notes |
|---|---|---|
| `EMAIL_PROVIDER` | `resend` | selects the provider class |
| `RESEND_API_KEY` | `re_…` | sending-only key, stored in the API's secrets |
| `RESEND_WEBHOOK_SECRET` | `whsec_…` | from the Resend webhook page |
| `EMAIL_FROM` | `The GEC Dispatch <dispatch@dispatch.example.edu>` | must be on the verified domain |
| `EMAIL_REPLY_TO` | `ecell@example.edu` | a human inbox |
| `EMAIL_UNSUB_SECRET` | random 32+ bytes | signs confirm/unsubscribe tokens (HMAC) |
| `EMAIL_DAILY_CAP` | `100` | max emails per UTC day; the planner spreads batches across days if the list is larger. Set to Pro limits when upgraded |
| `PUBLIC_SITE_URL` | `https://…` | for view-in-browser and issue links |
| `API_PUBLIC_URL` | `https://…` | for confirm/unsubscribe endpoints |

Provider-specific vars are prefixed with the provider name (`RESEND_*`) so a new provider adds its own (`BREVO_*`, `POSTMARK_*`, …) without renames.

---

## 8. Deliverability and compliance (required, not optional)

- **Domain:** send from a subdomain (e.g. `dispatch.<gec-domain>`) so newsletter reputation is separate from staff mail. Add the SPF, DKIM (and return-path) records Resend shows when the domain is added. Add a DMARC record (`p=none` to start, with a report address).
- **Headers on every issue email:**
  - `List-Unsubscribe: <https://API_PUBLIC_URL/email/unsubscribe?token=…>, <mailto:unsubscribe@…?subject=unsubscribe>`
  - `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
  Gmail and Yahoo require one-click unsubscribe for bulk senders.
- **Unsubscribe endpoint:** `GET` shows a confirm page; `POST` (one-click) unsubscribes immediately with no login. Tokens are HMAC-signed `subscriberId`, no expiry.
- **Double opt-in:** confirm link token expires after 7 days; unconfirmed rows are deleted after 30 days.
- **Plain-text part** always sent (generate from the issue fields, not by stripping HTML).
- **Footer** must show who sent it, why the reader gets it, a postal address, and the unsubscribe link (the template has all four).
- **Never re-add** an address that is `unsubscribed` or `bounced` without a new confirmed opt-in.

---

## 9. Data model (Postgres, provider-neutral)

```sql
CREATE TABLE subscribers (
  id               uuid PRIMARY KEY,
  email            citext UNIQUE NOT NULL,
  first_name       text,
  status           text NOT NULL CHECK (status IN ('pending','confirmed','unsubscribed','bounced')),
  source           text,                 -- e.g. 'stories-dispatch'
  confirmed_at     timestamptz,
  unsubscribed_at  timestamptz,
  unsubscribe_reason text,               -- 'link' | 'one-click' | 'complaint' | 'admin'
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE email_sends (
  id            uuid PRIMARY KEY,
  kind          text NOT NULL CHECK (kind IN ('issue','test')),
  issue_id      text NOT NULL,           -- DispatchIssue id
  subject       text NOT NULL,
  preheader     text,
  status        text NOT NULL CHECK (status IN ('draft','scheduled','sending','sent','cancelled','failed')),
  scheduled_at  timestamptz,
  created_by    text NOT NULL,           -- CMS user id
  template_version text NOT NULL,        -- git sha or hash of the template used
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE email_messages (
  id                   uuid PRIMARY KEY,
  send_id              uuid NOT NULL REFERENCES email_sends(id),
  subscriber_id        uuid REFERENCES subscribers(id),  -- null for test sends
  to_email             citext NOT NULL,
  batch_no             int NOT NULL,
  provider             text,             -- 'resend'
  provider_message_id  text,
  status               text NOT NULL,    -- queued | sent | delivered | bounced | complained | failed | suppressed
  error                text,
  sent_at              timestamptz,
  UNIQUE (send_id, subscriber_id)
);
CREATE INDEX ON email_messages (provider, provider_message_id);

CREATE TABLE email_events (
  id                   bigserial PRIMARY KEY,
  message_id           uuid REFERENCES email_messages(id),
  provider             text NOT NULL,
  provider_message_id  text NOT NULL,
  type                 text NOT NULL,    -- NormalizedEventType
  url                  text,
  occurred_at          timestamptz NOT NULL,
  raw                  jsonb NOT NULL,
  received_at          timestamptz NOT NULL DEFAULT now()
);
```

Stats per send are counts over `email_messages.status` and `email_events.type` (distinct message for opens/clicks).

---

## 10. Migrating to another provider — checklist

1. Write `providers/<name>.provider.ts` implementing `EmailProvider` (§6). Fill a mapping table like §6 for its webhook events.
2. Check its batch limit (`maxBatch`), rate limits, idempotency support (if none, rely on the `email_messages` status check before sending), and whether custom headers are allowed (required for List-Unsubscribe).
3. Add its env vars (`<NAME>_API_KEY`, `<NAME>_WEBHOOK_SECRET`); set `EMAIL_PROVIDER=<name>`.
4. Add the domain in the new provider; publish its DKIM/SPF/return-path records **alongside** the Resend ones; keep DMARC.
5. Point the new provider's webhooks at `POST /webhooks/email/<name>` (the route takes the provider name).
6. Send test sends to Gmail, Outlook and Apple Mail; check headers, unsubscribe, rendering.
7. Switch `EMAIL_PROVIDER`. Old `email_messages` keep `provider='resend'`, so late Resend webhooks still resolve — keep the Resend webhook route and secret live for ~7 days.
8. Remove Resend DNS records and keys after that window.

Nothing else changes: subscribers, template, rendering, scheduling, stats and CMS UI are provider-neutral.

---

## 11. CMS surface (for context)

In the Dispatch issue editor, an **Email** tab:
- Subject + preheader (Gemini can suggest 3 pairs, ≤50 / ≤90 chars).
- Audience: all confirmed subscribers (count shown).
- Send test (any editor, to their own address, `kind='test'`, max 5 per hour).
- Schedule / Send now (**Core Admin only**; logged in audit).
- Pre-send checks: plate has alt text, links resolve, unsubscribe present, a test was sent.
- After send: stats table and bounce/complaint list.
- Cancel is allowed while status is `scheduled`, or `sending` (stops remaining batches).

---

## 12. Template notes

File: `docs/email-templates/dispatch-issue.html` (move to `api/src/modules/email/templates/` when building).

- Table layout, inline styles, 600 px wide, stacks at ≤620 px. Fonts load from Google Fonts where the client allows, with Georgia / Arial fallbacks.
- **Masthead:** replace the blackletter text with a hosted PNG (alt "The GEC Dispatch") before launch; most inboxes won't load UnifrakturMaguntia.
- **Plate image:** absolute HTTPS URL to the halftone PNG in Media (never a data URI).
- Merge tags (fill all; escape HTML in text fields; `body_html` is pre-rendered, sanitized HTML):
  `edition, preheader, first_name, view_in_browser_url, ear_left, ear_right, issue_date, category, read_time, headline, dek, byline, plate_url, plate_alt, plate_caption, drop_cap, lead_para_rest, body_html, pull_quote, takeaway_1..3, issue_url, also_kicker, also_title, also_summary, also_url, next_event_title, next_event_date, next_event_place, next_event_url, open_call_title, open_call_line, open_call_url, postal_address, instagram_url, linkedin_url, preferences_url, unsubscribe_url`
- `first_name` falls back to "there" ("Hi there").
- Sections whose tags are empty (also / calendar / open call) should be removed by the renderer, not left blank.
- Test in Gmail (web + app), Outlook (desktop + web), Apple Mail, light and dark mode.

---

## 13. Open items

- ~~Pro plan vs daily cap~~ **Decided 2026-09-25: stay on Free with `EMAIL_DAILY_CAP=100`.** The planner spreads an issue across days (oldest-confirmed subscribers first); the CMS shows "finishes on <date>" before scheduling. Revisit Pro when the list passes ~1,000 (a 10-day rollout).
- Sending subdomain and who can edit its DNS.
- Real postal address, social URLs and sender name for the footer.
- Whether a separate confirm-email template is needed (a short one is fine; same header/footer).
