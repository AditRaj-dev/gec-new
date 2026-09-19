# Galgotias Entrepreneurship Cell (GEC) - Logo Intro Animation

A motion-designed brand intro animation built with **Remotion** and designed for the **Galgotias Entrepreneurship Cell** website.

---

## Visual Choreography Overview

1. **Hero Multi-Component 'G' Assembly (Frames 0–50)**:
   - The multi-component **'G'** is the focal centerpiece of the intro.
   - **Outer Red Arc** (`Asset 312`): Swoops in from the top-left outer perimeter with dynamic spring physics (`damping: 14, stiffness: 85`).
   - **Yellow Crescent** (`Asset 311`): Sweeps up in a curved arc from bottom-left, settling snugly into the red curve.
   - **Blue Crescent** (`Asset 310`): Swoops down from the top, locking into the inner fold.
   - **Saraswati Emblem** (`Asset 309`, 224 vectors): Zooms and unfolds at the sacred core of the 'G', emitting a golden pulse shockwave.

2. **Transition & Letters 'E' & 'C' Arrival (Frames 52–90)**:
   - The assembled 'G' glides smoothly to its resting position on the left.
   - **Letter 'E'** (`Asset 313`): Slides in with authoritative spring timing.
   - **Letter 'C'** (`Asset 308`): Slides in from the far right.
   - **Innovation Lightbulb Spark**: As 'C' docks into place, the lightbulb cutout illuminates with an ambient amber glow and bright filament spark, symbolizing student entrepreneurship and innovative ideas.

3. **Subtitle Reveal & Brand Shimmer (Frames 85–180)**:
   - **"GALGOTIAS ENTREPRENEURSHIP CELL"**: Cascades into view with a staggered wave reveal.
   - A diagonal light shimmer beam sweeps across the completed logo.
   - Logo breathes with a subtle scale pulse and settles into crisp clarity.

---

## File Structure

```
E:\GEC/
├── out/
│   ├── logo-intro.mp4                 # 1080p 60fps MP4 video (1.04 MB)
│   ├── logo-intro-transparent.webm    # Transparent alpha WebM video (425 KB)
│   ├── frame-180.png                  # Final assembled resting state
│   ├── hero-g-frame-35.png            # In-flight multi-component G convergence
│   ├── hero-g-frame-65.png            # Gliding G transition with E & C
│   └── hero-g-frame-95.png            # Bulb ignition and subtitle reveal
├── src/
│   ├── LogoAnimation.tsx              # Remotion Composition (useCurrentFrame, spring)
│   ├── WebsiteLoader.tsx              # Standalone React Preloader Component
│   ├── Root.tsx                       # Remotion Root (Light, Dark, Square, Transparent)
│   ├── logoData.ts                    # Extracted vector paths & coordinate anchors
│   └── index.ts                       # Entry point
├── demo.html                          # Interactive browser preview & timeline scrubber
├── remotion.config.ts                 # Remotion CLI configuration
├── package.json                       # Scripts and dependencies
└── tsconfig.json                      # TypeScript configuration
```

---

## Quick Start & Usage

### 1. Interactive Browser Preview
Double click [`demo.html`](file:///E:/GEC/demo.html) in Windows Explorer to open the interactive player in any browser. You can scrub through every frame, toggle dark/light modes, adjust playback speed, and simulate the website load transition.

### 2. Remotion Studio (Live Editor)
Launch the interactive Remotion Studio web interface:
```bash
npm start
```
Opens [http://localhost:3000](http://localhost:3000) with a live timeline, inspector, and audio/video controls.

### 3. Rendering Videos
Render high-resolution video exports anytime:
```bash
# Render 1080p MP4 (Default light theme)
npm run render

# Render transparent WebM for website overlays
npm run render:webm

# Render dark theme 1080p MP4
npx remotion render LogoAnimationDark out/logo-intro-dark.mp4

# Render square format (1080x1080) for social media / mobile splash
npx remotion render LogoAnimationSquare out/logo-intro-square.mp4
```

### 4. Embedding Directly into Your Website (React / Next.js)
To use this as the splash screen that shows when your website first loads:

```tsx
import React, { useState } from 'react';
import { WebsiteLoader } from './src/WebsiteLoader';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <WebsiteLoader
          theme="light"
          durationMs={3500}
          autoDismiss={true}
          dismissDelayMs={500}
          onComplete={() => setLoading(false)}
        />
      )}

      {/* Your actual website content */}
      <main>
        <h1>Welcome to Galgotias Entrepreneurship Cell</h1>
      </main>
    </>
  );
}
```
