# GEC Website — Texture, Typography & Shader Direction Specification

**Project:** Galgotias Entrepreneurship Cell (GEC) Website  
**Scope:** Visual enrichment only  
**Source UI:** `styled.html`  
**Version:** 1.0  
**Date:** 21 September 2026  

---

# 0. Non-Negotiable Constraint

This document is a **visual-treatment specification**, not a layout redesign.

The existing website structure must remain unchanged.

## Do NOT change

- DOM hierarchy
- Section order
- Existing grid definitions
- Existing flex/grid layout behavior
- Widths used to establish layout
- Card dimensions
- Card positions
- Stage Manager layout
- Stage Manager rotation/stacking behavior
- Navigation layout
- Section padding as a redesign mechanism
- Existing breakpoint logic
- Existing content hierarchy
- Existing component positions
- Existing interaction flows

## Allowed changes

Only the following may be altered or added:

1. Typography treatment
2. Font weight / tracking / line-height where it does not alter layout intent
3. Background texture
4. Surface grain
5. Shader canvases behind existing content
6. Shadow refinement
7. Border tonal refinement
8. Subtle highlights
9. Section lighting
10. Background overlays
11. Text rendering treatment
12. Low-intensity micro-animation
13. Reduced-motion fallbacks
14. GPU shader effects that do not become layout participants

**Rule:** Texture must sit *behind* the current UI.  
**Rule:** Shader canvases must never become part of the layout flow.

---

# 1. Design Problem

The current site already has:

- a defined editorial structure,
- a cream / sand / crimson / charcoal brand system,
- clear card systems,
- mono metadata typography,
- a working Stage Manager interaction,
- responsive behavior,
- and brand-driven navigation.

The visual problem is not lack of structure.

The problem is that many large areas rely on **flat solid fills**.

That creates a visual impression closer to:

> a refined HTML prototype / polished wireframe

than:

> a finished editorial digital experience.

The objective is therefore to add **material, atmosphere, depth, light and controlled motion** without touching the underlying composition.

---

# 2. Existing Brand Foundation

Keep the existing GEC palette as the source of truth.

```css
--gec-canvas: #FCF8ED;
--gec-surface-sand: #F4E2CA;
--gec-surface-card: #FFFDF8;
--gec-surface-elevated: #FFFFFF;

--gec-crimson: #A3040F;
--gec-crimson-act: #C62F29;
--gec-gold: #FBCA05;
--gec-blue: #1F7EC0;

--gec-ink: #222222;
--gec-ink-muted: #5F5650;
--gec-ink-subtle: #8A817A;
```

The shaders must use these colors.

Do not allow preset colors to dictate the page.

---

# 3. Overall Visual Direction

The website should feel like a combination of:

- contemporary editorial design,
- premium university publication,
- physical paper / print material,
- entrepreneurial energy,
- restrained digital experimentation,
- technical blueprint references,
- interactive institutional storytelling.

It should **not** feel like:

- a crypto landing page,
- an AI SaaS template,
- neon cyberpunk,
- generic mesh-gradient startup design,
- a gaming website,
- an experimental WebGL portfolio,
- a glassmorphism demo,
- an over-animated agency website.

---

# 4. Texture Hierarchy

Use this approximate visual balance:

```text
70%  Static material / paper surface
20%  Lighting / depth / tonal variation
10%  Shader motion
```

The shader is an enhancement layer, not the primary visual identity.

---

# 5. Shaders.com Research

Research basis:

- https://shaders.com/presets/backgrounds
- https://shaders.com/presets/subtle
- https://shaders.com/presets/minimal
- https://shaders.com/presets/gradient
- https://shaders.com/presets/abstract
- https://shaders.com/collection/watercolor-on-paper
- https://shaders.com/collection/undertones
- https://shaders.com/docs/guide/js/quickstart
- https://shaders.com/docs/guide/layout-positioning

At the time of research, Shaders.com exposes dedicated categories for:

- Backgrounds
- Subtle
- Minimal
- Gradient
- Abstract
- Dark
- Geometric
- Vibrant
- Dither
- ASCII
- Image Effects
- Logo shaders

For this website, prioritize **Subtle**, **Minimal**, and selected **Background** presets.

---

# 6. Approved Shader Families

## Tier A — Primary Recommendations

These are the safest and strongest fits for GEC.

### A1. Watercolor on Paper

Collection:

https://shaders.com/collection/watercolor-on-paper

Use for:

- hero background
- cream editorial sections
- selected initiative highlights
- large introductory surfaces

Why it works:

- reinforces the existing warm cream canvas
- creates material depth
- feels editorial instead of technological
- supports crimson/gold pigment-like movement
- naturally matches an entrepreneurship-cell publication identity

Recommended presets to test first:

- Watercolor on Paper 6
- Watercolor on Paper 7
- Watercolor on Paper 3
- Watercolor on Paper 1

Use preset geometry/motion, then recolor it to GEC.

---

### A2. Undertones

Collection:

https://shaders.com/collection/undertones

Use for:

- cream hero areas
- section transitions
- large content bands
- background atmosphere behind editorial copy

Recommended presets to test:

- Undertones 4
- Undertones 6
- Undertones 7
- Undertones 8
- Undertones 11

Why it works:

The effect can produce low-frequency tonal variation without visually competing with the content.

This is one of the best choices when the requirement is:

> “Make it feel alive without making the shader obvious.”

---

### A3. Static Noise

Available through the Minimal/Subtle libraries.

Use for:

- global grain
- charcoal sections
- cream paper texture
- footer
- large flat backgrounds

Do **not** use it as a strong glitch effect.

Treat it as an ultra-low-opacity material layer.

Recommended starting candidates:

- Static Noise 4
- Static Noise 5
- Static Noise 3

Target perception:

> printed grain / film texture

Not:

> broken monitor / glitch aesthetic.

---

### A4. Afternoon Sunlight

Visible in the Subtle and Minimal libraries.

Recommended:

- Afternoon Sunlight 1
- Afternoon Sunlight 2
- Afternoon Sunlight 3

Use for:

- hero lighting
- warm cream areas
- announcement sections
- story / community sections

Why:

The visual idea of slowly changing illumination suits a warm editorial canvas far better than a colorful neon gradient.

---

### A5. Subtle Liquid

Visible extensively in the Subtle and Minimal categories.

Good candidates:

- Subtle Liquid 6
- Subtle Liquid 7
- Subtle Liquid 2
- Subtle Liquid 8
- Subtle Liquid 9

Use for:

- crimson sections
- feature spotlights
- hero ambient movement

Avoid if the preset begins reading as obvious liquid blobs.

The movement should be barely perceptible.

---

# 7. Tier B — Controlled Use

These should only be used in selective areas.

## B1. Mesh Flow

Shaders.com currently lists a Mesh Flow collection.

Good use:

- dark/charcoal feature section
- technical / innovation section
- one major visual panel

Possible tests:

- Mesh Flow 1
- Mesh Flow 2

Do not use across the entire site.

---

## B2. Specular Lines

Shaders.com currently lists a Specular Lines collection.

Use for:

- charcoal / impact sections
- future-facing innovation content
- tech-team related visual atmosphere

Treatment:

- dark charcoal base
- crimson line energy
- tiny gold glints
- very low opacity

Never render bright white metallic streaks across readable text.

---

## B3. Traced Paths / Traced Lines

Use sparingly as an entrepreneurial “network / route / system” visual metaphor.

Good for:

- initiatives
- ecosystem
- stakeholders
- community network
- innovation / execution sections

Keep line density low.

---

## B4. Gradient Grid

Use only when a technical / blueprint quality is desired.

Good match for:

- analytics-like areas
- process / metrics sections
- internal system storytelling

Avoid visible rainbow gradients.

---

# 8. Shader Families to Avoid

Unless a future page explicitly calls for them, avoid:

- Neon Flow
- Chrome Rings
- Glowsticks
- Pixel Party
- Dense Nebula
- Fluid Chrome
- highly saturated Shifted Swirls
- flashy Pixel Beams
- heavy Scanner Noise
- Matrix-style effects
- ASCII backgrounds
- obvious holographic effects

These are visually strong but conflict with the institutional/editorial GEC brand.

---

# 9. Section-by-Section Shader Mapping

## 9.1 Navigation

**Shader:** NONE

The navigation should remain visually stable.

Allowed:

- extremely fine grain
- subtle bottom edge light
- mild cream translucency if needed

Do not animate the navbar background.

---

# 9.2 Hero

## Recommended shader

### First choice

**Watercolor on Paper**

### Second choice

**Undertones**

### Alternative

**Afternoon Sunlight**

## Hero color mapping

```text
Base             #FCF8ED
Primary pigment  #A3040F
Secondary red    #C62F29
Warm accent      #FBCA05
Ink              #222222
Optional blue    #1F7EC0 at extremely low influence
```

## Visual behavior target

```text
Cream field
      ↓
soft crimson pigment enters from one region
      ↓
slight warm gold illumination
      ↓
slow diffusion
      ↓
returns / continues seamlessly
```

Do not create multiple obvious blobs moving independently.

## Perceptual configuration targets

These are design targets, not guaranteed Shaders API property names.

```yaml
hero_shader:
  motion_speed: very_slow
  perceived_speed: 0.08-0.16
  distortion: low
  distortion_target: 0.10-0.20
  noise: subtle
  noise_target: 0.05-0.12
  softness: high
  perceived_blur: 0.70-0.90
  saturation: restrained
  canvas_opacity: 0.18-0.30
  pointer_response: optional
  pointer_strength: 0.03-0.08
  contrast: low
```

---

# 9.3 Cream Sections

Use primarily **static texture**, not active shaders.

Recommended treatment:

1. Warm cream base
2. Very fine monochromatic noise
3. Crimson radial illumination at 2–4%
4. Gold radial illumination at 1–3%
5. Optional Undertones shader at 8–15% visual strength

CSS concept:

```css
.surface-cream {
  background-color: var(--gec-canvas);
  position: relative;
  isolation: isolate;
}

.surface-cream::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(
      circle at 14% 8%,
      rgba(163, 4, 15, 0.035),
      transparent 34%
    ),
    radial-gradient(
      circle at 86% 74%,
      rgba(251, 202, 5, 0.028),
      transparent 30%
    );
}
```

---

# 9.4 Sand Sections

Primary approach:

**paper-fibre effect**

Shader optional.

Recommended:

- Watercolor on Paper at extremely low motion
- Static Noise
- no pointer interaction

Visual target:

```yaml
sand_surface:
  grain: 0.04
  fibre_visibility: 0.05
  vignette: 0.02
  motion: none_or_extremely_slow
  light_direction: upper_left
```

The sand section should feel more tactile than the cream section.

---

# 9.5 Crimson Sections

Primary shader:

**Subtle Liquid**

Alternative:

**Undertones**

Color mapping:

```text
#A3040F  Main
#7D030B  Shadow red
#C62F29  Highlight red
#FBCA05  Rare micro-accent
```

Target effect:

> red moving inside red

Not:

> multiple-color liquid gradient.

Visual target:

```yaml
crimson_shader:
  speed: 0.05-0.10
  turbulence: low
  distortion: 0.06-0.14
  color_variation: narrow
  canvas_opacity: 0.28-0.44
  highlight_visibility: restrained
  pointer_strength: 0.00-0.04
```

The section must remain obviously “GEC crimson.”

---

# 9.6 Charcoal Sections

Primary choice:

**Specular Lines**

Second choice:

**Mesh Flow**

Third choice:

**Traced Paths**

Palette:

```text
Background  #18191C
Secondary   #222222
Red         #A3040F
Gold        #FBCA05
Blue        #1F7EC0
```

Rules:

- dominant background remains charcoal
- crimson can occupy meaningful visual area
- gold appears only as a micro-highlight
- blue should be less visible than crimson
- no bright cyan
- no white laser-line look

Target:

```yaml
charcoal_shader:
  motion_speed: 0.04-0.09
  opacity: 0.12-0.24
  line_brightness: low
  line_density: sparse
  glow_radius: broad
  pointer_response: subtle
```

---

# 9.7 Cards

Do **not** place a WebGPU canvas in every card.

That creates:

- unnecessary GPU cost
- too much visual movement
- excessive DOM/canvas complexity
- weaker hierarchy

Instead use material CSS.

```css
.brand-card,
.wf-card-container,
.team-item-card {
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.98),
      rgba(255,253,248,0.94)
    );

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.82),
    0 1px 2px rgba(34,34,34,0.035),
    0 8px 24px rgba(34,34,34,0.045);
}
```

Optional material light:

```css
.brand-card::before,
.wf-card-container::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  background:
    radial-gradient(
      circle at 12% 0%,
      rgba(255,255,255,0.66),
      transparent 36%
    );
}
```

---

# 9.8 Stage Manager Cards

**Do not alter:**

- perspective
- card rotation
- card scale
- stacking
- transforms
- card rail
- detail panel sizing
- state transitions

Allowed:

- card grain
- subtle face lighting
- border refinement
- typography refinement
- shadow quality

Do NOT attach separate animated shaders to each Stage Manager card.

The Stage Manager motion is already the visual interaction.

Adding local shaders would compete with it.

---

# 9.9 Metrics / Impact Section

Recommended shader:

- charcoal section → Specular Lines
- cream section → Undertones
- no animated digits caused by shader

Use shader only as environmental background.

---

# 9.10 Footer

Preferred:

**Static Noise + subtle radial crimson glow**

No complex motion required.

Example:

```css
.site-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    radial-gradient(
      70% 70% at 15% 110%,
      rgba(163,4,15,.28),
      transparent 65%
    );
}
```

---

# 10. Global Paper Grain

Use one global texture, not separate textures on every component.

Recommended strategy:

```css
.canvas-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 900;
  opacity: 0.025;
  mix-blend-mode: multiply;

  /*
    Use a tiny seamless monochromatic noise asset
    or an SVG turbulence data URI.
  */
}
```

Important:

The current canvas contains interactive content.

Therefore the overlay must always use:

```css
pointer-events: none;
```

---

# 11. Typography Direction

The current font system is good:

```text
Display    Cabinet Grotesk
Body       Manrope
Metadata   JetBrains Mono
```

Do not replace the families unless there is a separate branding decision.

The improvement should come from hierarchy and rendering.

---

# 12. Display Typography

Current design feels slightly too systemized when every major display line is uppercase.

Recommended rule:

## Uppercase

Use uppercase for:

- kickers
- metadata
- coordinates
- state labels
- categories
- short status language
- micro-navigation
- section IDs

## Sentence / title case

Use sentence or title case for:

- hero message
- editorial statements
- long section headings
- story headings
- large thematic statements

This creates editorial contrast.

Example:

Bad default pattern:

```text
BUILDING THE NEXT GENERATION
OF ENTREPRENEURS
```

Preferred editorial pattern:

```text
Building the next generation
of entrepreneurs.
```

Uppercase can still be used intentionally for specific campaigns.

---

# 13. Hero Type Treatment

Recommended target:

```css
.h1-display {
  letter-spacing: -0.045em;
  line-height: 0.98;
  font-weight: 900;
  text-wrap: balance;
}
```

Do not reduce line-height if it creates glyph collisions.

Responsive test required.

---

# 14. H2 Treatment

```css
.h2-section {
  letter-spacing: -0.035em;
  line-height: 1.05;
  text-wrap: balance;
}
```

Aim for a stronger editorial rhythm.

---

# 15. Body Copy

Retain Manrope.

Recommended:

```css
.body-editorial {
  line-height: 1.68;
  letter-spacing: -0.006em;
}
```

Avoid making body text too light.

The paper texture will reduce apparent contrast slightly, so the text must remain readable.

---

# 16. Mono Typography

JetBrains Mono should act as a functional accent.

Good uses:

```text
02 / TEAMS
ACTIVE
2026
07:30 PM
STATUS
INITIATIVE
SYSTEM
COORDINATE
INDEX
```

Bad use:

Long body paragraphs.

---

# 17. Tonal Text Treatment

For very large hero typography only:

```css
.hero-title-rich {
  color: transparent;
  background:
    linear-gradient(
      135deg,
      #222222 0%,
      #352928 58%,
      #A3040F 145%
    );
  -webkit-background-clip: text;
  background-clip: text;
}
```

This should appear almost like ink variation.

It must **not** visibly read as rainbow/gradient text.

---

# 18. Shader DOM Pattern

Shaders.com documents that a shader renders to a canvas.

For a section background, use:

```html
<section class="wf-section has-shader">
  <canvas
    class="gec-shader-layer"
    aria-hidden="true"
  ></canvas>

  <!-- Existing section content remains unchanged -->
  <div class="existing-section-content">
    ...
  </div>
</section>
```

CSS:

```css
.has-shader {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.gec-shader-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

.has-shader > :not(.gec-shader-layer) {
  position: relative;
}
```

### Important

Do not place canvas as a grid child if doing so changes grid sizing.

The canvas must remain absolutely positioned.

---

# 19. Vanilla JavaScript Integration

Shaders.com documents a vanilla JavaScript API through:

```js
import { createShader } from 'shaders/js';
```

Installation:

```bash
npm install shaders
```

Generic pattern:

```js
import { createShader } from 'shaders/js';

const canvas = document.querySelector('[data-gec-shader="hero"]');

const shader = await createShader(canvas, {
  components: [
    // Paste/reconstruct the component configuration
    // exported by the selected Shaders.com preset.
  ]
});
```

The exact component list and prop names should be taken from the selected preset/editor export.

**Do not invent prop names from this design document.**

Values such as `speed`, `distortion`, `noise`, etc. elsewhere in this document describe the desired **perceptual result** unless they exactly match the exported preset API.

---

# 20. Why This Matters

Different Shaders.com presets may be built from different components.

For example, one preset might expose:

- gradient controls
- transform values
- frequency parameters
- animation settings

while another may expose a different parameter set.

Therefore:

1. choose the preset,
2. open it in Shaders,
3. recolor it to the GEC palette,
4. lower its visual intensity,
5. export/copy its generated configuration,
6. integrate that exact configuration.

Do not force one generic config schema onto every shader.

---

# 21. Recommended Preset Workflow

For each selected shader:

```text
Shaders.com
    ↓
Open preset
    ↓
Duplicate / edit
    ↓
Replace preset colors
with GEC colors
    ↓
Reduce speed
    ↓
Reduce contrast
    ↓
Reduce saturation
    ↓
Remove unnecessary colors
    ↓
Test behind real content
    ↓
Export / copy implementation
    ↓
Integrate into section canvas
```

---

# 22. Final Recommended Shader Stack

If only a few shaders are used, choose these.

## Shader 01 — HERO

**Watercolor on Paper 6**

Role:

```text
hero atmosphere
```

Color mapping:

```text
cream   #FCF8ED
red     #A3040F
red 2   #C62F29
gold    #FBCA05
```

Visual strength:

```text
20–28%
```

Motion:

```text
extremely slow
```

---

## Shader 02 — LIGHT CREAM FEATURE SECTION

**Undertones 4**

Role:

```text
ambient depth
```

Color mapping:

```text
cream
warm sand
very faint crimson
```

Strength:

```text
10–18%
```

---

## Shader 03 — CRIMSON FEATURE

**Subtle Liquid 6 or 7**

Role:

```text
red-on-red motion
```

Strength:

```text
28–40%
```

Palette:

```text
#72030A
#A3040F
#C62F29
```

Optional gold:

```text
< 3% visual contribution
```

---

## Shader 04 — DARK / INNOVATION

**Specular Lines**

Role:

```text
technical energy
```

Strength:

```text
12–22%
```

Palette:

```text
#18191C
#222222
#A3040F
#FBCA05
```

---

## Shader 05 — GLOBAL MATERIAL

**Static Noise 4 or 5**

Role:

```text
grain
```

Strength:

```text
2–4%
```

No visible animation required.

---

# 23. Alternative Conservative Stack

For a less experimental site:

```text
Hero             Undertones
Cream sections   Static grain only
Sand sections    Watercolor texture
Crimson sections Subtle Liquid
Charcoal          Static Noise + CSS glow
Footer            Static Noise
```

This is safer and more institutional.

---

# 24. Alternative Creative Stack

If stronger personality is desired:

```text
Hero             Watercolor on Paper
Cream sections   Undertones
Sand sections    Afternoon Sunlight
Crimson           Subtle Liquid
Innovation       Specular Lines
Network section  Traced Paths
Footer            Static Noise
```

Use this only if the motion remains restrained.

---

# 25. Shader Opacity System

Create tokens.

```css
:root {
  --shader-ambient: 0.12;
  --shader-light: 0.18;
  --shader-hero: 0.26;
  --shader-feature: 0.34;
}
```

Usage:

```css
.shader-ambient {
  opacity: var(--shader-ambient);
}

.shader-hero {
  opacity: var(--shader-hero);
}
```

This makes visual intensity manageable globally.

---

# 26. Texture Tokens

```css
:root {
  --texture-grain-global: 0.025;
  --texture-grain-sand: 0.04;
  --texture-highlight: 0.05;
  --texture-vignette: 0.025;
}
```

---

# 27. Surface Lighting

Cream:

```css
background:
  radial-gradient(
    circle at 10% 0%,
    rgba(255,255,255,.58),
    transparent 36%
  ),
  var(--gec-canvas);
```

Sand:

```css
background:
  radial-gradient(
    circle at 15% 5%,
    rgba(255,255,255,.28),
    transparent 34%
  ),
  var(--gec-surface-sand);
```

Crimson:

```css
background:
  radial-gradient(
    circle at 20% 0%,
    rgba(198,47,41,.42),
    transparent 40%
  ),
  var(--gec-crimson);
```

Charcoal:

```css
background:
  radial-gradient(
    circle at 75% 10%,
    rgba(163,4,15,.12),
    transparent 42%
  ),
  var(--gec-ink);
```

Shaders sit above/below these depending on the visual result.

---

# 28. Card Depth

Refine existing shadows rather than making them larger.

Recommended:

```css
--shadow-card-refined:
  inset 0 1px 0 rgba(255,255,255,.72),
  0 1px 2px rgba(34,34,34,.035),
  0 8px 24px rgba(34,34,34,.05);

--shadow-card-hover-refined:
  inset 0 1px 0 rgba(255,255,255,.78),
  0 2px 4px rgba(34,34,34,.04),
  0 14px 34px rgba(163,4,15,.09);
```

Avoid enormous blurry shadows.

---

# 29. Border Treatment

Current borders are part of the visual identity.

Keep them.

Improve dimensional perception through inner highlights.

Example:

```css
.surface-card-rich {
  box-shadow:
    inset 0 1px rgba(255,255,255,.75),
    var(--shadow-card);
}
```

---

# 30. Micro-Motion

Allowed:

- very slow shader flow
- slight ambient light drift
- existing hover elevation
- existing Stage Manager transition
- tiny opacity breathing in decorative background elements

Avoid:

- floating all cards
- parallax on every section
- rotating gradient blobs
- perpetual text movement
- cursor magnets everywhere
- animated borders everywhere

---

# 31. Cursor Interaction

Use cursor-reactive shader effects only in:

- hero
- one innovation/technical section

Not globally.

Target behavior:

```text
cursor moves
   ↓
field responds 10–20 px visually
   ↓
returns slowly
```

It should feel atmospheric, not like liquid following the pointer.

---

# 32. Reduced Motion

Mandatory:

```css
@media (prefers-reduced-motion: reduce) {
  .gec-shader-layer {
    /* freeze shader through JS where supported */
  }

  .ambient-motion {
    animation: none !important;
  }
}
```

JavaScript should also detect:

```js
const reduceMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

If true:

- disable cursor effects
- freeze or heavily slow shaders
- preserve static frame/background

---

# 33. Mobile Strategy

Do not assume desktop shader settings will work on mobile.

On mobile:

- remove cursor interaction
- reduce number of active shader canvases
- reduce expensive effect complexity
- prefer static texture in secondary sections
- keep hero shader
- keep maximum one additional active shader in viewport if performance drops

Suggested behavior:

```js
const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
```

Then choose lighter configurations where needed.

---

# 34. Performance Rules

## Maximum recommendation

Desktop:

```text
2–4 animated shader canvases across the page
```

Not necessarily all visible simultaneously.

Mobile:

```text
1–2 animated shaders
```

Use CSS texture elsewhere.

## Avoid

```text
1 shader per card
1 shader per team item
1 shader per partner logo
1 shader per metric
```

This would be unnecessary.

---

# 35. Lazy Initialization

Prefer initializing a shader when its section is approaching the viewport.

Use `IntersectionObserver`.

Concept:

```js
const observer = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // initialize or resume section shader
      } else {
        // pause where supported
      }
    }
  },
  {
    rootMargin: '300px'
  }
);
```

Implementation should follow the Shaders API available for the selected exported effect.

---

# 36. Pointer Events

All decorative shader canvases:

```css
pointer-events: none;
```

Shaders documentation notes that decorative canvases should not block the content.

This is critical for:

- buttons
- links
- Stage Manager cards
- nav
- form controls

---

# 37. Z-Index Strategy

Recommended:

```text
-3   base surface
-2   shader
-1   texture / atmosphere
 0   section content
10   local overlays where required
```

Do not interfere with the existing site-wide UI z-index system.

Inside each section, prefer an isolated stacking context:

```css
.has-shader {
  isolation: isolate;
}
```

---

# 38. Accessibility

Never reduce text contrast to show more shader.

Shader must be subordinate to readability.

Where necessary, place a protective overlay behind text:

```css
.shader-readable-zone {
  background:
    linear-gradient(
      90deg,
      rgba(252,248,237,.92) 0%,
      rgba(252,248,237,.72) 45%,
      rgba(252,248,237,0) 75%
    );
}
```

Only use this when needed.

---

# 39. Content Readability Threshold

Before approving a shader section, verify:

- body copy remains immediately readable
- button boundaries remain clear
- links retain contrast
- kicker remains visible
- borders are not lost
- gold accents do not disappear
- crimson remains recognizable as GEC crimson
- texture does not create false text edges

---

# 40. Design QA Checklist

For every shader:

- [ ] Does the section still look branded when paused?
- [ ] Is the GEC palette dominant?
- [ ] Is motion subtle?
- [ ] Does text remain readable?
- [ ] Does it work on a low-end laptop?
- [ ] Does it work at 390px width?
- [ ] Does reduced motion work?
- [ ] Does it avoid blocking clicks?
- [ ] Does it avoid altering section height?
- [ ] Does it avoid changing existing grid flow?
- [ ] Does it avoid creating horizontal overflow?
- [ ] Does it preserve Stage Manager behavior?
- [ ] Does it degrade gracefully if WebGPU is unavailable?

---

# 41. Graceful Fallback

The site must remain beautiful without shaders.

Every shader section needs a CSS fallback.

Example hero fallback:

```css
.hero-surface {
  background:
    radial-gradient(
      circle at 76% 22%,
      rgba(163,4,15,.10),
      transparent 34%
    ),
    radial-gradient(
      circle at 88% 72%,
      rgba(251,202,5,.07),
      transparent 28%
    ),
    #FCF8ED;
}
```

If shader initialization fails, the user still sees a finished design.

---

# 42. Implementation Class Naming

Recommended:

```text
.gec-texture-root
.gec-grain-layer
.gec-shader-layer
.gec-shader-hero
.gec-shader-crimson
.gec-shader-dark
.gec-surface-lit
.gec-card-material
.gec-type-editorial
```

Avoid generic `.effect1`, `.shader2`, etc.

---

# 43. Suggested HTML Data Attributes

```html
<section
  class="wf-section surface-cream gec-shader-host"
  data-gec-shader="hero-watercolor"
>
```

```html
<canvas
  class="gec-shader-layer"
  data-shader-canvas
  aria-hidden="true"
></canvas>
```

This enables JS to initialize shaders without restructuring content.

---

# 44. Shader Registry Pattern

Recommended developer architecture:

```js
const shaderRegistry = {
  'hero-watercolor': {
    preset: 'Watercolor on Paper',
    variant: 6,
    intensity: 'hero'
  },

  'cream-undertones': {
    preset: 'Undertones',
    variant: 4,
    intensity: 'ambient'
  },

  'crimson-liquid': {
    preset: 'Subtle Liquid',
    variant: 6,
    intensity: 'feature'
  },

  'dark-specular': {
    preset: 'Specular Lines',
    intensity: 'light'
  }
};
```

The registry is an application-level concept.

The actual Shaders.com exported component configuration should be inserted in the corresponding initializer.

---

# 45. Final Visual System

The final GEC site should have four distinct material environments.

## Cream

```text
paper
ink
warm daylight
quiet crimson atmosphere
```

## Sand

```text
archival paper
tactile fibre
warm physical material
```

## Crimson

```text
pigment
energy
red-on-red movement
strong institutional identity
```

## Charcoal

```text
technical
future-facing
subtle light trails
measured digital energy
```

These environments create visual rhythm without layout changes.

---

# 46. Final Recommended Implementation Priority

## Phase 1 — Typography

- refine headline case usage
- refine tracking
- refine line-height
- strengthen editorial hierarchy
- preserve font families

## Phase 2 — Static texture

- global grain
- cream light
- sand fibre
- card highlights
- refined shadows

## Phase 3 — Hero shader

Implement and tune one excellent hero shader first.

Recommended:

**Watercolor on Paper 6**

Do not add additional shaders until this one feels integrated.

## Phase 4 — Crimson shader

Add:

**Subtle Liquid 6/7**

## Phase 5 — Dark shader

Add:

**Specular Lines**

Only if it meaningfully improves the dark section.

## Phase 6 — Optimization

- mobile reduction
- intersection-based activation
- reduced motion
- shader fallback
- performance testing

---

# 47. Immediate Developer Instruction

Use the following instruction when handing the HTML to the implementation agent:

> Enhance the supplied GEC HTML visually without changing its layout, DOM hierarchy, element placement, responsive structure, card dimensions, grid definitions, Stage Manager geometry, or interaction flow. Treat the current composition as frozen. Improve only typography rendering, material texture, background lighting, card surface depth, shadows, grain, and selective shader backgrounds.
>
> Integrate Shaders.com effects only as absolutely positioned decorative canvas layers behind existing section content. Use `pointer-events: none` and isolated stacking contexts so no canvas interferes with existing UI. The primary visual candidates are Watercolor on Paper for the hero, Undertones for low-intensity cream atmosphere, Subtle Liquid for red-on-red crimson motion, Specular Lines for charcoal innovation sections, and Static Noise for material grain.
>
> Recolor every shader to the existing GEC palette. Do not preserve the preset's default color palette merely because it looks attractive. Avoid neon, purple, cyan, rainbow, chrome, high-contrast liquid effects, or visually aggressive WebGPU motion.
>
> Preserve all existing transforms and Stage Manager behavior exactly. The final website should feel richer and more tactile, but a DOM/layout diff should show no intentional structural redesign.

---

# 48. Acceptance Criteria

The task is complete only when:

```text
LAYOUT
✓ unchanged

ELEMENT POSITIONS
✓ unchanged

STAGE MANAGER
✓ unchanged

RESPONSIVE LOGIC
✓ unchanged

TYPOGRAPHY
✓ more editorial

CREAM SURFACES
✓ material / paper depth

SAND SURFACES
✓ tactile

CRIMSON
✓ alive but controlled

CHARCOAL
✓ technical depth

CARDS
✓ less flat

SHADERS
✓ selective

MOTION
✓ subtle

MOBILE
✓ performant

ACCESSIBILITY
✓ preserved

FALLBACK
✓ visually complete
```

---

# 49. One-Sentence Art Direction

> **Make GEC feel like a premium entrepreneurial journal that happens to be alive on the web—not an HTML wireframe and not a shader demo.**

