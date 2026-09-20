-- Core Neon PostgreSQL Schema
-- Reference: architecture.md Sections 5.1 & 7.3 & 9.1 & 9.2

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Super Admin, Core Team Admin, Team Head, Content Editor, Viewer
    team_scope VARCHAR(50),     -- e.g. team_01, team_02 ...
    is_active BOOLEAN NOT NULL DEFAULT true,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Rotating Refresh Sessions
CREATE TABLE IF NOT EXISTS refresh_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    family_id UUID NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_refresh_sessions_user ON refresh_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_token_hash ON refresh_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_family ON refresh_sessions(family_id);

-- 3. Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token_hash ON password_resets(token_hash);

-- 4. Publication Registry
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL, -- people, teams, initiatives, stories, stakeholders, hero, settings, pages
    entity_id UUID NOT NULL,
    slug VARCHAR(255),
    version INT NOT NULL,
    mongo_snapshot_id UUID NOT NULL,
    workflow_state VARCHAR(50) NOT NULL DEFAULT 'published', -- draft, in_review, published, scheduled, archived
    published_by UUID REFERENCES users(id),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unbound_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_publications_entity ON publications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(entity_type, slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_publications_active ON publications(is_active);

-- 5. Content Workflow State
CREATE TABLE IF NOT EXISTS content_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL UNIQUE,
    current_version INT NOT NULL DEFAULT 1,
    workflow_state VARCHAR(50) NOT NULL DEFAULT 'draft',
    last_edited_by UUID REFERENCES users(id),
    scheduled_publish_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_workflows_entity ON content_workflows(entity_type, entity_id);

-- 6. Submissions
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_type VARCHAR(50) NOT NULL, -- initiative_application, recruitment, pitch, contact
    target_entity_id UUID,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- submitted, in_review, shortlisted, rejected, accepted
    payload JSONB NOT NULL DEFAULT '{}',
    attachment_keys JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    request_id VARCHAR(100),
    ip_address VARCHAR(45),
    details JSONB NOT NULL DEFAULT '{}',
    content_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 8. Transactional Outbox
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- cache_invalidation, publication_event, notification
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, delivered, failed
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_error TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbox_events_status_next ON outbox_events(status, next_attempt_at) WHERE status IN ('pending', 'processing');

-- 9. Copilot Conversations & Proposals (7-day lifecycle)
CREATE TABLE IF NOT EXISTS copilot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_copilot_conversations_actor ON copilot_conversations(actor_id);
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_expires ON copilot_conversations(expires_at);

CREATE TABLE IF NOT EXISTS copilot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_messages_convo ON copilot_messages(conversation_id);

CREATE TABLE IF NOT EXISTS copilot_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255),
    target_version VARCHAR(50),
    input JSONB NOT NULL,
    preview JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'proposed', -- proposed, confirmed, executing, succeeded, failed, expired, superseded
    token_hash VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_proposals_convo ON copilot_proposals(conversation_id);
CREATE INDEX IF NOT EXISTS idx_copilot_proposals_token ON copilot_proposals(token_hash);
CREATE INDEX IF NOT EXISTS idx_copilot_proposals_idempotency ON copilot_proposals(idempotency_key);

-- 10. Media Assets (Cloudflare R2 metadata)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_class VARCHAR(50) NOT NULL, -- public, private
    r2_key VARCHAR(500) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    byte_size BIGINT NOT NULL,
    original_filename VARCHAR(255),
    public_url VARCHAR(500),
    purpose VARCHAR(100),
    uploader_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'finalized', -- pending_upload, finalized, deleted
    reference_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_key ON media_assets(r2_key);
CREATE INDEX IF NOT EXISTS idx_media_assets_bucket ON media_assets(bucket_class);
