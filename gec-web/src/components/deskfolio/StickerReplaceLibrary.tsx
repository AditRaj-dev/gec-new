/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'motion/react'

export const ITM = '/stickers/items/'
export const POLAROID_SRC = '__component:polaroid'
export const IPOD_SRC = '__component:ipod'
export const NAME_TAG_SRC = '__component:name-tag'

export const STICKER_CATEGORIES: Array<{ id: string; name: string; files: string[] }> = [
  {
    id: 'cute',
    name: 'Cute',
    files: [
      'sticker-cutie-kirby.png',
      'sticker-cutie-chick.svg',
      'sticker-cutie-pig.svg',
      'sticker-cutie-snail.svg',
      'sticker-cutie-sneaker.svg',
      'sticker-cutie-bear.svg',
      'sticker-cutie-cat-rawr.svg',
      'sticker-cutie-cat-wiggle.svg',
      'sticker-cutie-cat-meow.svg',
      'sticker-cutie-sleepy-kitty.svg',
      'sticker-cutie-sleepy-bunny.svg',
      'sticker-cutie-unicorn-float.svg',
      'sticker-cutie-apple.svg',
      'sticker-cutie-cherry-mug.svg',
      'sticker-cutie-rocket.svg',
      'sticker-cutie-gift.svg',
      'sticker-cutie-flower-smile.svg',
      'sticker-cutie-tulip-heart.svg',
      'sticker-cutie-heart-thanks.svg',
      'sticker-cutie-heart-mend.svg',
      'sticker-cutie-rainbow-cloud.svg',
      'sticker-cutie-poppies.svg',
      'sticker-cutie-gameboy.svg',
      'sticker-cute-pop-cat-face.svg',
      'sticker-cute-pop-fox-face.svg',
      'sticker-cute-pop-koi-fish.svg',
      'sticker-cute-pop-reindeer.svg',
      'sticker-cute-pop-skull.svg',
      'sticker-cute-pop-unicorn.svg',
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    files: [
      'sticker-desk-0.svg', 'sticker-desk-1.svg', 'sticker-desk-2.svg', 'sticker-desk-3.svg',
      'sticker-desk-4.svg', 'sticker-desk-5.svg', 'sticker-desk-6.svg', 'sticker-journal-0.svg',
      'sticker-journal-1.svg', 'sticker-journal-3.svg', 'sticker-stationery-0.svg', 'sticker-stationery-1.svg',
      'sticker-stationery-2.svg', 'sticker-stationery-5.svg', 'sticker-stationery-6.svg', 'sticker-stationery-7.svg',
      'sticker-stationery-9.svg', 'sticker-stationery-10.svg',
    ],
  },
  {
    id: 'plants',
    name: 'Plants',
    files: ['sticker-plant-1.svg', 'sticker-plant-2.svg', 'sticker-plant-succulent.svg', 'sticker-cute-pop-cactus.svg'],
  },
  {
    id: 'desk',
    name: 'Desk',
    files: ['sticker-keyboard.svg', 'sticker-desk-7.svg', 'sticker-desk-8.svg', 'sticker-desk-9.svg', 'sticker-journal-2.svg', 'sticker-stationery-3.svg', 'sticker-stationery-4.svg', 'sticker-matcha-cup.png'],
  },
  {
    id: 'dev',
    name: 'Dev',
    files: [
      'sticker-dev-react.svg',
      'sticker-dev-typescript.svg', 'sticker-dev-typescript-outline.svg',
      'sticker-dev-javascript.svg', 'sticker-dev-javascript-outline.svg',
      'sticker-dev-html.svg', 'sticker-dev-html-outline.svg',
      'sticker-dev-python.svg', 'sticker-dev-python-outline.svg',
      'sticker-dev-github.svg', 'sticker-dev-github-outline.svg',
      'sticker-dev-figma.png',
      'sticker-dev-cpp.png', 'sticker-dev-tailwind.png', 'sticker-dev-w3css.png', 'sticker-dev-nextjs.png',
    ],
  },
]

export const CAT_OF = new Map<string, string>()
export const STICKER_LIBRARY: string[] = []
STICKER_CATEGORIES.forEach((c) =>
  c.files.forEach((f) => {
    const src = ITM + f
    CAT_OF.set(src, c.id)
    STICKER_LIBRARY.push(src)
  }),
)
CAT_OF.set(POLAROID_SRC, 'stationery')
STICKER_LIBRARY.push(POLAROID_SRC)
CAT_OF.set(IPOD_SRC, 'desk')
STICKER_LIBRARY.push(IPOD_SRC)
CAT_OF.set(NAME_TAG_SRC, 'stationery')
STICKER_LIBRARY.push(NAME_TAG_SRC)

export const LIB_TABS = STICKER_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))

export function stickerTitle(src: string) {
  return src === POLAROID_SRC
    ? 'polaroid'
    : src === IPOD_SRC
      ? 'iPod'
      : src === NAME_TAG_SRC
        ? 'name tag'
        : src.split('/').pop()?.replace('sticker-', '').replace(/\.(svg|png)$/, '')
}

export function StickerTile({ src }: { src: string }) {
  if (src === POLAROID_SRC)
    return (
      <svg className="df-lib-polaroid" viewBox="0 0 40 36" aria-hidden="true">
        <rect x="4" y="6" width="32" height="26" rx="5" fill="#f6f4ef" stroke="#d8d2c8" />
        <rect x="4" y="6" width="32" height="6" rx="3" fill="#eceae4" />
        <rect x="27" y="9" width="6" height="2.6" rx="1.3" fill="#e15b5b" />
        <rect x="8" y="9.2" width="4" height="3" rx="1" fill="#cfd6db" />
        <circle cx="20" cy="21" r="7.5" fill="#2c2f33" />
        <circle cx="20" cy="21" r="4.4" fill="#5b6168" />
        <circle cx="18" cy="19" r="1.5" fill="#aeb6bd" />
      </svg>
    )
  if (src === IPOD_SRC)
    return (
      <svg className="df-lib-ipod" viewBox="0 0 40 56" aria-hidden="true">
        <rect x="9" y="3" width="22" height="50" rx="4.5" fill="#f7f7f5" stroke="#d8d8d3" />
        <rect x="12" y="8" width="16" height="16" rx="1.8" fill="#d7daf9" stroke="#4b4e66" strokeWidth="0.8" />
        <rect x="14" y="11" width="8" height="1.4" rx="0.7" fill="#4b4e66" opacity="0.75" />
        <rect x="14" y="14" width="11" height="1.2" rx="0.6" fill="#4b4e66" opacity="0.45" />
        <rect x="14" y="17" width="10" height="1.2" rx="0.6" fill="#4b4e66" opacity="0.45" />
        <circle cx="20" cy="38" r="10" fill="#dedede" stroke="#c8c8c8" />
        <circle cx="20" cy="38" r="4.2" fill="#fff" stroke="#d4d4d4" />
        <path d="M15 38h2.2M22.8 38H25M20 33v1.8M20 41.2v1.8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  if (src === NAME_TAG_SRC)
    return <img className="df-lib-name-tag" src="/stickers/items/hello-name-tag.svg" alt="" width={40} height={26} draggable={false} loading="lazy" decoding="async" />
  return <img src={src} alt="" width={40} height={40} draggable={false} loading="lazy" decoding="async" />
}

export interface StickerReplaceLibraryProps {
  tableSrcs: Set<string>
  initialCategory?: string
  reduce: boolean
  onSelect: (src: string) => void
}

export function StickerReplaceLibrary({
  tableSrcs,
  initialCategory,
  reduce,
  onSelect,
}: StickerReplaceLibraryProps) {
  const [libCat, setLibCat] = useState(() => initialCategory ?? LIB_TABS[0].id)
  const libItems = useMemo(() => STICKER_LIBRARY.filter((src) => !tableSrcs.has(src)), [tableSrcs])
  const catItems = useMemo(() => libItems.filter((src) => CAT_OF.get(src) === libCat), [libItems, libCat])
  const LIB_TILE = 46
  const libCols = Math.min(6, Math.max(1, catItems.length))

  return (
    <div className="df-matmenu-lib">
      {catItems.length === 0 ? (
        <p className="df-matmenu-lib-empty">Nothing here that isn&apos;t already on the desk ✨</p>
      ) : (
        <motion.div
          key={libCat}
          className="df-matmenu-lib-grid"
          style={{ gridTemplateColumns: `repeat(${libCols}, ${LIB_TILE}px)` }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {catItems.map((src) => (
            <button
              type="button"
              key={src}
              className="df-matmenu-lib-item"
              title={stickerTitle(src)}
              onClick={() => onSelect(src)}
            >
              <StickerTile src={src} />
            </button>
          ))}
        </motion.div>
      )}
      <div className="df-matmenu-tabs" role="tablist" aria-label="Sticker categories">
        {LIB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === libCat}
            className={t.id === libCat ? 'df-matmenu-tab is-active' : 'df-matmenu-tab'}
            onClick={() => setLibCat(t.id)}
          >
            {t.id === libCat && (
              <motion.span
                className="df-matmenu-tab-bg"
                layoutId="df-matmenu-tab-bg"
                transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="df-matmenu-tab-label">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
