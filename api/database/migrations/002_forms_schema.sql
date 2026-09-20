-- Forms Neon PostgreSQL Schema
-- Reference: google-forms-agent-integration.md Section 9

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Google Forms Registry
CREATE TABLE IF NOT EXISTS google_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    owner_account VARCHAR(255) NOT NULL,
    edit_url TEXT NOT NULL,
    responder_url TEXT,
    lifecycle_state VARCHAR(50) NOT NULL DEFAULT 'unpublished', -- proposed, unpublished, needs_manual_upload_setup, ready_for_review, published, closed, failed, external_missing
    revision_id VARCHAR(255) NOT NULL,
    plan_version INT NOT NULL DEFAULT 1,
    manual_steps_verified_at TIMESTAMPTZ,
    configured_spreadsheet_id VARCHAR(255),
    configured_sheet_tab VARCHAR(255),
    last_response_sync_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_forms_gid ON google_forms(google_form_id);
CREATE INDEX IF NOT EXISTS idx_google_forms_lifecycle ON google_forms(lifecycle_state);

-- 2. Google Form Revisions
CREATE TABLE IF NOT EXISTS google_form_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    revision_id VARCHAR(255) NOT NULL,
    snapshot JSONB NOT NULL,
    managed_item_map JSONB NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_form_revisions_form ON google_form_revisions(google_form_id);

-- 3. Google Form Plans
CREATE TABLE IF NOT EXISTS google_form_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'proposed', -- proposed, accepted, executed, rejected, expired
    actor_id UUID NOT NULL,
    token_hash VARCHAR(64),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Manual Requirements
CREATE TABLE IF NOT EXISTS manual_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    item_key VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    observed_google_item_id VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manual_requirements_form ON manual_requirements(google_form_id);

-- 5. Response Sync Runs
CREATE TABLE IF NOT EXISTS response_sync_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    synced_count INT NOT NULL DEFAULT 0,
    cursor VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    request_id VARCHAR(100),
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_response_sync_runs_form ON response_sync_runs(google_form_id);

-- 6. Cached Responses
CREATE TABLE IF NOT EXISTS response_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    google_response_id VARCHAR(255) NOT NULL,
    form_revision_id VARCHAR(255) NOT NULL,
    answers JSONB NOT NULL,
    source_hash VARCHAR(64) NOT NULL,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_available BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT uq_google_form_response UNIQUE (google_form_id, google_response_id)
);

CREATE INDEX IF NOT EXISTS idx_response_cache_form ON response_cache(google_form_id);
CREATE INDEX IF NOT EXISTS idx_response_cache_submitted ON response_cache(submitted_at DESC);

-- 7. Sheet Mappings
CREATE TABLE IF NOT EXISTS sheet_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    spreadsheet_id VARCHAR(255) NOT NULL,
    tab_name VARCHAR(255) NOT NULL,
    column_map JSONB NOT NULL,
    configured_revision VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Sheet Exports (Idempotency Record)
CREATE TABLE IF NOT EXISTS sheet_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_form_id VARCHAR(255) NOT NULL,
    google_response_id VARCHAR(255) NOT NULL,
    spreadsheet_id VARCHAR(255) NOT NULL,
    tab_name VARCHAR(255) NOT NULL,
    row_number INT,
    status VARCHAR(50) NOT NULL,
    attempts INT NOT NULL DEFAULT 1,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sheet_export UNIQUE (google_form_id, google_response_id, spreadsheet_id, tab_name)
);

-- 9. Google Action Log
CREATE TABLE IF NOT EXISTS google_action_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(100) NOT NULL,
    actor_id UUID,
    idempotency_key VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    request_metadata JSONB,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_action_log_idempotency ON google_action_log(idempotency_key);
