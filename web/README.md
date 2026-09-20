# Galgotias Entrepreneurship Cell (GEC) — Web Platform

Modern Next.js 16 (React 19, Tailwind CSS v4, TypeScript) frontend for the Galgotias Entrepreneurship Cell, featuring the zero-lag **Brand Entrance Curtain** with the refined 72-frame smooth bulb glow and GPU-accelerated FLIP docking into the sticky topbar logo.

---

## ⚡ Key Architectural Features

### 1. Zero-Lag Brand Entrance Curtain (`BrandEntranceCurtain.tsx`)
- **60fps Native Vector SVG Animation:** Renders vector math directly via `requestAnimationFrame` with zero external video bandwidth and 100% retina clarity across mobile and desktop devices.
- **Refined 72-Frame Smooth Bulb Glow (Frames 245–336):**
  - **12-Frame Eased Attack:** Gradual filament ignition eliminating harsh brightness pops.
  - **Two Broad Rounded Sine Pulses:** Harmonic breathing glow.
  - **30% Steady Hold (Frames 317–324):** Restrained, elegant filament glow.
  - **Fade to Raw Logo (Frames 324–336):** Seamlessly dissolves effect overlays and transitions bulb reflection and filament from electric amber (`#ffcc00`/`#ffe066`) back to brand red (`#c43128`).
  - **Continuous Color Interpolation & Soft Filter Duplicate:** Fades glow opacity continuously without abrupt SVG filter toggles.
- **Hardware-Accelerated FLIP Docking (Frame 336 / 5.60s):**
  - Uses `getBoundingClientRect()` to compute exact translation vector (`deltaX`, `deltaY`) and scale factor (`scale`) from viewport center to `#navbar-brand-logo` in the sticky topbar.
  - Animates solely on the GPU compositor thread: `transform: translate3d(...) scale(...)`.
  - Theatrical split curtain opens simultaneously (top panel slides up `-100%`, bottom panel slides down `100%`).
  - Clean unmounting: removes the curtain and flight overlay completely after docking completes (zero idle CPU/GPU usage).
- **Session Storage & Accessibility:**
  - `sessionStorage.getItem('gec_intro_seen')` ensures the intro runs once per browser session.
  - `@media (prefers-reduced-motion: reduce)` immediately bypasses the intro and displays the docked logo with 0ms delay.
  - Includes a "Skip Intro" button during flight and a "Replay Intro" button in the navigation header.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── globals.css              # GEC Semantic Design System Tokens & reset
│   │   ├── layout.tsx               # Root layout rendering Curtain + Navbar
│   │   └── page.tsx                 # Editorial Hero & Initiatives landing page
│   ├── components/
│   │   ├── BrandEntranceCurtain.tsx # Fullscreen curtain, 72-frame glow & FLIP morph
│   │   └── Navbar.tsx               # Sticky glassmorphism header with #navbar-brand-logo
│   └── lib/
│       └── logoData.ts              # Exact vector geometries, centers, and colors
├── next.config.ts                   # Turbopack and build configuration
├── package.json
└── tsconfig.json
```

---

## 🎨 Semantic Color Tokens (Frozen GEC Palette)

- **Canvas Background:** `#FCF8ED` (Brand Warm Cream)
- **Card Surface:** `#FFFDF8`
- **Brand Crimson:** `#A3040F` (Active Hover: `#C62F29`)
- **Brand Gold:** `#FBCA05`
- **Brand Blue:** `#1F7EC0`
- **Charcoal Ink:** `#222222`
- **Muted Ink:** `#5F5650`
