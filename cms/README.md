# GEC CMS — Digital Command Center

> **Enterprise Content Management & Operational Control System**  
> Built for the Galgotias Entrepreneurship Cell (GEC) Digital Platform.

---

## 1. Architectural Tenets & Alignment

The GEC CMS is built strictly according to:
- `docs/GEC_CMS_Site_Map_Frozen.md`
- `docs/GEC_Brand_Colour_Schema_Frozen.md`
- `docs/GEC_Dynamic_Hero_Spotlight_Frozen.md`
- `architecture.md`
- `deployment.md`
- `cms-copilot-integration.md`
- `google-forms-agent-integration.md`

### Brand Theme Tokens
- **Primary:** GEC Crimson (`#A3040F`)
- **Action:** Bright Red (`#C62F29`)
- **Main Background:** Warm Cream (`#FCF8ED`)
- **Secondary Background:** Soft Sand (`#F4E2CA`)
- **Accent 01:** GEC Gold (`#FBCA05`)
- **Accent 02:** GEC Blue (`#1F7EC0`)
- **Text:** Charcoal (`#222222`)
- **Muted:** Warm Grey (`#6E655F`)
- **Soft White:** (`#FFFDF8`)
- **Typography:** Manrope Editorial

---

## 2. 11 Frozen Modules Structure

1. **Dashboard (`/dashboard`)**:
   - System telemetry and overview metrics (Active programs, pending submissions, published stories, synced forms).
   - **Hero Spotlight Live Billboard**: P0–P2 priority gating, 8 ground-execution lifecycle states (Announcement, Applications Open, Urgency/Deadline, Live, Completed, Stories), 16:9 desktop and 9:16 mobile video posters, start/end scheduling, and live Evergreen GEC brand fallback preview.
2. **People (`/people`)**:
   - Tier 1 Leadership, Tier 2 GICRISE Mentors, Tier 3 Team Heads & Coordinators, Tier 4 Members & Alumni.
   - Add/edit modal with avatar upload via Cloudflare R2 presigned URLs (strict 3:4 portrait calibration).
3. **Teams (`/teams`)**:
   - 7 Functional Workspaces (Team 01 Startup Dev, Team 02 PR, Team 03 Marketing, Team 04 Events, Team 05 Media, Team 06 Tech, Team 07 Career Connect).
   - 6 Pillar Responsibility editor mapping to Page 03 §3.2.
   - Coordinators & Head roster, Join Team application intake pipeline.
4. **Initiatives (`/initiatives`)**:
   - Dynamic program management (SDP Cohort 04, Ideathon 2026, E-Summit 2026).
   - Status state machine (`Applications Open`, `Ongoing`, `Coming Soon`, `Completed`, `Archived`).
   - 4-Stage Progression Stepper builder, eligibility checklists, FAQs, and application form CTA.
5. **Stories (`/stories`)**:
   - Categories: News, Founder Stories, Startup Case Studies, Event Recaps.
   - Editorial statuses: Draft, In Review, Published, Scheduled, Archived.
   - Pull quote generator for magazine spreads and Homepage Bento Slot 1 pinning.
6. **Stakeholders (`/stakeholders`)**:
   - Startups portfolio (Sector, Stage, Cohort, Founders, URLs).
   - Ecosystem partner SVG logos and keynote speaker portraits.
   - Alumni network directory.
7. **Media (`/media`)**:
   - Reusable asset library (Images, Videos, Brand Assets, Documents).
   - Direct Cloudflare R2 Presigned Upload component (three-phase signing: `/v1/uploads/presign`, direct PUT, `/v1/uploads/complete`).
   - Aspect ratio calibration (16:9, 4:3, 1:1, 3:4, 9:16) and live reference protection rules.
8. **Submissions (`/submissions`)**:
   - Central intake inbox for all public forms with status transitions (New, Reviewed, Shortlisted, Interview, Rejected).
   - Evaluation notes and one-click filtered CSV export.
9. **Google Forms & AI Copilot (`/forms`)**:
   - Managed Google Forms with lifecycle states (`proposed`, `needs_manual_upload_setup`, `ready_for_review`, `published`, `closed`).
   - Manual file-upload verification checkpoint banner with direct Google Forms editor link and verify trigger.
   - On-demand response synchronization and filterable response data grid.
   - Manual Google Sheet export modal.
   - Gemini Copilot slide-over drawer with streaming answers and 1-click Action Proposal Cards with diff views.
10. **Analytics (`/analytics`)**:
    - Telemetry pageviews, unique visitors, session length, and bounce rate.
    - Page traffic distribution across Page 01 to Page 05.
    - Team recruitment demand metrics.
11. **Settings & RBAC (`/settings`)**:
    - Live Header Announcement Ticker toggle.
    - Impact Counter manual overrides (Startups, Events, Footfall, Funding in Lakhs).
    - Instant CDN cache purge button with 5-second propagation.
    - Role-based access control (Super Admin, Core Admin, Team Head, Content Editor, Viewer) and immutable audit log viewer.

---

## 3. Environment Configuration (`.env.example`)

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_MEDIA_BASE_URL=https://media-staging.gec.in
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4. Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile production build
npm run build
```
