# DeskFolio — Interactive 3D Desk & Publication Experience
**Locked State Version: v1.0.0 (`deskfolio-locked-v1`)**

This component delivers the signature GEC tactile cutting mat workspace featuring 4 interactive archival books, calibrated desktop objects, realistic 3D page flip physics, direct book switching, smooth flight transitions, and ambient lighting.

---

## 🚀 Quick Integration into the Main Website

### 1. Full Desk Scene (Recommended for Hero or Showcase Section)
To drop the complete interactive desk workspace (with the cutting mat, 4 miniature books, stickers, draggable items, and desk lamp) into the main website:

```tsx
import { DeskFolioPage } from '@/components/deskfolio'

export default function HeroSection() {
  return (
    <section className="w-full relative overflow-hidden bg-[#111113]">
      <DeskFolioPage />
    </section>
  )
}
```

*Note: `DeskFolioPage` automatically handles client-side dynamic loading (`ssr: false`) and renders a dark skeleton during hydration to prevent SSR mismatch.*

---

### 2. Standalone Modular FlipBook
If you only need a single interactive 3D book (for example, inside an Initiatives modal, dossier viewer, or about section):

```tsx
import { DeskFolio, GEC_BOOKS } from '@/components/deskfolio'

export function PublicationViewer({ bookId = 'incubation' }: { bookId?: string }) {
  const book = GEC_BOOKS.find((b) => b.id === bookId) ?? GEC_BOOKS[0]

  return (
    <div className="w-full flex justify-center py-12">
      <DeskFolio
        cover={book.cover}
        pages={book.pages}
        backCover={book.backCover}
        pageWidth={350}
        pageHeight={483}
        autoOpen={false}
        closeOnEnd={true}
        virtualizePages={true}
      />
    </div>
  )
}
```

---

## 📐 Layout & Geometry Specification

- **Base Cutting Mat Size**: 1400px × 720px (`STAGE_BASE_W` × `STAGE_BASE_H`)
- **Center Open Spread Size**: 700px × 483px (Two 350px × 483px pages)
- **Miniature Desk Books Size**: 92px × 122px (`MINI_BOOK_SIZE`)
- **Resting Book Coordinates**:
  - `incubation`: `{ x: 82, y: 145, rotate: -5 }`
  - `summit`: `{ x: 1085, y: 290, rotate: 4 }`
  - `handbook`: `{ x: 242, y: 558, rotate: 3 }`
  - `founders`: `{ x: 1060, y: 588, rotate: -4 }`
- **Center Target Coordinates**: `{ x: 525, y: 118.5, width: 350, height: 483, rotate: 0 }`

---

## 📚 Included Publications

1. **Venture Incubation Dossier** (`incubation`): GEC crimson theme, 8 pages covering cohorts, funding mandates, incubator perks, and EIR network.
2. **E-Summit '26 Conclave Blueprint** (`summit`): Flagship venture-blue theme, 8 pages covering keynotes, startup arena, hackathons, and investor tracks.
3. **Innovator's Field Handbook** (`handbook`): Parchment ivory theme with crimson spine, 8 pages covering customer discovery, product-market fit, and sprint models.
4. **Wall of Founders** (`founders`): Obsidian charcoal & gold theme, 8 pages documenting alumni venture scale and institutional backing.

---

## 🎨 Key Features & Interaction Engine

- **Smooth 3D Book Closing**: Clicking `✕ Close [Esc]`, pressing <kbd>Escape</kbd>, or clicking the desk backdrop smoothly folds sheet 0 shut in 3D before floating back to its calibrated resting slot.
- **Full-to-Mini Cover Morphing**: Powered by `FlightCoverArtwork`, the cover scales synchronously with the flight container and cross-fades between full and mini typography so touchdown on the desk is 100% pixel-perfect.
- **Direct Book Switching**: While reading one book, clicking any other mini book directly departs the current volume and opens the new one without manual closing.
- **Interactive Desk Lamp**: Toggled by clicking either the lamp fixture or the handwritten `"tap to light it!"` hint. Casts an angled SVG beam and warm room lighting.
- **Cutting Mat Themes**: Supports GEC Crimson (`gec-crimson`), Obsidian (`gec-obsidian`), Blueprint (`gec-blueprint`), and Parchment (`gec-parchment`).
- **Responsive Auto-Scaling**: Scales smoothly via `stageScale = Math.min(1, Math.max(0.24, availableW / 1400))` down to mobile screens while preserving identical desk item coordinates and aspect ratio.

---

## 🔒 Locked State Verification
- **TypeScript**: `npx tsc --noEmit` — 0 errors
- **Production Build**: `npm run build` — 0 errors
- **Git Tag**: `deskfolio-locked-v1`
