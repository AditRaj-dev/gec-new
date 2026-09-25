<!-- markdownlint-disable MD012 MD013 -->

# GEC Digital Platform Deployment Runbook

> **Status:** Target deployment runbook
> **Last updated:** 2026-09-20
> **Audience:** Engineers and platform operators
> **Architecture:** See `architecture.md`

## 1. Purpose

This runbook defines how to prepare, deploy, validate, roll back, restore, and operate the GEC public website, CMS, NestJS API, Neon PostgreSQL, MongoDB Atlas, and Cloudflare R2 resources.

The repository currently contains the public Next.js starter under `web/`; the CMS and NestJS backend are target applications that have not yet been created. The intended deployment roots are:

```text
web/    Public Next.js application
cms/    CMS Next.js application
api/    NestJS API
```

If implementation adopts different paths, update this runbook, Vercel project roots, and Render settings in the same change.

## 2. Environments and isolation

### 2.1 Environment matrix

| Concern | Local | Pull-request preview | Staging | Production |
| --- | --- | --- | --- | --- |
| Public app | `localhost` | Vercel preview | Staging branch/domain | `www.<domain>` |
| CMS app | `localhost` | Vercel preview | Staging branch/domain | `cms.<domain>` |
| API | Local process | Staging API by default | `gec-api-staging` on Render | `gec-api-production` on Render |
| Neon | Developer branch/database | Staging data only | Dedicated staging project/database | Dedicated production project/database |
| MongoDB | Developer database | Staging data only | Dedicated staging Atlas project/database | Dedicated production Atlas project/database |
| R2 public | Development bucket | Staging bucket | `gec-public-media-staging` | `gec-public-media-production` |
| R2 private | Development bucket | Staging bucket | `gec-private-submissions-staging` | `gec-private-submissions-production` |
| Secrets | Ignored local file | Preview provider scope | Staging provider scope | Production provider scope |

Pull-request previews use staging services so that every preview does not require a new database and bucket set. Preview testing must not alter production data and must use clearly marked test content. Destructive integration tests run against local or dedicated test resources, not shared staging.

### 2.2 Isolation requirements

- Production and staging use different credentials, databases, R2 buckets, Render services, and signing secrets.
- A staging service account cannot access production resources.
- Production database users have only the permissions required by the API or migration job.
- Human administrative access uses individual accounts with multi-factor authentication wherever the provider supports it.
- Never copy production private submissions into preview or staging.

## 3. Domains and traffic routing

Replace `<domain>` with the approved GEC domain before setup.

| Environment | Public app | CMS app | API | Media CDN |
| --- | --- | --- | --- | --- |
| Staging | `www-staging.<domain>` | `cms-staging.<domain>` | `api-staging.<domain>` | `media-staging.<domain>` |
| Production | `www.<domain>` | `cms.<domain>` | `api.<domain>` | `media.<domain>` |

Routing ownership:

- Vercel terminates traffic for public and CMS domains.
- Render terminates API traffic and maps the custom API domain to the appropriate web service.
- Cloudflare maps the media domains directly to the matching public R2 buckets and provides CDN caching.
- Private R2 buckets have no public domain.

Use HTTPS only. After validation, enable HSTS on application domains. Do not proxy Vercel or Render records through an additional CDN layer unless that configuration is tested and documented.

## 4. Resource inventory

Create or identify the following resources before the first deployment.

### 4.1 Vercel

- `gec-public` project rooted at `web/`.
- `gec-cms` project rooted at `cms/`.
- Production branch: `main`.
- Stable staging branch: `staging`, mapped to the staging domains.
- Preview deployments for all other pull-request branches.
- Separate Production, Preview, and Development environment-variable values.

### 4.2 Render

- `gec-api-staging` web service rooted at `api/`, tracking `staging`.
- `gec-api-production` web service rooted at `api/`, tracking `main`.
- HTTP health check path: `/health/ready`.
- Auto-deploy only after required repository checks pass.
- No persistent disk; all durable state belongs to managed data services.

Expected service commands after the API is implemented:

| Setting | Value |
| --- | --- |
| Build | `npm ci && npm run build` |
| Pre-deploy | `npm run migration:deploy` |
| Start | `npm run start:prod` |
| Health check | `/health/ready` |

The API package must pin its supported Node.js version and expose these scripts before connecting automatic deployment.

### 4.3 Neon

Use separate Neon projects for staging and production to limit blast radius. For each environment create:

- An application database and least-privilege runtime role.
- A pooled runtime connection string for `DATABASE_URL`.
- A direct connection string for `DATABASE_DIRECT_URL`, used only by migrations and controlled administrative tasks.
- Automated backup/restore capability appropriate to the required retention.
- Connection, storage, and slow-query monitoring.

Do not run normal web traffic through the direct connection string. Do not run schema migrations from multiple application instances.

### 4.4 MongoDB Atlas

Use separate Atlas projects or clusters for staging and production. For each environment create:

- A dedicated database, such as `gec_staging` or `gec_production`.
- A least-privilege database user used only by the relevant Render service.
- Network access compatible with Render's outbound connectivity without exposing administrative accounts.
- Automated backups for production and a documented restore target.
- Alerts for connection saturation, storage, replication, and backup failure.

### 4.5 Cloudflare R2

Create four shared-environment buckets:

```text
gec-public-media-staging
gec-private-submissions-staging
gec-public-media-production
gec-private-submissions-production
```

Also create isolated development buckets or an explicitly prefixed development area. Generate environment-specific S3 API credentials restricted to only the required buckets and operations.

For public buckets:

- Connect the correct custom media domain.
- Enable caching rules appropriate for immutable versioned objects.
- Disable the `r2.dev` public URL in production.
- Do not allow bucket listing.

For private buckets:

- Do not enable public access or a custom public domain.
- Permit access only through the API's scoped S3 credentials and short-lived presigned operations.

### 4.6 Mail delivery

Password-reset email requires an SMTP-compatible or transactional-mail account. Use separate staging and production credentials. Staging mail must be restricted to approved test recipients or a safe mail-capture service.

## 5. Environment variables and secrets

Real values belong in Vercel, Render, and local ignored files. Commit only an example file containing names and safe descriptions. Variables labeled **secret** must never use a `NEXT_PUBLIC_` prefix.

### 5.1 Public Next.js application

| Variable | Secret | Purpose |
| --- | --- | --- |
| `APP_ENV` | No | `development`, `preview`, `staging`, or `production` |
| `API_BASE_URL` | No | Server-side base URL for the matching API |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical public-site origin |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | No | Matching Cloudflare media origin |
| `REVALIDATION_HMAC_SECRET` | Yes | Validates API-triggered cache invalidation |

The revalidation secret is server-only. The revalidation route must not log its signature headers or request body secrets.

### 5.2 CMS Next.js application

| Variable | Secret | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | No | Environment label displayed in the CMS |
| `NEXT_PUBLIC_API_BASE_URL` | No | Matching NestJS API origin |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | No | Public media preview origin |
| `NEXT_PUBLIC_SITE_URL` | No | Link to the matching public website |

The CMS must not contain database, R2, JWT, mail, or revalidation secrets.

### 5.3 NestJS API on Render

| Variable | Secret | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime mode |
| `PORT` | No | Render-provided listening port |
| `SERVICE_VERSION` | No | Commit SHA or release identifier included in diagnostics |
| `PUBLIC_APP_URL` | No | Matching public-site origin |
| `CMS_APP_URL` | No | Matching CMS origin |
| `CORS_ORIGINS` | No | Comma-separated exact allowed origins |
| `DATABASE_URL` | Yes | Pooled Neon runtime URL |
| `DATABASE_DIRECT_URL` | Yes | Direct Neon migration URL |
| `MONGODB_URI` | Yes | Atlas connection URI |
| `MONGODB_DATABASE` | No | Environment-specific database name |
| `JWT_ACCESS_SECRET` | Yes | Access-token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh-token signing or derivation secret |
| `ACCESS_TOKEN_TTL_SECONDS` | No | Short access-token lifetime |
| `REFRESH_TOKEN_TTL_SECONDS` | No | Refresh-session lifetime |
| `PASSWORD_RESET_TTL_SECONDS` | No | Password-reset token lifetime |
| `R2_ACCOUNT_ID` | Yes | Cloudflare account identifier |
| `R2_ENDPOINT` | No | R2 S3 API endpoint |
| `R2_ACCESS_KEY_ID` | Yes | Environment-scoped R2 key ID |
| `R2_SECRET_ACCESS_KEY` | Yes | Environment-scoped R2 secret |
| `R2_PUBLIC_BUCKET` | No | Public-media bucket name |
| `R2_PRIVATE_BUCKET` | No | Private-submissions bucket name |
| `R2_PUBLIC_BASE_URL` | No | Matching media custom domain |
| `UPLOAD_URL_TTL_SECONDS` | No | Presigned upload lifetime |
| `REVALIDATION_URL` | No | Public app's server-only revalidation endpoint |
| `REVALIDATION_HMAC_SECRET` | Yes | Shared cache-invalidation signing secret |
| `OUTBOX_POLL_INTERVAL_MS` | No | Publication outbox polling interval |
| `SMTP_HOST` | No | Mail server hostname |
| `SMTP_PORT` | No | Mail server port |
| `SMTP_USER` | Yes | Mail credential user |
| `SMTP_PASSWORD` | Yes | Mail credential password |
| `MAIL_FROM` | No | Verified sender identity |
| `PASSWORD_RESET_BASE_URL` | No | Matching CMS password-reset URL |
| `LOG_LEVEL` | No | Structured logging threshold |

### 5.4 Secret rules

- Generate at least 256 bits of random material for application signing secrets.
- Use different values in every environment and for every purpose.
- Restrict who can reveal or change provider secrets.
- Rotate a secret immediately after suspected disclosure and according to the routine schedule in Section 13.
- After changing a runtime secret, redeploy or restart all consumers and verify the old credential is revoked.
- Never paste secret values into source files, tickets, screenshots, logs, or this runbook.

## 6. Cloud resource setup order

Perform initial setup in this order so every dependency exists before an application references it.

### 6.1 Databases

1. Create staging and production Neon projects.
2. Create runtime and migration roles with distinct credentials.
3. Record pooled and direct connection strings in the matching Render environment.
4. Create staging and production MongoDB Atlas projects/clusters and databases.
5. Create least-privilege Atlas users and configure network access.
6. Confirm both providers' backup configuration before loading production data.

### 6.2 Object storage and CDN

1. Create the public and private R2 buckets for staging and production.
2. Generate separate restricted S3 credentials for each environment.
3. Configure bucket CORS using exact application origins.
4. Connect `media-staging.<domain>` and `media.<domain>` to their public buckets.
5. Configure immutable-object caching behavior.
6. Disable production `r2.dev` access and confirm private buckets remain private.
7. Upload a disposable test object and verify public GET, forbidden listing, and private denial.

Example CORS intent for a public-media bucket:

```json
[
  {
    "AllowedOrigins": ["https://cms.<domain>", "https://www.<domain>"],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedHeaders": ["content-type", "x-amz-checksum-sha256"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

Create a separate staging rule with staging origins. Limit methods per bucket and actual upload flow; the private bucket must not allow anonymous reads.

### 6.3 API service

1. Create the staging Render web service from the `staging` branch and `api/` root.
2. Configure the build, pre-deploy, start, and health-check settings from Section 4.2.
3. Add staging environment variables and secrets.
4. Deploy and confirm `/health/live` and `/health/ready` before attaching the custom domain.
5. Add `api-staging.<domain>` and update staging CORS values.
6. Repeat for production from `main`, but do not enable auto-deploy until the complete production smoke test has passed once.

### 6.4 Frontend projects

1. Import `web/` into the `gec-public` Vercel project.
2. Import `cms/` into the `gec-cms` Vercel project after that application exists.
3. Configure Development, Preview, and Production variables separately.
4. Map `staging` branch deployments to stable staging domains.
5. Map production domains to `main` deployments.
6. Protect CMS previews from unauthenticated discovery when the Vercel plan supports deployment protection.
7. Verify frontend builds cannot access server-only secrets from client bundles.

### 6.5 Cache revalidation handshake

1. Generate one environment-specific `REVALIDATION_HMAC_SECRET`.
2. Store it in the public Vercel project and matching Render service.
3. Configure `REVALIDATION_URL` to the public app's server-side route.
4. Sign a canonical payload containing event UUID, resource tags/paths, timestamp, and nonce.
5. Reject invalid signatures, stale timestamps, reused nonces, unknown tags, and oversized requests.
6. Trigger a test publication and confirm the outbox event becomes delivered.

## 7. Git and delivery workflow

### 7.1 Branch behavior

| Branch/event | Required behavior |
| --- | --- |
| Feature branch push | Lint, type-check, unit tests, and build affected applications |
| Pull request | Create public and CMS Vercel previews; run API checks and contract tests without deploying production |
| Merge to `staging` | Deploy staging API and both staging frontends; run staging migrations and smoke tests |
| Promotion to `main` | Require passing checks and staging approval; deploy production using the sequence below |

Production promotion should use the exact commit already validated in staging whenever practical.

### 7.2 Required checks

- Dependency installation from the lockfile.
- Lint and formatting validation without rewriting files.
- TypeScript type-check.
- Unit and integration tests.
- Production builds for public, CMS, and API applications.
- Database migration validation against a disposable or isolated database.
- API contract and authorization-policy tests.
- Secret scanning and dependency/security checks.
- Markdown link and Mermaid validation for architectural changes.

## 8. Database migration policy

Migrations follow an expand-and-contract approach:

1. **Expand:** add nullable columns, new tables, indexes, or backward-compatible structures.
2. Deploy API code that can operate with both old and new structures.
3. Backfill data with an observable, restartable task when necessary.
4. Switch reads/writes after verification.
5. **Contract:** remove old structures in a later release after rollback is no longer needed.

Rules:

- One controlled pre-deploy process runs Neon migrations using `DATABASE_DIRECT_URL`.
- Application instances use the pooled `DATABASE_URL` only.
- MongoDB schema/index changes are versioned migration scripts and are idempotent.
- A failed migration stops deployment; it must not be ignored.
- Production rollback does not automatically reverse a migration.
- Destructive migrations require a backup check, documented recovery path, and a separate approved release.

## 9. Production deployment procedure

### 9.1 Pre-deployment

1. Confirm required checks passed on the release commit.
2. Confirm the same commit passed staging smoke tests.
3. Review migration output and verify backward compatibility with the current production API.
4. Confirm Neon and Atlas backup status and record the latest recoverable point.
5. Check Render, Vercel, Neon, Atlas, Cloudflare, and DNS status pages.
6. Check current API error rate and outbox backlog; do not begin during an unresolved incident.
7. Record release commit, operator, start time, expected migrations, and rollback owner.

### 9.2 Deploy

1. Merge or promote the approved commit to `main`.
2. Allow Render's pre-deploy command to run backward-compatible database migrations.
3. Run `npm run seed:content` in `api/` (safe to repeat: already-published content types are skipped).
4. Wait for the new API instance to pass `/health/ready`; Render must keep the previous instance serving if readiness fails.
5. Run API smoke checks against `api.<domain>`.
6. Deploy/promote the public and CMS Vercel builds from the same commit.
7. Verify both applications reference the production API and media origins.
8. Publish a designated test record or perform a safe cache-invalidation test.
9. Complete the post-deployment checklist.

### 9.3 Post-deployment verification

- [ ] `GET /health/live` returns success and expected `SERVICE_VERSION`.
- [ ] `GET /health/ready` confirms critical database connectivity without exposing credentials.
- [ ] Public homepage and all five public page groups load successfully.
- [ ] Public pages fetch only published content and never expose drafts.
- [ ] CMS login, refresh, logout, and password-reset request work.
- [ ] Each baseline role is allowed and denied the expected representative actions.
- [ ] A draft edit persists and stale-version updates receive a conflict.
- [ ] Approval and publication create the expected snapshot, audit record, and outbox event.
- [ ] Cache invalidation is accepted and published content becomes visible.
- [ ] A public asset uploads, finalizes, and loads through `media.<domain>`.
- [ ] A private attachment is inaccessible anonymously and available only through an authorized short-lived URL.
- [ ] A public form submission creates relational data and any file reference correctly.
- [ ] R2 `r2.dev` access is disabled for production public media.
- [ ] No credentials, tokens, presigned URLs, or private contents appear in logs.
- [ ] Error rate, latency, database connections, and outbox backlog remain normal for at least one observation window.

## 10. Rollback

Rollback the smallest affected component. A frontend rollback does not require an API rollback unless the contract is incompatible.

### 10.1 Vercel frontend rollback

1. Identify the last known-good deployment for the affected Vercel project.
2. Promote or roll back the production domain to that deployment.
3. Verify its API contract remains compatible with the current API and schema.
4. Purge/revalidate only tags affected by the failed release.
5. Repeat the relevant public or CMS smoke checks.

### 10.2 Render API rollback

1. Confirm the previous API build can run against the current expanded schema.
2. Roll back to the last known-good Render deployment.
3. Verify `/health/ready`, authentication, public reads, and one safe write.
4. Inspect in-flight and failed outbox events; replay only idempotent events.
5. Leave additive migrations in place. Prepare a forward-fix migration rather than automatically reversing schema changes.

### 10.3 Content rollback

Content rollback creates a new publication that points to a selected previous immutable snapshot. It does not edit or delete history. The action requires publish permission and creates a new audit record and cache-invalidation event.

### 10.4 When code rollback is unsafe

Do not roll back code if the previous release cannot understand data already written by the new release. Disable the affected feature or route, deploy a forward-compatible fix, and preserve evidence for incident review.

## 11. Backup and restore

### 11.1 Backup policy

| Resource | Staging target | Production target | Verification |
| --- | --- | --- | --- |
| Neon | At least 7 days where plan permits | At least 30 days/PITR-capable plan | Quarterly restore drill |
| MongoDB Atlas | Scheduled snapshots | Continuous or scheduled managed backups with at least 30-day policy | Quarterly restore drill |
| R2 public/private | Immutable keys plus application soft deletion | Immutable keys, soft deletion, and delayed lifecycle cleanup | Monthly deleted-object sampling and quarterly recovery exercise |
| Provider configuration | Documented/exported configuration | Documented/exported configuration | Review after every material change |

Choose provider plans that meet the production retention requirement. A configured backup is not considered valid until a restore has been tested.

### 11.2 Neon restore

1. Declare an incident and stop or restrict writes if continued writes would worsen inconsistency.
2. Identify the recovery timestamp and affected records.
3. Restore to a new branch/project where possible; do not overwrite the only recoverable copy.
4. Validate schema version, record counts, authentication state, publication registry, audit continuity, and outbox state.
5. Point a controlled API deployment at the restored database and run smoke tests.
6. Switch production only after approval, then rotate exposed credentials if compromise was involved.

### 11.3 MongoDB Atlas restore

1. Stop content publication while allowing safe read-only service where possible.
2. Restore the selected snapshot to a new cluster/database.
3. Verify document counts, indexes, draft versions, and every active Neon publication reference.
4. Run reconciliation before switching the API connection.
5. Resume publication only after public reads and CMS previews are verified.

### 11.4 R2 recovery

1. Identify the asset UUID and expected immutable key from metadata/audit records.
2. Restore or re-upload to the same key only if its content identity is proven; otherwise create a new versioned key.
3. Verify checksum, MIME type, size, and access class.
4. Reconnect the asset reference and trigger cache invalidation when public.
5. Record the recovery action in the audit trail.

### 11.5 Cross-store recovery order

When multiple stores require recovery, restore Neon first to establish authoritative publication and workflow state, then MongoDB snapshots, then R2 objects. Run reconciliation before reopening writes.

## 12. Monitoring and incident response

### 12.1 Required signals

- API availability, readiness, 5xx rate, latency, restarts, memory, and CPU.
- Login failures, refresh-token reuse, password-reset volume, and authorization denials.
- Neon connection use, query latency, storage, and migration status.
- MongoDB Atlas connection, operation latency, storage, replication, and backup health.
- R2 upload/signing/finalization errors and CDN response/cache behavior.
- Vercel build, function, revalidation, and Web Vitals failures.
- Publication duration, outbox pending/failed counts, submission errors, and reconciliation findings.

### 12.2 Incident triage

1. State the user-visible symptom and environment.
2. Capture the first known time, release version, request ID, publication UUID, or outbox event UUID.
3. Check whether the failure is frontend, API, database, storage, DNS, or provider-wide.
4. Stop unsafe writes or publishing while preserving public cached reads when possible.
5. Choose retry, component rollback, credential rotation, or data restore using the relevant section.
6. Verify recovery with the same request path that failed.
7. Record timeline, cause, impact, corrective action, and a prevention owner.

## 13. Secret rotation

Review secrets quarterly and rotate immediately after personnel changes, accidental exposure, suspicious access, or provider advice.

### 13.1 Safe rotation sequence

1. Create a new credential with equal or narrower permissions.
2. Add it to the target environment without deleting the old credential.
3. Redeploy/restart consumers and verify health and representative operations.
4. Revoke the old credential.
5. Confirm no service still attempts the old credential.
6. Record the rotation date, owner, affected environments, and next review date without recording the secret.

For token-signing keys, support an overlap window or intentionally revoke all sessions. Document which behavior is chosen before rotation.

## 14. Troubleshooting

| Symptom | Checks | Resolution |
| --- | --- | --- |
| Render deploy never becomes healthy | Confirm binding to `0.0.0.0:$PORT`, startup logs, migration result, and `/health/ready` dependencies | Fix configuration or dependency; let Render keep the previous healthy release |
| Too many Neon connections | Confirm API uses the pooled hostname, inspect per-instance pool size, and find leaked clients | Reduce pool size, fix lifecycle, restart safely, and scale only after pooling is correct |
| CMS receives a CORS error | Compare browser origin, `CORS_ORIGINS`, credentials mode, methods, and headers | Add the exact intended origin; never use credentialed wildcard CORS |
| R2 upload returns `SignatureDoesNotMatch` | Check expiry, endpoint, method, key, `Content-Type`, checksum headers, and client clock | Request a new URL and send exactly the signed headers |
| Public media works through `r2.dev` but not custom domain | Check domain activation, DNS zone/account, bucket mapping, TLS, and cache rules | Correct the R2 custom-domain configuration; do not CNAME to `r2.dev` |
| Published content remains old | Inspect publication registry, outbox event, revalidation signature, cache tag/path, and public API result | Retry the outbox event or invalidate the precise tag/path after fixing the cause |
| Draft appears publicly | Treat as a security incident; capture request ID and snapshot/publication IDs | Disable affected public route/cache, correct publication filtering, purge exposure, and audit access |
| Login loops after refresh | Inspect cookie domain/path/Secure/SameSite, CORS credentials, token-family state, and clock drift | Correct cookie/origin settings and revoke broken sessions if necessary |
| Migration failed | Read the first database error and verify schema/version/role | Fix with an idempotent forward migration; do not mark a failed migration successful manually |
| Private file is publicly reachable | Disable the bucket/domain path immediately and preserve logs | Revoke links/credentials, correct bucket policy, assess exposure, and rotate affected keys |

## 15. Routine operations

### Daily

- Review production alerts, failed deployments, readiness failures, and failed outbox events.
- Check submission and publication errors for user-visible impact.

### Weekly

- Review provider usage, database connections/storage, R2 orphan report, and error trends.
- Confirm staging still represents the production topology.

### Monthly

- Review users, roles, team scopes, stale sessions, R2 soft-deletion queue, and dependency updates.
- Sample audit records and verify a recent backup completed.

### Quarterly

- Perform Neon and MongoDB restore drills.
- Exercise content rollback, private-file recovery, secret rotation, and failed-outbox replay.
- Review architecture decision revisit triggers and provider-plan limits.

## 16. Official references

- [Cloudflare R2 documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/)
- [Cloudflare R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Cloudflare R2 public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling)
- [MongoDB Atlas backup and restore](https://www.mongodb.com/docs/atlas/backup-restore-cluster/)
- [Render web services](https://render.com/docs/web-services)
- [Render health checks](https://render.com/docs/health-checks)
- [Render deployments](https://render.com/docs/deploys)
- [Vercel deployments](https://vercel.com/docs/deployments/overview)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Next.js cache-tag revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
