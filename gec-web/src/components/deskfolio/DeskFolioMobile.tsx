/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { DeskFolio } from './DeskFolio'
import { GEC_BOOKS, GEC_MAT_THEMES } from './gecBooksData'
import './deskfolio.css'
import './gec-editorial.css'

const ITM = '/stickers/items/'

const MOBILE_STICKER_POOL = [
  'sticker-cutie-bear.svg', 'sticker-cutie-chick.svg', 'sticker-cutie-pig.svg', 'sticker-cutie-snail.svg',
  'sticker-cutie-cat-meow.svg', 'sticker-cutie-cat-wiggle.svg', 'sticker-cutie-sleepy-bunny.svg',
  'sticker-cutie-sleepy-kitty.svg', 'sticker-cutie-rainbow-cloud.svg', 'sticker-cutie-unicorn-float.svg',
  'sticker-cutie-flower-smile.svg', 'sticker-cutie-gift.svg', 'sticker-cutie-rocket.svg', 'sticker-cutie-apple.svg',
  'sticker-cutie-cherry-mug.svg', 'sticker-cutie-poppies.svg', 'sticker-cutie-tulip-heart.svg',
  'sticker-cutie-gameboy.svg', 'sticker-cutie-sneaker.svg', 'sticker-plant-succulent.svg', 'sticker-plant-2.svg',
]

function pickMobileStickers(): [string, string] {
  const a = MOBILE_STICKER_POOL[Math.floor(Math.random() * MOBILE_STICKER_POOL.length)]
  const rest = MOBILE_STICKER_POOL.filter((s) => s !== a)
  const b = rest[Math.floor(Math.random() * rest.length)]
  return [a, b]
}

const STAGE_SPRING = { type: 'spring', bounce: 0.22, duration: 0.55 } as const

export function DeskFolioMobile() {
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 390 : window.innerWidth,
    h: typeof window === 'undefined' ? 844 : window.innerHeight,
  }))

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const next = { w: window.innerWidth, h: window.innerHeight }
      setViewport((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
    }
    const on = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('resize', on)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const reduce = useReducedMotion()
  const [intro] = useState(3)

  const M_PAGE_W = 380
  const M_PAGE_H = 509
  const mRightW = Math.min(viewport.w * 0.8, (viewport.h * 0.5) / 1.34)
  const mScale = mRightW / M_PAGE_W
  const mobile = { pageW: M_PAGE_W, pageH: M_PAGE_H, scale: mScale, w: Math.round(mRightW), h: Math.round(mRightW * 1.34) }

  const bgTheme = GEC_MAT_THEMES.find((theme) => theme.id === 'gec-crimson') ?? GEC_MAT_THEMES[0]
  const activeBook = GEC_BOOKS.find((b) => b.id === 'incubation') ?? GEC_BOOKS[0]
  const [mStickers] = useState<[string, string]>(() => pickMobileStickers())

  const cover = activeBook.cover
  const mobilePages = useMemo(() => {
    const out: React.ReactNode[] = []
    for (const p of activeBook.pages) {
      out.push(null)
      out.push(p)
    }
    return out
  }, [activeBook.pages])

  return (
    <section className="deskfolio-live">
      <div
        className="demo-stage deskfolio-demo-stage"
        style={
          {
            '--df-picker-w': `${mobile.w}px`,
            '--df-stage-scale': 1,
            ...bgTheme.style,
          } as React.CSSProperties
        }
      >
        {intro >= 2 && (
          <div className="df-mstickers" aria-hidden="true">
            <img className="m3" src={ITM + mStickers[0]} alt="" width={96} height={96} loading="lazy" decoding="async" />
            <img className="m4" src={ITM + mStickers[1]} alt="" width={104} height={104} loading="lazy" decoding="async" />
          </div>
        )}

        <motion.div
          className="df-book-bloom df-book-bloom--mobile"
          initial={false}
          animate={
            reduce
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: intro >= 1 ? 1 : 0, y: intro >= 1 ? 0 : 12, scale: intro >= 1 ? 1 : 0.94 }
          }
          transition={reduce ? { duration: 0 } : STAGE_SPRING}
        >
          <div className="df-mobile-scaler" style={{ width: mobile.w, height: mobile.h }}>
            <div className="df-mobile-scaler-inner" style={{ transform: `scale(${mobile.scale})`, left: -mobile.w }}>
              <DeskFolio
                cover={cover}
                pages={mobilePages}
                closeOnEnd={true}
                closedShift="0%"
                pageWidth={mobile.pageW}
                pageHeight={mobile.pageH}
                virtualizePages={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
