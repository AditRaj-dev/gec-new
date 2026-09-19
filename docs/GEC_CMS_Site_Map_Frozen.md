# Galgotias Entrepreneurship Cell — CMS Site Map (Frozen)

**Status:** Frozen  
**Purpose:** Internal content management, data collection, stakeholder management, analytics, and access control for the GEC website.

---

# 1. CMS Purpose

The GEC CMS will serve three core purposes:

1. **Add and manage content**
2. **Collect and manage data**
3. **Edit and control website information without changing code**

The CMS should function as the internal digital control center of the Galgotias Entrepreneurship Cell.

---

# 2. CMS Information Architecture

```text
GEC CMS
│
├── DASHBOARD
│   ├── Overview
│   ├── Recent Activity
│   ├── Pending Actions
│   ├── Content Status
│   ├── Submission Summary
│   └── Quick Actions
│
├── PEOPLE
│   ├── Leadership
│   ├── Mentors
│   ├── Team Heads
│   ├── Coordinators
│   ├── Members
│   └── Alumni Members
│
├── TEAMS
│   ├── Team 01
│   │   ├── Team Overview
│   │   ├── Team Head
│   │   ├── Coordinators
│   │   ├── Members
│   │   ├── Responsibilities
│   │   ├── Social Links
│   │   ├── Gallery
│   │   └── Join Team Applications
│   │
│   ├── Team 02
│   ├── Team 03
│   ├── Team 04
│   ├── Team 05
│   ├── Team 06
│   └── Team 07
│
├── INITIATIVES
│   ├── All Initiatives
│   ├── Create Initiative
│   │
│   └── Initiative Detail
│       ├── Overview
│       ├── Content Blocks
│       ├── Timeline
│       ├── Eligibility
│       ├── Mentors / Speakers
│       ├── Gallery
│       ├── FAQs
│       ├── CTA / Application
│       ├── Submission Form
│       └── Submissions
│
├── STORIES
│   ├── News
│   ├── Founder Stories
│   ├── Startup Stories
│   ├── Event Stories
│   └── Featured Stories
│
├── STAKEHOLDERS
│   ├── Partners
│   ├── Speakers
│   ├── Startups
│   └── Alumni
│
├── MEDIA
│   ├── Media Library
│   ├── Images
│   ├── Videos
│   ├── Galleries
│   ├── Documents
│   └── Brand Assets
│
├── SUBMISSIONS
│   ├── All Submissions
│   ├── Initiative Applications
│   ├── Event Registrations
│   ├── Startup Submissions
│   ├── Founder Story Submissions
│   ├── Partnership Enquiries
│   └── Other Initiative Forms
│
├── ANALYTICS
│   ├── Website Analytics
│   ├── Content Performance
│   ├── Initiative Performance
│   ├── Submission Analytics
│   ├── Team Applications
│   └── Engagement Overview
│
├── USERS & PERMISSIONS
│   ├── Users
│   ├── Roles
│   ├── Permissions
│   ├── Access Logs
│   └── Activity Logs
│
└── SETTINGS
    ├── General Settings
    ├── Website Settings
    ├── Social Links
    ├── SEO Defaults
    ├── Contact Information
    ├── Notification Settings
    ├── Form Settings
    └── Integrations
```

---

# 3. CMS Ownership Rules

## Teams

Join E-Cell applications belong inside the **Teams** module.

Each team should be able to manage:

- Team overview
- Current head
- Coordinators
- Members
- Responsibilities
- Social links
- Team gallery
- Join Team applications

A global submission view may surface these applications, but the operational ownership remains with the relevant team.

---

## Initiatives

Each initiative can have its own independent structure and application flow.

An initiative may contain:

- Overview
- Rich content blocks
- Timeline
- Eligibility
- Mentors
- Speakers
- Gallery
- FAQs
- CTA
- Application form
- Submission records

This allows different initiatives to have different workflows without forcing all initiatives into a single rigid template.

---

## Stories

Supported story types:

- News
- Founder Stories
- Startup Stories
- Event Stories
- Featured Stories

Each story should support:

- Draft
- Review
- Published
- Archived
- Featured

---

## Stakeholders

Stakeholders are grouped into:

- Partners
- Speakers
- Startups
- Alumni

The CMS should use a shared stakeholder data system where possible while allowing each stakeholder type to have its own specific fields.

---

## Media

The Media module must behave as a reusable asset library rather than a simple upload folder.

Assets can be reused across:

- Homepage
- Teams
- Initiatives
- Stories
- Stakeholders
- Galleries

Supported media types:

- Images
- Videos
- Galleries
- Documents
- Brand assets

---

# 4. Content Status System

Recommended states:

```text
Draft
In Review
Published
Scheduled
Archived
```

For events:

```text
Upcoming
Live
Completed
Cancelled
```

For initiatives:

```text
Coming Soon
Applications Open
Ongoing
Completed
Archived
```

For startups:

```text
Active
Inactive
Alumni
```

---

# 5. User Roles

Suggested role hierarchy:

```text
Super Admin
Core Team Admin
Team Head
Content Editor
Viewer
```

Permissions should be modular.

Example:

- Super Admin — full control
- Core Team Admin — website and CMS operational control
- Team Head — own team content and applications
- Content Editor — stories, media, selected content modules
- Viewer — read-only access

---

# 6. CMS Design Principle

The CMS should not be designed as a generic CRUD panel.

It should answer:

1. What can be edited?
2. What data can be collected?
3. Who can edit what?
4. What requires approval?
5. What appears on the live website?
6. What is featured, hidden, archived, or scheduled?

---

# 7. Frozen Decision

The primary CMS navigation is frozen as:

```text
Dashboard
People
Teams
Initiatives
Stories
Stakeholders
Media
Submissions
Analytics
Users & Permissions
Settings
```

Future additions should only be introduced if a genuine operational requirement cannot fit inside the existing architecture.
