'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, motionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import './deskfolio.css'

// draggable flip-book, cover is sheet[0]
//
// sheets hinge on spine, rotateY 0 to -180; two faces per sheet
//
// parent owns rotation values so drag drives the active page

export type DeskFolioProps = {
  /* front cover */
  cover: React.ReactNode
  /* inner pages, reading order */
  pages: React.ReactNode[]
  /* optional back cover */
  backCover?: React.ReactNode
  /* close instead of showing blank end leaf */
  closeOnEnd?: boolean
  /* page width px */
  pageWidth?: number
  /* page height px */
  pageHeight?: number
  /* initial spread, 0 = closed */
  initialSpread?: number
  /* fires after a turn settles */
  onTurn?: (turned: number) => void
  className?: string
  /* root inline style */
  style?: React.CSSProperties
  /* closed-book offset (translateX) */
  closedShift?: string
  /* decorative instances can disable paging, focus, and page-corner motion */
  interactive?: boolean
  /* accessible name for the interactive book */
  label?: string
  /* virtualize distant sheets to reduce DOM footprint and React work */
  virtualizePages?: boolean
  /* automatically open the front cover */
  autoOpen?: boolean
  /* delay in ms before auto-opening the cover */
  autoOpenDelay?: number
  /* trigger closing flip from parent */
  closeRequested?: boolean
  /* fires when book has settled closed */
  onClose?: () => void
}

// springs
// COVER_SPRING: Stately, weighted, luxurious opening and closing of hardcovers
const COVER_SPRING = { type: 'spring', stiffness: 68, damping: 16.5, mass: 1.1 } as const

// BLOOM_SPRING: Smooth lateral translation as the book unfolds into spread mode
const BLOOM_SPRING = { type: 'spring', stiffness: 68, damping: 16.5, mass: 1.1 } as const

// FLIP_SPRING: Responsive yet smooth paper page flips for inner spreads
const FLIP_SPRING = { type: 'spring', stiffness: 115, damping: 19, mass: 0.9 } as const

const PEEK_SPRING = { type: 'spring', bounce: 0.38, duration: 0.38 } as const
const PEEK_ANGLE = -13 // corner lift on hover

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

type Sheet = {
  front: React.ReactNode
  back: React.ReactNode
  frontHard: boolean
  backHard: boolean
}

// build double-sided sheets
function buildSheets(cover: React.ReactNode, pages: React.ReactNode[], backCover?: React.ReactNode): Sheet[] {
  const faces: Array<{ node: React.ReactNode; hard: boolean }> = [{ node: cover, hard: true }]
  for (const p of pages) faces.push({ node: p, hard: false })
  if (backCover !== undefined) {
    if (faces.length % 2 === 1) faces.push({ node: null, hard: false }) // pad backCover to a back face
    faces.push({ node: backCover, hard: true })
  }
  if (faces.length % 2 === 1) faces.push({ node: null, hard: false }) // pad to whole sheets
  const sheets: Sheet[] = []
  for (let i = 0; i < faces.length; i += 2) {
    sheets.push({
      front: faces[i].node,
      back: faces[i + 1].node,
      frontHard: faces[i].hard,
      backHard: faces[i + 1].hard,
    })
  }
  return sheets
}

export function DeskFolio({
  cover,
  pages,
  backCover,
  closeOnEnd = false,
  pageWidth = 380,
  pageHeight = 510,
  initialSpread = 0,
  onTurn,
  className,
  style,
  closedShift = '-25%',
  interactive = true,
  label = 'A little book — drag a corner, tap a side, or use the arrow keys to turn the pages',
  virtualizePages = false,
  autoOpen = false,
  autoOpenDelay = 120,
  closeRequested = false,
  onClose,
}: DeskFolioProps) {
  const reduce = useReducedMotion()
  const sheets = useMemo(() => buildSheets(cover, pages, backCover), [cover, pages, backCover])
  const max = sheets.length
  // last navigable spread (closeOnEnd)
  let lastSpread = max
  if (closeOnEnd) {
    lastSpread = Math.max(0, max - 1)
    while (lastSpread > 0 && sheets[lastSpread]?.front == null) lastSpread--
  }

  const [turned, setTurned] = useState(() => Math.max(0, Math.min(initialSpread, max)))
  const [turning, setTurning] = useState<number | null>(null) // sheet mid-spring
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null) // sheet being dragged
  const [peekIndex, setPeekIndex] = useState<number | null>(null)

  const open = turned > 0
  const locked = turning !== null || draggingIndex !== null

  // one rotation MotionValue per sheet created safely via useMemo without ref access in render
  const rots = useMemo(() => {
    return Array.from({ length: max }, (_, i) => motionValue(i < initialSpread ? -180 : 0))
  }, [max, initialSpread])

  const rootRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ active: number; dir: 'fwd' | 'back'; startX: number; pageW: number; follow: boolean; moved: boolean; turnZone: boolean; close: boolean } | null>(null)
  const lastTurnAt = useRef(0) // double-tap cooldown

  const coolingDown = () => {
    const now = performance.now()
    if (now - lastTurnAt.current < 280) return true
    lastTurnAt.current = now
    return false
  }

  const commitNext = useCallback(() => {
    if (locked) return
    if (closeOnEnd && turned >= lastSpread) {
      if (turned > 0 && !coolingDown()) {
        setTurning(0) // close on last spread
        setTurned(0)
      }
      return
    }
    if (turned >= max || coolingDown()) return
    setTurning(turned)
    setTurned(turned + 1)
  }, [locked, turned, max, closeOnEnd, lastSpread])

  const commitPrev = useCallback(() => {
    if (locked || turned <= 0 || coolingDown()) return
    setTurning(turned - 1)
    setTurned(turned - 1)
  }, [locked, turned])

  const handleRest = useCallback((index: number) => {
    setTurning((t) => (t === index ? null : t))
  }, [])

  const handlePeek = useCallback((index: number, on: boolean) => {
    setPeekIndex((cur) => (on ? index : cur === index ? null : cur))
  }, [])

  const autoOpenTriggeredRef = useRef(false)
  useEffect(() => {
    if (!autoOpen) {
      autoOpenTriggeredRef.current = false
      return
    }
    if (autoOpenTriggeredRef.current || turned !== 0) return
    const timer = window.setTimeout(() => {
      autoOpenTriggeredRef.current = true
      setTurning(0)
      setTurned(1)
    }, autoOpenDelay)
    return () => window.clearTimeout(timer)
  }, [autoOpen, autoOpenDelay, turned])

  const wasOpenedRef = useRef(false)
  useEffect(() => {
    if (turned > 0) {
      wasOpenedRef.current = true
    } else if (turned === 0 && turning === null && wasOpenedRef.current) {
      wasOpenedRef.current = false
      onClose?.()
    }
  }, [turned, turning, onClose])

  // Handle parent-directed close request
  useEffect(() => {
    if (closeRequested) {
      if (turned > 0) {
        setTurning(0)
        setTurned(0)
      } else if (turned === 0 && turning === null) {
        onClose?.()
      }
    }
  }, [closeRequested, turned, turning, onClose])

  useEffect(() => {
    if (!locked) onTurn?.(turned)
  }, [locked, turned, onTurn])

  useEffect(() => {
    if (!interactive || !open || locked) return
    const closeOnEscape = (e: KeyboardEvent) => {
      const el = e.target instanceof Element ? e.target : null
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key !== 'Escape') return
      e.preventDefault()
      if (turned > 0) {
        setTurning(0)
        setTurned(0)
      } else if (turned === 0 && turning === null) {
        onClose?.()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [interactive, open, locked, turned, turning, onClose])

  // direct manipulation
  // cover opens on release; inner sheets follow live
  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive || locked) return
    const el = e.target as HTMLElement
    if (el.closest('[contenteditable="true"], button, a, input, textarea, select')) return // let edit/select happen
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return
    const spine = rect.left + rect.width / 2
    const fx = (e.clientX - rect.left) / rect.width
    let active: number
    let dir: 'fwd' | 'back'
    if (!open || e.clientX >= spine) {
      if (turned >= max) return
      active = turned
      dir = 'fwd'
    } else {
      if (turned <= 0) return
      active = turned - 1
      dir = 'back'
    }
    // forward on last spread closes the book
    const close = closeOnEnd && dir === 'fwd' && turned >= lastSpread
    // tap only turns from corner or outer margin
    const onCorner = !!el.closest('.deskfolio-corner')
    const turnZone = close || onCorner || (dir === 'fwd' ? fx > 0.86 : fx < 0.14)
    drag.current = { active, dir, startX: e.clientX, pageW: rect.width / 2, follow: !close && active >= 1, moved: false, turnZone, close }
    setDraggingIndex(active)
    // cancel superseded animation when direct pointer manipulation begins
    rots[active]?.stop()
    try {
      rootRef.current?.setPointerCapture(e.pointerId)
    } catch {
      /* not all targets support capture */
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    if (Math.abs(e.clientX - d.startX) > 10) d.moved = true
    if (!d.follow) return // cover opens on release
    const p =
      d.dir === 'fwd' ? clamp((d.startX - e.clientX) / d.pageW, 0, 1) : clamp((e.clientX - d.startX) / d.pageW, 0, 1)
    rots[d.active].set(d.dir === 'fwd' ? -180 * p : -180 + 180 * p)
  }

  const finishDrag = (e: React.PointerEvent, cancelled: boolean) => {
    const d = drag.current
    if (!d) return
    drag.current = null
    try {
      rootRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    setDraggingIndex(null)
    if (cancelled) {
      rots[d.active]?.stop()
      return
    }
    const turn = (dir: 'fwd' | 'back') => {
      if (coolingDown()) return
      if (dir === 'fwd' && d.close) {
        if (turned > 0) {
          setTurning(0) // close on last spread
          setTurned(0)
        }
        return
      }
      setTurning(d.active)
      if (dir === 'fwd') setTurned((t) => Math.min(max, t + 1))
      else setTurned((t) => Math.max(0, t - 1))
    }

    // moved inner page: commit past halfway, else spring back
    if (d.follow && d.moved) {
      const cur = rots[d.active].get()
      if (d.dir === 'fwd' ? cur <= -90 : cur >= -90) turn(d.dir)
      else setTurning(d.active) // lock while springing home
      return
    }
    // closed book: tap or swipe opens
    if (!open) return turn('fwd')
    // swipe or tap turns in active direction: left page turns back, right page turns fwd
    turn(d.dir)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).isContentEditable) return // typing, not paging
    if (e.key === 'Escape') {
      if (!open || locked) return
      e.preventDefault()
      setTurning(0)
      setTurned(0)
    } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      commitNext()
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault()
      commitPrev()
    }
  }

  // When virtualizePages is enabled: keeps the active sheet plus one adjacent sheet on either side fully mounted.
  // Sheets outside this window render as lightweight empty shells.
  const isSheetMounted = useCallback(
    (i: number) => {
      if (!virtualizePages) return true
      if (i >= turned - 2 && i <= turned + 1) return true
      if (turning !== null && Math.abs(i - turning) <= 1) return true
      if (draggingIndex !== null && Math.abs(i - draggingIndex) <= 1) return true
      return false
    },
    [virtualizePages, turned, turning, draggingIndex]
  )

  const spreadWidth = pageWidth * 2

  return (
    <div
      className={className ? `deskfolio select-none ${className}` : 'deskfolio select-none'}
      style={
        {
          '--df-page-w': `${pageWidth}px`,
          '--df-page-h': `${pageHeight}px`,
          '--df-spread-w': `${spreadWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      data-open={open}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => {
        const target = e.target as HTMLElement
        if (target && !target.closest('input, textarea, [contenteditable="true"]')) {
          e.preventDefault()
        }
      }}
    >
      <div className="deskfolio-stage" style={{ width: spreadWidth, height: pageHeight }}>
        <motion.div
          ref={rootRef}
          className="deskfolio-book"
          role={interactive ? 'group' : undefined}
          aria-roledescription={interactive ? 'book' : undefined}
          aria-label={interactive ? label : undefined}
          aria-hidden={interactive ? undefined : true}
          tabIndex={interactive ? 0 : -1}
          initial={false}
          animate={{ x: open ? '0%' : closedShift, scale: 1 }}
          transition={reduce ? { duration: 0 } : BLOOM_SPRING}
          onPointerDown={interactive ? onPointerDown : undefined}
          onPointerMove={interactive ? onPointerMove : undefined}
          onPointerUp={interactive ? (e) => finishDrag(e, false) : undefined}
          onPointerCancel={interactive ? (e) => finishDrag(e, true) : undefined}
          onKeyDown={interactive ? onKeyDown : undefined}
        >
          <div className="deskfolio-block" aria-hidden="true" />

          {sheets.map((sheet, i) => {
            const moving = i === turning || i === draggingIndex
            const peeking = peekIndex === i && !locked && i === turned && turned < max
            return (
              <BookSheet
                key={i}
                index={i}
                flipped={i < turned}
                peek={peeking}
                dragging={draggingIndex === i}
                showCorner={interactive && i === turned && turned < max}
                z={moving ? max + 2 : i < turned ? i + 1 : max - i}
                // gpu layer only while moving
                active={moving || peeking}
                reduce={!!reduce}
                sheet={sheet}
                rot={rots[i]}
                isMounted={isSheetMounted(i)}
                onRest={handleRest}
                onPeek={handlePeek}
              />
            )
          })}
        </motion.div>
      </div>

      <span className="deskfolio-sr" aria-live="polite">
        {turned === 0 ? 'Closed' : turned >= max ? 'The end' : `Spread ${turned} of ${max - 1}`}
      </span>
    </div>
  )
}

// one double-sided leaf; yields to parent while dragging
const BookSheet = memo(function BookSheet({
  index,
  flipped,
  peek,
  dragging,
  showCorner,
  z,
  active,
  reduce,
  sheet,
  rot,
  isMounted = true,
  onRest,
  onPeek,
}: {
  index: number
  flipped: boolean
  peek: boolean
  dragging: boolean
  showCorner: boolean
  z: number
  active: boolean
  reduce: boolean
  sheet: Sheet
  rot: MotionValue<number>
  isMounted?: boolean
  onRest: (index: number) => void
  onPeek: (index: number, on: boolean) => void
}) {
  const prevFlipped = useRef(flipped)
  const animControlsRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    if (dragging) {
      // parent drives rot; cancel superseded animation
      animControlsRef.current?.stop()
      animControlsRef.current = null
      prevFlipped.current = flipped
      return
    }
    prevFlipped.current = flipped
    const target = flipped ? -180 : peek && !reduce ? PEEK_ANGLE : 0
    if (reduce) {
      animControlsRef.current?.stop()
      animControlsRef.current = null
      rot.set(target)
      onRest(index)
      return
    }
    // cancel existing animation before starting new one
    animControlsRef.current?.stop()
    const current = rot.get()
    const dist = Math.abs(target - current)
    const v0 = rot.getVelocity()
    // For hardcovers (front/back cover), avoid snappy artificial impulse;
    // let the weighted spring accelerate smoothly and majestically.
    const isHardCover = index === 0 || sheet.frontHard || sheet.backHard
    const springConfig = isHardCover ? COVER_SPRING : FLIP_SPRING
    const defaultVelocity = isHardCover
      ? Math.sign(target - current) * 20
      : Math.sign(target - current) * 60
    const opts =
      dist > 24
        ? { ...springConfig, velocity: Math.abs(v0) < 60 ? defaultVelocity : v0 }
        : PEEK_SPRING
    const controls = animate(rot, target, opts)
    animControlsRef.current = controls
    controls.then(() => {
      if (animControlsRef.current === controls) {
        animControlsRef.current = null
      }
      onRest(index)
    }).catch(() => {})
    return () => {
      controls.stop()
      if (animControlsRef.current === controls) {
        animControlsRef.current = null
      }
    }
  }, [flipped, peek, dragging, reduce, rot, index, onRest])

  // shadows peak edge-on at 90 deg
  const frontShade = useTransform(rot, [0, -90], [0, 0.42], { clamp: true })
  const backShade = useTransform(rot, [-90, -180], [0.42, 0], { clamp: true })
  // hide each face by live angle, not CSS backface
  const frontVisible = useTransform(rot, (r) => (r > -90 ? 1 : 0))
  const backVisible = useTransform(rot, (r) => (r <= -90 ? 1 : 0))

  return (
    <motion.div className="deskfolio-sheet" style={{ rotateY: rot, zIndex: z, willChange: active ? 'transform' : 'auto' }}>
      <motion.div className={faceClass('front', sheet.frontHard)} style={{ opacity: frontVisible }}>
        <div className="deskfolio-page-content">{isMounted ? sheet.front : null}</div>
        <motion.div className="deskfolio-fold" style={{ opacity: frontShade }} aria-hidden="true" />
        <div className="deskfolio-spine-shade" aria-hidden="true" />
        {showCorner && isMounted && (
          <div
            className="deskfolio-corner"
            aria-hidden="true"
            onPointerEnter={() => onPeek(index, true)}
            onPointerLeave={() => onPeek(index, false)}
          />
        )}
      </motion.div>
      <motion.div className={faceClass('back', sheet.backHard)} style={{ opacity: backVisible }}>
        <div className="deskfolio-page-content">{isMounted ? sheet.back : null}</div>
        <motion.div className="deskfolio-fold" style={{ opacity: backShade }} aria-hidden="true" />
        <div className="deskfolio-spine-shade deskfolio-spine-shade--right" aria-hidden="true" />
      </motion.div>
    </motion.div>
  )
})

function faceClass(side: 'front' | 'back', hard: boolean) {
  return [
    'deskfolio-face',
    side === 'front' ? 'deskfolio-face--front' : 'deskfolio-face--back',
    hard ? 'deskfolio-face--hard' : 'deskfolio-face--paper',
  ].join(' ')
}
