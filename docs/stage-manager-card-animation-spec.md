# Stage Manager–Inspired Informational Card Animation Specification

## Purpose

Create an informational-card interaction for a website inspired by the spatial behavior of macOS Stage Manager.

The interaction must not behave like ordinary tabs or a carousel. Each information card should feel like a persistent spatial object that can exist in one of two primary states:

- **Inactive preview** in the left sidebar
- **Active expanded card** in the main content stage

The defining visual characteristic is that the sidebar cards are **3D-rotated inward toward the center of the screen**, similar to the miniature windows shown in macOS Stage Manager.

---

# 1. Core Visual Concept

The left sidebar cards must not be flat rectangular thumbnails.

They should appear like miniature application windows viewed at an angle.

Each sidebar card should:

- stay near the left edge of the viewport
- be rotated around the **Y-axis**
- use the left edge as the main visual hinge
- face inward toward the main active content area
- appear slightly foreshortened
- maintain enough readability to identify the card

The active card should be large, front-facing, and easy to read.

The contrast should be obvious:

- **Sidebar = angled, compact, perspective-driven**
- **Main stage = large, flat, readable, dominant**

---

# 2. Visual Reference Model

## Wrong

```text
[ Card B ]
[ Card C ]
[ Card D ]
[ Card E ]
```

This is only a vertical list.

## Also Wrong

```text
[ Card B ]
   [ Card C ]
      [ Card D ]
   [ Card E ]
```

This only creates an inward arc.

## Correct Direction

The card face itself should be rotated in 3D.

```text
SCREEN EDGE
│
│   /────────────/
│  /   Card B   /
│ /────────────/
│
│   /────────────/
│  /   Card C   /
│ /────────────/
│
│   /────────────/
│  /   Card D   /
│ /────────────/
│
└──────────────────────────────→ ACTIVE CONTENT
```

The cards should visually feel like windows that are turned inward toward the main workspace.

---

# 3. Desktop Layout

Use a large interactive section.

Recommended values:

- section width: `100%`
- max content width: `1440px–1600px`
- minimum interactive height: `720px`
- preferred section height: `80–90vh`
- horizontal padding: `48px–80px`
- vertical padding: `64px–96px`

The layout has two primary zones:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ANGLED PREVIEW RAIL                ACTIVE STAGE             │
│                                                              │
│  /──────────/                  ┌───────────────────────────┐  │
│ /  Card B  /                   │                           │  │
│/──────────/                    │       ACTIVE CARD A       │  │
│                                │                           │  │
│  /──────────/                  │  Heading                  │  │
│ /  Card C  /                   │  Description              │  │
│/──────────/                    │  Metrics / Visuals        │  │
│                                │  CTA                      │  │
│  /──────────/                  │                           │  │
│ /  Card D  /                   └───────────────────────────┘  │
│/──────────/                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 4. Sidebar Geometry

Recommended sidebar region:

- viewport offset from left: `20px–36px`
- visual rail width: `180px–240px`
- visible cards: `3–6`
- vertical gap: `14px–22px`
- optional slight overlap: `0px–12px`

Recommended card dimensions before perspective transform:

- width: `160px–210px`
- height: `95px–130px`
- border radius: `12px–18px`

The perspective transform will make the cards appear visually narrower than their raw width.

---

# 5. Perspective Setup

Apply perspective to the preview rail container.

Recommended:

```css
.preview-rail {
  perspective: 1200px;
  transform-style: preserve-3d;
}
```

Use a range of approximately:

```text
900px–1400px
```

Lower values create stronger perspective distortion.
Higher values create a flatter appearance.

A good default is:

```css
perspective: 1200px;
```

---

# 6. Sidebar Card Rotation

Each inactive card should use a Y-axis rotation.

Recommended range:

```text
rotateY: 28deg–42deg
```

Good default:

```text
34deg
```

Strong version:

```text
38deg
```

Avoid going beyond approximately `45deg` because the cards will become too visually compressed.

Recommended transform:

```css
transform:
  rotateY(34deg)
  scale(0.94);
```

Optional stronger depth:

```css
transform:
  translateZ(2px)
  rotateY(36deg)
  scale(0.94);
```

---

# 7. Transform Origin

The transform origin matters heavily.

Use:

```css
transform-origin: left center;
```

This makes the left side of the card behave like a hinge and allows the right side to visually open toward the active content area.

Desired mental model:

```text
LEFT SCREEN EDGE
│
│ hinge
│ ●──────────────
│  \
│   \
│    \ card face opening toward content
│
└──────────────────────────→ CENTER
```

---

# 8. Card Depth and Hierarchy

Inactive cards can vary slightly in scale and opacity.

Example:

```text
Top card:
scale: 0.93
opacity: 0.78

Middle-upper card:
scale: 0.95
opacity: 0.88

Most prominent preview:
scale: 0.97
opacity: 1.00

Middle-lower card:
scale: 0.95
opacity: 0.88

Bottom card:
scale: 0.93
opacity: 0.78
```

Do not use huge differences.

The 3D rotation should remain the dominant visual cue.

---

# 9. Hover Behavior

On desktop hover, the card should become slightly more front-facing.

Normal state:

```text
rotateY: 34deg
scale: 0.94
opacity: 0.82
```

Hover state:

```text
rotateY: 24deg
scale: 0.98
opacity: 1
```

Optional hover translation:

```text
translateX: 4px–8px
```

Hover duration:

```text
180ms–240ms
```

Suggested easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

The hover effect should communicate:

> This window is preparing to come forward.

---

# 10. Active Card Geometry

The active card occupies most of the stage.

Recommended desktop width:

```text
65–72% of available width
```

Typical size:

```text
width: 850px–1050px
height: 500px–650px
```

Recommended border radius:

```text
24px–32px
```

Recommended internal padding:

```text
40px–64px
```

The active card should use:

```text
rotateY: 0deg
scale: 1
opacity: 1
```

It should be essentially front-facing.

---

# 11. State Transition

When a preview card is selected, the user should clearly perceive that the same object becomes the active card.

## Initial State

```text
SIDEBAR                               ACTIVE STAGE

 /────────/                    ┌──────────────────────┐
/ Card B /                     │                      │
─────────                       │        CARD A        │
                                │        ACTIVE        │
 /────────/                    │                      │
/ Card C /                     └──────────────────────┘
─────────

 /────────/
/ Card D /
─────────
```

User clicks Card C.

## Transition

```text
 /────────/
/ Card B /
─────────

 /────────/
/ Card C / ────────╲
─────────            ╲
                      ╲
                       ╲──────────────►
                                        ┌───────────────┐
                                        │    CARD C     │
                                        │   EXPANDING   │
                                        └───────────────┘

                        ◄─────────────── CARD A
                              shrinks

 /────────/
/ Card D /
─────────
```

The selected card must:

1. rise in z-index
2. become slightly larger
3. reduce its Y-axis rotation
4. move diagonally toward the main stage
5. expand in width and height
6. reach `rotateY(0deg)`
7. reveal expanded content

---

# 12. Previous Active Card Returning to Sidebar

The current active card should not simply disappear.

It should:

1. hide detailed content
2. shrink
3. move back toward the preview rail
4. reapply Y-axis rotation
5. adopt preview scale and opacity
6. settle into its new sidebar slot

Transition concept:

```text
[ ACTIVE A ]
     │
     │ shrink
     │ move left
     │ rotateY 0 → 34deg
     ▼

 /────────/
/ Card A /
─────────
```

---

# 13. Motion Timeline

Recommended total transition duration:

```text
450ms–650ms
```

Suggested timeline:

```text
0ms                                                   600ms
│                                                       │
├────────────┬──────────────────────┬────────────────────┤
│ SELECT     │ GEOMETRY TRANSITION  │ CONTENT REVEAL     │
│            │                      │                    │
│ scale up   │ move to stage        │ heading appears    │
│ shadow ↑   │ rotateY → 0          │ body appears       │
│ opacity ↑  │ resize card          │ metrics appear      │
│            │ previous card exits  │ CTA appears         │
│            │ sidebar reorders     │ spring settles      │
├────────────┼──────────────────────┼────────────────────┤
0–120ms      100–450ms              300–600ms
```

---

# 14. Content Transition

Do not attempt to show all expanded content while the card is still tiny.

Use progressive content density.

## Preview State

Show only:

- thumbnail / image
- short title
- small identifier / number
- optional one-line label

Example:

```text
 /────────────────/
/  [visual]       /
/                 /
/  Product        /
/  Strategy   02  /
────────────────
```

## Expanded State

Show:

- eyebrow
- full title
- full description
- metrics
- CTA
- larger visual
- supporting information

Example:

```text
┌───────────────────────────────────────────────┐
│ PRODUCT STRATEGY                         02   │
│                                               │
│ Building integrated systems instead of       │
│ isolated digital products.                   │
│                                               │
│ ┌─────────────┐  ┌─────────────┐             │
│ │ Metric      │  │ Metric      │   Visual    │
│ │ 42+         │  │ 60+         │             │
│ └─────────────┘  └─────────────┘             │
│                                               │
│ Explore →                                     │
└───────────────────────────────────────────────┘
```

Reveal expanded content only after approximately `35–45%` of the geometry transition has completed.

---

# 15. Sidebar Reordering

After a card becomes active, remaining preview cards should smoothly occupy their new positions.

Animate:

- Y position
- X position if necessary
- scale
- opacity
- rotateY
- z-index hierarchy

Do not jump positions instantly.

Suggested reorder duration:

```text
350ms–500ms
```

Optional stagger:

```text
20ms–40ms per neighboring card
```

---

# 16. Shadow and Depth

Sidebar cards:

```css
box-shadow: 0 12px 30px rgba(0,0,0,0.10);
```

Hover:

```css
box-shadow: 0 16px 38px rgba(0,0,0,0.14);
```

Active card:

```css
box-shadow:
  0 24px 70px rgba(0,0,0,0.16),
  0 6px 20px rgba(0,0,0,0.08);
```

Keep shadows soft.

The cards should feel elevated, not dramatic.

---

# 17. Border Treatment

Light interface:

```css
border: 1px solid rgba(0,0,0,0.06);
```

Dark interface:

```css
border: 1px solid rgba(255,255,255,0.10);
```

Optional glass treatment:

```css
backdrop-filter: blur(18px);
```

Use glass effects only if they match the existing website design.

---

# 18. React / Next.js Implementation

Preferred stack:

- React / Next.js
- Motion / Framer Motion
- shared layout transitions
- `layoutId`
- `AnimatePresence` for internal content only
- CSS perspective
- transform-based animation

Use one shared data model.

Example:

```ts
interface InfoCard {
  id: string;
  eyebrow?: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  image?: string;
  icon?: string;
  metrics?: Array<{
    label: string;
    value: string;
  }>;
  cta?: {
    label: string;
    href: string;
  };
  theme?: string;
}
```

---

# 19. Shared Layout Rule

The preview and active state of the same card should share a common layout identity.

Example:

```tsx
<motion.article layoutId={`card-${card.id}`}>
```

This lets the framework interpolate between preview geometry and expanded geometry.

Do not implement the active card and preview card as completely unrelated visual objects.

The user should perceive continuity.

---

# 20. Suggested Motion Values

Recommended spring:

```ts
const spring = {
  type: "spring",
  stiffness: 250,
  damping: 28,
  mass: 0.9,
};
```

Alternative easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

Recommended preview transform:

```css
transform:
  perspective(1200px)
  rotateY(34deg)
  scale(0.94);
```

Hover:

```css
transform:
  perspective(1200px)
  rotateY(24deg)
  scale(0.98)
  translateX(6px);
```

Active:

```css
transform:
  perspective(1200px)
  rotateY(0deg)
  scale(1);
```

---

# 21. Recommended State Model

```ts
const previewState = {
  rotateY: 34,
  scale: 0.94,
  opacity: 0.84,
};

const previewHoverState = {
  rotateY: 24,
  scale: 0.98,
  opacity: 1,
  x: 6,
};

const activeState = {
  rotateY: 0,
  scale: 1,
  opacity: 1,
  x: 0,
};
```

---

# 22. Interaction Flow

```text
USER CLICKS PREVIEW
        │
        ▼
raise z-index
        │
        ▼
reduce rotateY
34deg → 20deg → 0deg
        │
        ▼
move card toward active stage
        │
        ▼
expand dimensions
        │
        ▼
reveal active content
        │
        ▼
previous active card shrinks
        │
        ▼
previous active moves to sidebar
        │
        ▼
previous active rotatesY 0deg → 34deg
        │
        ▼
remaining previews reorder
```

---

# 23. Responsive Behavior

## Desktop — Above 1100px

Use full Stage Manager-inspired behavior.

```text
 /──────/      ┌──────────────────────────────┐
/  B   /       │                              │
───────        │          ACTIVE CARD         │
 /──────/      │                              │
/  C   /       │                              │
───────        └──────────────────────────────┘
 /──────/
/  D   /
───────
```

Recommended rotation:

```text
28deg–42deg
```

## Tablet — 768px to 1100px

Reduce preview size and perspective intensity.

Recommended rotation:

```text
20deg–30deg
```

Reduce rail width.

Reduce active card padding to:

```text
28px–40px
```

## Mobile — Below 768px

Do not force the full Stage Manager sidebar effect.

Use:

- active card on top
- horizontal preview strip underneath
- optional very mild perspective on previews

Example:

```text
┌───────────────────────────────┐
│                               │
│          ACTIVE CARD          │
│                               │
└───────────────────────────────┘

 /──────/  /──────/  /──────/
/   B   / /   C   / /   D   /  → swipe
───────  ───────  ───────
```

---

# 24. Accessibility

Support:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

- remove large spatial movement
- remove spring behavior
- reduce or eliminate perspective animation
- use fast opacity transitions
- update geometry immediately

All preview cards must be keyboard accessible.

Use semantic buttons or accessible interactive elements.

Support:

- Tab
- Enter
- Space

Add proper ARIA labels describing each card.

---

# 25. Performance Rules

Prefer GPU-friendly animation properties:

- `transform`
- `opacity`
- `scale`
- `translate3d`
- `rotateY`

Avoid repeatedly animating raw layout properties such as:

- `top`
- `left`
- `width`
- `height`

when shared layout / FLIP animation can handle them more efficiently.

Use `will-change: transform` selectively.

Do not apply it permanently to a large number of elements.

---

# 26. What Not to Build

Do not build:

- a normal tab switcher
- a standard carousel
- a flat vertical sidebar
- an arc-only arrangement
- heavily skewed fake cards
- a 3D cover-flow carousel
- exaggerated card flips
- extreme perspective
- excessive glassmorphism
- huge zoom animations
- random rotation differences

The final interaction should feel controlled and architectural.

---

# 27. Final Visual Rule

The defining rule is:

> Sidebar cards must look like miniature windows turned inward toward the active workspace.

The visual effect should come from:

```text
perspective
+
rotateY
+
left-center transform origin
+
subtle scale
+
soft depth
```

Not from:

```text
simple horizontal offsets
or
flat card stacking
```

---

# 28. Final Coding Agent Instruction

Implement the component as a persistent spatial card system.

Every information card should exist continuously and move between preview and active states.

The left sidebar cards should visually resemble macOS Stage Manager thumbnails: miniature windows rotated inward toward the center of the screen using real 3D perspective transforms.

For left-side previews, use `transform-origin: left center` and approximately `rotateY(34deg)` as the initial baseline. On hover, reduce the angle. On selection, smoothly rotate the card toward `0deg`, move it into the main stage, and expand it into the active information card.

At the same time, shrink the previous active card, move it into the sidebar, and gradually reapply the perspective rotation.

The transition must communicate that the same card object is physically moving through space rather than content simply being replaced.

Prioritize:

- visual continuity
- spatial hierarchy
- smooth perspective movement
- readability
- performance
- responsive behavior
- restrained premium motion

The final result should feel Apple-inspired in interaction quality, while remaining visually original and appropriate for the website's own design system.
