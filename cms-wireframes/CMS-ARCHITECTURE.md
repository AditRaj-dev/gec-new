# GEC Digital Platform — CMS Architecture & Website Sync Specification

> **Document Status:** Frozen Architecture & Engineering Specification  
> **Target System:** Galgotias Entrepreneurship Cell (GEC) Content Management System  
> **Source Base:** `docs/GEC_CMS_Site_Map_Frozen.md`, `docs/GEC_Website_Site_Map_Frozen.md`, `docs/GEC_Brand_Colour_Schema_Frozen.md`  
> **Design Doctrine:** Taste-Design × Impeccable × Operational Ergonomics  
> **Key Objective:** Provide complete operational clarity on what content is editable, how public website pages get updated in real time, what data is collected, and who owns each lifecycle state.

---

## 1. Executive Summary & CMS Purpose

The GEC Content Management System is the internal digital command center for student leaders, faculty coordinators, and media heads of the Galgotias Entrepreneurship Cell. It is engineered with three non-negotiable operational tenets:

1. **Autonomous Content Operation:** Empower student teams to add and update events, announcements, team rosters, and initiative timelines without developer intervention or code deployment.
2. **Centralized Data & Submissions Hub:** Act as the single source of truth for student startup pitches, initiative cohort applications, team recruitment forms, and partner inquiries.
3. **Strict Live Website Synchronization:** Every CMS input maps directly to a discrete component across the 5 public website pages, guaranteeing brand consistency, layout protection, and immediate content propagation.

---

## 2. Website-to-CMS Bidirectional Impact Mapping Matrix

This matrix establishes the direct, real-time relationship between what is edited inside the CMS and what gets rendered on the public GEC website.

| Public Website Page & Section | Corresponding CMS Module & Route | Data Fields Controlled | Update Frequency | Ownership & Approval |
|:---|:---|:---|:---|:---|
| **P1 Home: 1.1 Hero Eyebrow & Banner** | `Settings > Announcements` | Eyebrow kicker, Announcement text, External Link, Active status | Weekly / As needed | Core Admin / Super Admin |
| **P1 Home: 1.2 Bento Grid (4 Items)** | `Stories > Featured` & `Initiatives` | Item Type, Title, Tag, Media asset, Link, Order rank (1–4) | Bi-weekly | Content Editor (Requires Admin approval) |
| **P1 Home: 1.3 Key Initiatives (3 Cards)** | `Initiatives > Featured Toggle` | Selected 3 initiatives, Status badge, One-sentence summary | Monthly | Core Admin |
| **P1 Home: 1.4 Impact Counters** | `Settings > Impact Metrics` | 4 Counter digits (Startups, Events, Footfall, Funding) | Monthly / Per semester | Super Admin |
| **P1 Home: 1.5 Speaker Spotlight** | `Stakeholders > Speakers` | "Featured on Home" toggle, Speaker portrait, Designation | Event-driven | Team 02 (PR) / Core Admin |
| **P1 Home: 1.6 Community Stories** | `Stories > Featured Stories` | Top 2 story IDs, Hero image, Founder quote, Read time | Bi-weekly | Content Editor |
| **P1 Home: 1.7 Ecosystem Logos** | `Stakeholders > Partners` | "Show on Home" toggle, Partner SVG logo, Category | Per semester | Team 02 (PR) / Core Admin |
| **P1 Home: 1.8 Newsletter & 1.9 CTA** | `Submissions > Inquiries` & `Settings` | Form target URL, Success message, CTA button label & link | Static / Quarterly | Core Admin |
| **P2 About: 2.1 Manifesto & 2.2 Story** | `Settings > About Page Content` | Editorial manifesto paragraphs, Incubation matrix diagram | Rare / Annual | Super Admin |
| **P2 About: 2.3 & 2.4 Mission & Vision** | `Settings > Core Directives` | Mission text, Vision text, Pillar bullets | Rare / Annual | Super Admin |
| **P2 About: 2.5 Leadership (Tier 1 & 2)** | `People > Leadership & Mentors` | Office-bearer names, Roles, Photos (3:4), LinkedIn, Mentors | Annual (Session change) | Super Admin |
| **P2 About: 2.6 Milestones Timeline** | `Settings > Legacy Timeline` | Year, Milestone title, Description, Active display | Annual | Core Admin |
| **P3 Teams: 3.1 & 3.2 7 Teams Roster** | `Teams > [Team 01 to 07] > Overview` | Team Name, Color badge, Tagline, Overview paragraph | Per semester | Relevant Team Head |
| **P3 Teams: 3.2 Responsibilities** | `Teams > [Team 01 to 07] > Pillars` | 6 Focus area tags per team (Title, Scope) | Per semester | Relevant Team Head |
| **P3 Teams: 3.3 Detail Canvas: Roster** | `Teams > [Team 01 to 07] > Members` | Current Head (Photo, Bio), Coordinators (4), Members (8) | Per semester | Relevant Team Head |
| **P3 Teams: 3.3 Detail: Join CTA** | `Teams > [Team 01 to 07] > Applications`| Recruitment status (Open/Closed), Application form, Deadline | Recruitment season | Team Head & Core Admin |
| **P4 Initiatives: 4.1 Filter Strip** | `Initiatives > Categories` | Status pills (Applications Open, Ongoing, Upcoming) | Real-time | Auto-derived from status |
| **P4 Initiatives: 4.2 Initiative Cards** | `Initiatives > All Initiatives` | Card photo (16:9), Title, Status, Cohort ID, Excerpt | Weekly | Core Admin |
| **P4 Initiatives: 4.3 Detail Stepper** | `Initiatives > [ID] > Timeline` | 4 Progression stages (Title, Target dates, Description) | Per cohort | Relevant Initiative Lead |
| **P4 Initiatives: 4.3 Detail FAQs** | `Initiatives > [ID] > FAQs` | Question & Answer pairs, Display order | Per cohort | Content Editor |
| **P4 Initiatives: 4.3 Application Form** | `Initiatives > [ID] > Form Builder` | Custom fields (Pitch deck, Team size, Problem statement) | Per cohort | Core Admin |
| **P5 Stories: 5.1 Filters & 5.2 Lead** | `Stories > Featured Lead` | Lead story pin, Cover photo, Author, Category, Body | Weekly | Content Editor / Admin |
| **P5 Stories: 5.3 Magazine Spread** | `Stories > Founder Profiles` | 2 Featured founder cards, Pull quotes, Founder 1:1 image | Bi-weekly | Content Editor |
| **P5 Stories: 5.4 Startup Portfolio** | `Stakeholders > Startups` | Startup Name, Logo, Founder, Sector, Stage, Live URL | Rolling / Continuous | Team 01 (Startup Dev) |
| **Global: Navigation & Footer** | `Settings > Navigation & Footer` | Nav links, Social handles, Contact email, Copyright note | Rare | Super Admin |

---

## 3. Information Architecture (Frozen 11 Primary Modules)

As specified in `docs/GEC_CMS_Site_Map_Frozen.md`, the CMS is organized into 11 strictly scoped modules:

```text
GEC CMS ARCHITECTURE
├── 01. DASHBOARD            -> Live health, pending approvals, submission triage, quick actions
├── 02. PEOPLE               -> Leadership (Tier 1), Mentors (Tier 2), Heads, Coordinators, Members, Alumni
├── 03. TEAMS                -> 7 Functional Teams (Overview, Heads, 6 Pillars, Gallery, Recruitment)
├── 04. INITIATIVES          -> SDP, Pitching, Workshops, E-Summit (Status, Stepper, FAQs, Forms)
├── 05. STORIES              -> News, Founder Stories, Startup Profiles, Event Recaps, Featured Pins
├── 06. STAKEHOLDERS         -> Partners (Logos), Speakers (Portraits), Startups (Portfolio), Alumni
├── 07. MEDIA                -> Central Asset Library (SVGs, 16:9, 4:3, 1:1, 3:4, Docs, Brand Kit)
├── 08. SUBMISSIONS          -> Application Inbox (Initiative forms, Join Team applications, Pitches)
├── 09. ANALYTICS            -> Page views, conversion rates, submission trends, team recruitment stats
├── 10. USERS & PERMISSIONS  -> Role-Based Access Control (RBAC), Activity Logs, Audit trail
└── 11. SETTINGS             -> Site variables, Announcement ticker, Impact counters, Cache purge
```

---

## 4. Detailed Module Functionality & Operational Rules

### 4.1 Module 01: Dashboard
- **System Health Monitor:** Displays Live Website Status (`HEALTHY · 99.98% UP`), CDN cache status, and Last Content Sync timestamp.
- **Pending Approvals Queue:** Surfaces pending story drafts, proposed initiative changes, and team head edits requiring Core Admin sign-off.
- **Submission Quick-Triage:** Displays unread counts for Initiative Applications, Join Team applications, and Founder Story submissions.
- **Quick Action Bar:** One-click shortcuts for: *+ New Initiative*, *+ Publish Story*, *+ Add Startup to Portfolio*, *+ Add Team Member*, *+ Purge Website Cache*.

### 4.2 Module 02: People & Roster
- **Hierarchy Tiers:**
  - *Tier 1: Core Office-Bearers* (President, Vice President, General Secretary, Treasurer).
  - *Tier 2: GICRISE Ecosystem Mentors* (Incubation Director, Technical Advisors, Industry Mentors).
  - *Tier 3: Team Heads & Coordinators* (Direct operational link to Module 03).
  - *Tier 4: General Student Members & Alumni Network*.
- **Standardized Field Schema:** Full Name, Designation, Department/Branch, Graduation Year, Profile Portrait (strict 3:4 aspect ratio enforcement), LinkedIn URL, Twitter/GitHub URL, Active Status Toggle.

### 4.3 Module 03: Teams (Operational Ownership)
- **7 Autonomous Sub-Workspaces:**
  1. *Team 01: Startup Development* (Gold Theme `#FBCA05`)
  2. *Team 02: PR & Networking* (Crimson Theme `#A3040F`)
  3. *Team 03: Marketing & Campus Ambassador* (Orange Theme `#F97316`)
  4. *Team 04: Event Management* (Burgundy Theme `#7F1D1D`)
  5. *Team 05: Digital Media* (Charcoal Theme `#334155`)
  6. *Team 06: Technical* (Blue Theme `#1F7EC0`)
  7. *Team 07: Internship & Career Connect* (Bronze Theme `#854D0E`)
- **Per-Team Capabilities:**
  - Edit Team Mission and Overview text.
  - Define the **6 Pillar Responsibility Areas** displayed on Page 03 §3.2.
  - Assign Current Team Head, up to 4 Coordinators, and active members.
  - Manage **Join Team Applications**: Open/Close recruitment status toggle, custom questionnaire fields, applicant review pipeline (Pending -> Interview -> Shortlisted -> Rejected).

### 4.4 Module 04: Initiatives Studio
- **Dynamic Program Management:** Supports flagship programs (Startup Development Program, Pitching Sessions, Bootcamps, E-Summit, Design Sprint).
- **Status Machine:**
  - `Applications Open` (Green pill, primary CTA active, application form accepting responses).
  - `Ongoing` (Blue pill, highlights active cohort milestones).
  - `Upcoming / Coming Soon` (Gold pill, pre-registration or notify-me state).
  - `Completed / Archived` (Muted pill, serves as legacy documentation).
- **Detail Canvas Configurator:**
  - **4-Stage Stepper Builder:** Configure stages 01 through 04 with milestone names, date spans, and criteria.
  - **Eligibility Checklist:** Add checkmark requirement bullets.
  - **FAQ Builder:** Add question/answer accordions with drag-and-drop ordering.
  - **Integrated Form Builder:** Configure custom submission fields (Pitch deck upload, Founder details, Equity requirements).

### 4.5 Module 05: Stories & News
- **Editorial Categorization:** News & Announcements, Founder In-Depth Stories, Startup Case Studies, Event Recaps.
- **Publishing Lifecycle:** `Draft` -> `In Review` (submitted by Content Editor) -> `Approved` -> `Published` -> `Archived`.
- **Homepage Placement Controls:**
  - `Pin to Homepage Hero (Bento Slot 1)` toggle.
  - `Pin to Magazine Spread Lead (Page 05 §5.2)` toggle.
  - Pull Quote generator for editorial cards (Page 05 §5.3).

### 4.6 Module 06: Stakeholders & Startup Directory
- **Startups (Page 05 §5.4):**
  - Name, Logo container (1:1), One-sentence pitch (max 120 chars), Founders list, Cohort year, Sector category (Tech, Consumer, Health, Climate, SaaS, EdTech), Incubation Stage (`Seed`, `Bootstrapped`, `Incubated`, `Idea Lab`), Live Website URL.
- **Partners (Page 01 §1.7):**
  - Company/Brand Name, SVG Vector Logo, Partnership Category (Incubation, Media, Cloud, Funding), Website URL.
- **Guest Speakers (Page 01 §1.5):**
  - Name, High-res portrait (1:1), Designation/Company, Event associated with, Social links.

### 4.7 Module 07: Reusable Media Library
- **Asset Categories:** Images, Brand SVGs, Event Video Embeds, Documents/PDFs.
- **Aspect Ratio Calibration:** Direct validation indicators:
  - `16:9` (Initiative covers, Story heroes)
  - `4:3` (Technical diagrams, About story)
  - `1:1` (Startup logos, Speaker portraits, Founder thumbs)
  - `3:4` (Leadership & mentor formal portraits)
- **Usage Tracker:** Every uploaded asset displays active reference count (e.g. *"Used in: Page 01 Hero, SDP Cohort 04"*). Prevents accidental deletion of live website assets.

### 4.8 Module 08: Submissions Central Inbox
- **Consolidated Intake Pipeline:** Gathers records across all public forms:
  - Initiative Applications (Cohort applicants, pitch decks).
  - Join E-Cell Team Applications (Filtered per team).
  - Founder Story Pitches & Guest Speaker Suggestions.
  - General Contact & Partner Inquiries.
- **Operational Features:**
  - Filter by Form Type, Date, Team, Status (`New`, `Reviewed`, `Shortlisted`, `Archived`).
  - Single-click CSV / Excel export for offline committee reviews.
  - Status progression triggers automated confirmation emails.

### 4.9 Module 09: Analytics & Performance
- **Live Traffic Telemetry:** Unique visitors, pageview distribution across the 5 public pages.
- **Initiative Funnel Conversion:** Views -> Application Form Clicks -> Completed Submissions.
- **Team Recruitment Analytics:** Application counts per team to measure student demand.

### 4.10 Module 10: Users, RBAC & Activity Audit
- **Role Hierarchy:**
  1. `Super Admin` (Full system configuration, settings, database, user creation).
  2. `Core Team Admin` (Full content edit rights, approval rights, live sync, submissions access).
  3. `Team Head` (Restricted to their specific Team workspace and its Join Team applications).
  4. `Content Editor` (Stories, Media, FAQs, Drafts creation; cannot publish to live without approval).
  5. `Viewer` (Read-only access for internal auditing).
- **Immutable Audit Trail:** Logs every modification with timestamp, user ID, module, and diff summary.

### 4.11 Module 11: Settings & Global Website Sync
- **Live Banner Ticker:** Toggle active announcement banner above the public website header.
- **Impact Counter Manual Override:** Instant updates to public numbers on Page 01 §1.4.
- **SEO & Social Meta:** Global OpenGraph titles, preview cards, meta descriptions.
- **Instant Cache Purge:** One-click invalidation button that refreshes the CDN cache across all 5 public pages within 5 seconds.

---

## 5. Visual Wireframe Layout Specification

The CMS layout application follows a strict industrial-grade desktop architecture with mobile supervisor capabilities:

- **Left Navigation Drawer (260px fixed width):**
  - Brand header with GEC emblem and CMS environment badge (`PROD · v2.4`).
  - Module navigation list with clean SVG iconography, active indicator pill, and unread count badges.
  - Current user avatar, active role pill, and logout affordance.
- **Top Utility Control Bar (64px height):**
  - Breadcrumbs tracking active module path (e.g., `GEC CMS > TEAMS > 01. STARTUP DEVELOPMENT`).
  - Real-time **Role Switcher** (Super Admin vs Team Head vs Editor) to preview contextual permissions.
  - Global Search with shortcut trigger (`Ctrl + K`).
  - **Live Website Sync Status Indicator** (`SYNCED · 100% OK`).
  - **"View Live Website" External Trigger** with split-screen quick preview.
- **Operational Content Canvas (Responsive Flex):**
  - Section Header: Title, Module purpose label, Primary Action CTA (`+ Create New`).
  - **Live Website Target Ribbon:** Prominent visual bar showing exactly which public website section is impacted by changes in this view (e.g., `LIVE IMPACT: Updates Page 03 §3.2 and §3.3`).
  - High-density data tables, form layouts, status badges, and tabbed sub-controllers.
- **Mobile Responsive Drawer Collapse:** On viewports `<= 768px`, the sidebar smoothly collapses into a slide-over off-canvas drawer with a 48px hamburger toggle, ensuring student leads can manage applications and publish urgent alerts directly from smartphones.
