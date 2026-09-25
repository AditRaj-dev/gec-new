# Galgotias Entrepreneurship Cell — Brand Colour & Visual Schema (Frozen)

**Status:** Frozen  
**Direction:** Modern Indian startup editorial × student energy × GEC heritage

---

# 1. Brand Direction

The website should preserve the visual identity already established in GEC presentation material:

- Warm cream backgrounds
- Deep crimson/red typography
- Red borders and visual frames
- Yellow/gold accents
- Blue supporting accents
- Warm beige/sand surfaces
- Editorial typography
- Student/startup energy

The website should **not** become:

- A generic corporate university website
- A purple-gradient startup website
- A neon cyberpunk experience
- A glassmorphism-heavy SaaS website

---

# 2. Core Colour Palette

## Primary — GEC Crimson

```text
HEX: #A3040F
```

Use for:

- Major headings
- Primary CTA buttons
- Navigation hover states
- Borders
- Icons
- Section labels
- Active states
- Key brand moments

---

## Action — Bright Red

```text
HEX: #C62F29
```

Use sparingly for:

- CTA hover
- Event badges
- Notification indicators
- Motion highlights
- Selected emphasis

---

## Main Background — Warm Cream

```text
HEX: #FCF8ED
```

Use as the main website background.

Avoid pure white as the dominant canvas.

---

## Secondary Background — Soft Sand

```text
HEX: #F4E2CA
```

Use for:

- Alternate sections
- Story cards
- Highlight panels
- Hover states
- Visual blocks

---

## Accent 01 — GEC Gold

```text
HEX: #FBCA05
```

Use for:

- Highlight words
- Small badges
- Counters
- Micro-interactions
- Accent lines
- Featured states

Do not use as a dominant full-page background.

---

## Accent 02 — GEC Blue

```text
HEX: #1F7EC0
```

Use selectively for:

- Technical themes
- Links
- Supporting graphics
- Startup/innovation accents
- Technical Team identity

---

## Text — Charcoal

```text
HEX: #222222
```

Use for:

- Body copy
- Navigation
- Long-form reading
- Descriptions
- UI labels

---

## Muted Text — Warm Grey

```text
HEX: #6E655F
```

Use for:

- Metadata
- Dates
- Captions
- Secondary descriptions
- Inactive states

---

## Soft White

```text
HEX: #FFFDF8
```

Use for:

- High-contrast text
- Light surfaces
- Text over red sections

---

# 3. CSS Tokens

```css
:root {
  --gec-red: #A3040F;
  --gec-red-bright: #C62F29;

  --gec-cream: #FCF8ED;
  --gec-sand: #F4E2CA;

  --gec-gold: #FBCA05;
  --gec-blue: #1F7EC0;

  --gec-charcoal: #222222;
  --gec-muted: #6E655F;

  --gec-white: #FFFDF8;
}
```

---

# 4. Recommended Colour Usage Ratio

Approximate visual balance:

```text
60% — Cream / warm neutral surfaces
25% — Deep crimson
8%  — Charcoal
4%  — Gold
2%  — Blue
1%  — Other controlled accent
```

This ratio is a design guideline, not a strict mathematical rule.

---

# 5. Page Rhythm

Recommended homepage section rhythm:

| Section | Background | Primary Accent |
|---|---|---|
| Hero | Warm Cream | Deep Crimson |
| What's Happening | Deep Crimson | Cream + Gold |
| Initiatives | Warm Cream | Initiative accents |
| Impact | Charcoal | Cream + Gold |
| Spotlight | Soft Sand | Crimson |
| Stories | Warm Cream | Crimson |
| Speakers | Deep Crimson | Cream |
| Partners | Warm Cream | Charcoal |
| Final CTA | Deep Crimson | Gold |

---

# 6. Navigation

Recommended:

```text
Background: Warm Cream
Text: Charcoal
Hover: Crimson
Active: Crimson
Primary CTA: Crimson background + Cream text
```

---

# 7. Hero Direction

Preferred visual treatment:

- Warm cream base
- Large editorial red typography
- Charcoal secondary words
- Logo-derived geometric forms
- Yellow and blue used as controlled motion accents
- No generic gradients

Example headline treatment:

```text
IDEAS       → Crimson
BEGIN       → Charcoal
HERE.       → Crimson
```

---

# 8. Typography Direction

## Display / Headlines

Recommended direction:

- Bold
- Editorial
- Poster-like
- High contrast
- Distinct personality

Candidate typefaces:

- Archivo Black
- Anton
- Bebas Neue
- DM Serif Display

Final font should be confirmed during design.

---

## Body / UI

Recommended direction:

- Manrope
- Inter

Preferred starting option:

```text
Body/UI: Manrope
```

---

# 9. Card System

Avoid generic SaaS cards.

Recommended style:

- Cream surface
- Crimson border
- 12–16px radius
- Low or no shadow
- Large index number
- Strong typography
- Accent arrow or small graphic

Example:

```text
01

STARTUP
DEVELOPMENT

Turning student ideas
into ventures.

Explore →
```

Hover behavior:

```text
Background → Crimson
Text → Cream
Accent arrow → Gold
```

---

# 10. Team Accent System

The master GEC identity remains crimson + cream.

Individual teams may receive controlled accent colours.

Suggested system:

| Team | Accent |
|---|---|
| Startup Development | Gold |
| Public Relations & Networking | Bright Red |
| Marketing & Campus Ambassador | Warm Orange |
| Event Management | Deep Burgundy |
| Digital Media & Promotions | Blue |
| Technical Team | Charcoal + Blue |
| Internship & Career Connect | Gold + Burgundy |

No team should become visually disconnected from the parent GEC brand.

---

# 11. Decorative Language

Recommended:

- Oversized circles
- Thin crimson linework
- Paper/grain texture
- Warm organic shapes
- Offset grids
- Dotted patterns
- Scribble arrows
- Sticky-note inspired elements
- Editorial image crops

Avoid:

- Heavy glassmorphism
- Neon glows
- Random gradients
- Generic 3D blobs
- Excessive shadow

---

# 12. Motion System

Animation should communicate:

- hierarchy
- navigation
- feedback
- personality
- state change

Recommended:

### Hero
- Text reveal
- Slow geometric movement
- Logo-derived shapes

### Cards
- 100–200ms response
- 2–6px lift
- Arrow movement
- Background inversion

### Page transitions
- Cream/red wipe

### Impact numbers
- Count-up animation

### Story images
- Slow image zoom

### Team cards
- Background inversion

Optional:

- Custom circular cursor using GEC crimson

Avoid animating every element.

---

# 13. Photography Direction

Preferred:

- Real GEC events
- Students working
- Networking
- Pitching
- Founder conversations
- Team moments
- Behind-the-scenes images

Avoid over-reliance on stock photography.

Photography should feel candid, energetic, and real.

---

# 14. Brand Principle

The final visual identity should feel like:

**Modern Indian startup editorial × student energy × GEC heritage**

The website should modernize existing GEC visual DNA rather than replace it.
