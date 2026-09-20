# Galgotias Entrepreneurship Cell — Dynamic Hero Spotlight System

**Status:** Frozen  
**Purpose:** Define the homepage hero as a dynamic, campaign-driven spotlight that reflects the most important current GEC activity, announcement, initiative, event, or achievement.

---

# 1. Core Principle

The homepage hero should not remain a permanently static branding section.

Its primary role is to communicate:

- What is the most important thing happening in GEC right now?
- Why should visitors care?
- What action should they take?

The hero should behave like a **live editorial billboard** connected to GEC's actual ground execution.

When a major initiative, event, announcement, or achievement is active, the hero should promote it using a custom campaign visual.

When no top-tier update is active, the hero should return to an evergreen GEC brand state.

---

# 2. Hero Naming

Internal CMS name:

## Hero Spotlight

Public-facing naming is not required.

---

# 3. Hero Content Priority

Only high-priority content should be allowed to occupy the hero.

```text
P0 — Critical / Institution-level announcement
P1 — Flagship GEC initiative
P2 — Major event / major application window
P3 — Major achievement / speaker / startup milestone
P4 — General announcement
P5 — Regular content
```

Normally, only **P0–P2** should control the primary hero.

P3–P5 items should usually appear inside the **What's Happening** section.

---

# 4. Hero Architecture

```text
HERO / LIVE SPOTLIGHT
│
├── Status / Category
├── Main Visual
│   ├── Animated Video Poster
│   ├── Static Poster
│   └── Photography
│
├── Headline
├── Short Context
├── Date / Deadline / Status
├── Primary CTA
├── Optional Secondary CTA
└── Supporting GEC Identity
```

---

# 5. Example Hero

```text
APPLICATIONS OPEN

STARTUP DEVELOPMENT
PROGRAM 2026

Have an idea?
Let's see how far you can take it.

Applications close 28 September.

[ Apply Now ]    [ Explore Program ]
```

The visual beside or behind the content may use a custom animated campaign poster.

---

# 6. Dynamic Ground-Execution Lifecycle

The same initiative can evolve through multiple hero states as its execution progresses.

```text
Announcement
     ↓
Applications Open
     ↓
Registrations Growing
     ↓
Event Upcoming
     ↓
Event Live
     ↓
Event Completed
     ↓
Results / Highlights
     ↓
Founder / Winner Story
```

This means the website reflects the actual lifecycle of GEC activities.

---

# 7. Example Initiative Lifecycle

## Pre-Launch

```text
SOMETHING IS COMING.
```

## Launch

```text
IDEATHON 2026

Applications are now open.
```

## Deadline Phase

```text
48 HOURS LEFT.

Applications close soon.
```

Use urgency only when factually accurate.

## Event Day

```text
IDEATHON IS LIVE.
```

## Post-Event

```text
800 Ideas.
40 Finalists.
One Incredible Day.
```

Only use verified numbers.

## Archive

After the campaign ends, content may move from the hero into:

- Spotlight
- Stories
- Events
- Legacy
- Initiative archive

---

# 8. Hero Rotation Rules

The hero should **not** behave like a conventional auto-rotating university banner carousel.

Recommended structure:

```text
1 Primary Hero
+
Up to 2 Secondary Spotlight Items
```

Suggested visual priority:

```text
Primary Hero → 70–80% attention
Secondary Items → 20–30% attention
```

Secondary items may appear as manual selectors such as:

```text
01 / STARTUP PROGRAM
02 / FOUNDERS MEET
03 / E-CELL RECRUITMENT
```

Do not automatically switch the hero while the user is reading.

---

# 9. Animated Video Poster System

For top-tier campaigns, the creative team should produce a custom visual package.

```text
1 Campaign Key Visual
1 Desktop Animated Version
1 Mobile Animated Version
1 Desktop Static Poster
1 Mobile Static Poster
```

Recommended video guidance:

```text
Duration:       6–15 seconds
Loop:           Seamless
Audio:          Off by default
Desktop Ratio:  Approx. 16:9 / adaptive
Mobile Ratio:   Approx. 9:16
Formats:        WebM + MP4 fallback
```

---

# 10. Important Video Rule

Essential information must not exist only inside the video.

The following should remain actual webpage content:

- Headline
- Description
- Deadline
- Status
- CTA
- Accessibility text

This improves accessibility, responsiveness, SEO, load performance, and content updates.

---

# 11. Campaign Ecosystem

The same campaign identity should be reused across all GEC communication channels.

```text
INITIATIVE / EVENT
│
├── Campaign Identity
│
├── Instagram
│   ├── Reel
│   ├── Post
│   └── Story
│
├── Website
│   ├── Hero Animation
│   ├── Hero Poster
│   └── Initiative Page
│
├── Campus
│   ├── Poster
│   └── Screen
│
└── After Event
    ├── Recap
    ├── Gallery
    └── Story
```

---

# 12. CMS Integration

Add the following under CMS Dashboard:

```text
Dashboard
└── Hero Spotlight
```

Hero Spotlight fields:

```text
Campaign
Status
Priority
Headline
Supporting Text
Eyebrow / Badge
Desktop Video
Mobile Video
Desktop Poster
Mobile Poster
Primary CTA
Secondary CTA
Start Date & Time
End Date & Time
Publish Status
Fallback Behaviour
```

---

# 13. Initiative Linking

Hero content should reuse existing CMS data wherever possible.

Example:

```text
Source:
Initiative → Startup Development Program
```

The hero may automatically pull:

- Initiative title
- Initiative URL
- Status
- Application state
- Relevant dates

The editor should only need to define hero-specific creative treatment where necessary.

---

# 14. Scheduling

Each hero campaign should support automatic scheduling.

```text
Publish:
20 Sep · 10:00 AM

Expire:
28 Sep · 11:59 PM
```

At expiry:

- Hero campaign is automatically removed
- Next eligible campaign may replace it
- Evergreen fallback appears if nothing else qualifies

---

# 15. Fallback Behaviour

```text
TOP-TIER UPDATE EXISTS
        ↓
Dynamic Hero Spotlight
```

```text
NO TOP-TIER UPDATE
        ↓
Evergreen GEC Brand Hero
```

Recommended evergreen hero:

# Ideas Begin Here.  
# Builders Grow Here.

**Supporting Line**

Innovate. Inspire. Impact.

---

# 16. Mobile Behaviour

Mobile should not simply shrink the desktop hero.

Recommended mobile structure:

```text
[ STATUS ]

HEADLINE
HEADLINE

[VERTICAL
 ANIMATED
 POSTER]

Short Description

[ PRIMARY CTA ]

[ OPTIONAL SECONDARY CTA ]
```

Desktop and mobile should support separate creative assets.

---

# 17. Homepage Relationship

```text
HOME
│
├── Dynamic Hero Spotlight
│   ├── Top-Tier Announcement
│   ├── Initiative Campaign
│   ├── Major Event
│   ├── Major Achievement
│   └── Evergreen GEC Fallback
│
├── What's Happening
├── Initiatives
├── Impact
├── Spotlight
├── Stories
├── Speakers
├── Partners
└── CTA
```

---

# 18. Hero vs What's Happening

## Hero Spotlight

Surface the single most important current campaign or update.

## What's Happening

Show multiple current activities, announcements, events, opportunities, and stories.

```text
Hero Spotlight = Highest Priority
What's Happening = Current Activity Feed
```

---

# 19. Frozen Hero Rules

1. One primary campaign at a time.
2. Only top-tier updates qualify for the primary hero.
3. Major campaigns may use custom animated visual assets.
4. Essential text and CTAs must remain outside the video.
5. Desktop and mobile assets are managed separately.
6. Every campaign has publish and expiry controls.
7. Initiative status may dynamically influence hero messaging.
8. Expired campaigns move into Stories, Spotlight, Events, or Legacy where appropriate.
9. The evergreen GEC hero automatically returns when no major campaign is active.
10. The CMS controls the hero without requiring code changes.
11. Avoid forced auto-rotation.
12. Secondary hero items should be manually selectable.
13. All campaign metrics, dates, deadlines, and claims must be verified before publishing.

---

# 20. Long-Term Principle

```text
What GEC is thinking
        ↓
What GEC announces
        ↓
What GEC executes on ground
        ↓
What GEC achieves
        ↓
What becomes part of GEC's story
```

The homepage hero is not just a visual banner.

It is the live expression of GEC's most important current activity.
