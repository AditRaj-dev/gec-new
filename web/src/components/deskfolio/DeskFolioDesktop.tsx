/* eslint-disable @next/next/no-img-element */
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { DeskFolio } from './DeskFolio'
import { DialSlider } from './DialSlider'
import {
  GEC_BOOKS,
  GEC_MAT_THEMES,
  BookCoverArtwork,
  DESK_BOOK_COORDINATES,
  MINI_BOOK_SIZE,
  CENTER_BOOK_COORDINATES,
} from './gecBooksData'
import { MatPrintedLogo } from './MatPrintedLogo'
import { haptic } from './haptics'
import './deskfolio.css'
import './deskfolio-page.css'

const LazyStickerReplaceLibrary = React.lazy(() =>
  import('./StickerReplaceLibrary').then((m) => ({ default: m.StickerReplaceLibrary })),
)

export interface MatOverride {
  scale?: number
  rotate?: number
  deleted?: boolean
  src?: string
  href?: string
  left?: number
  top?: number
}

export interface MatEditApi {
  activeKey: string | null
  setActiveKey: (k: string | null) => void
  overrides: Record<string, MatOverride>
  patch: (key: string, partial: MatOverride) => void
  remove: (key: string) => void
  tableSrcs: Set<string>
}

const MatEditContext = createContext<MatEditApi | null>(null)
function useMatEdit(): MatEditApi {
  const ctx = useContext(MatEditContext)
  if (!ctx) throw new Error('useMatEdit outside MatEditContext')
  return ctx
}

export interface StickerTheme {
  id: string
  name: string
  swatch: string
  src: string
}

export interface StickerItem {
  src: string
  width: string
  height?: string
  rotate: number
  pos: { top?: string; bottom?: string; left?: string; right?: string }
  lamp?: boolean
  stuck?: boolean
  themes?: StickerTheme[]
}

export interface StickerSet {
  id: string
  name: string
  thumb: string
  items: StickerItem[]
}

interface StickerDragState {
  pointerId: number
  startX: number
  startY: number
  armed: boolean
  held: boolean
  stage?: HTMLElement
  offsetX?: number
  offsetY?: number
  width?: number
  height?: number
  baseLeft?: number
  baseTop?: number
  lastLeft?: number
  lastTop?: number
}

const ITM = '/stickers/items/'
const POLAROID_SRC = '__component:polaroid'
const IPOD_SRC = '__component:ipod'
const NAME_TAG_SRC = '__component:name-tag'

const KEYBOARD_BASE_SRC = ITM + 'sticker-keyboard.svg'
const KEYBOARD_THEMES: StickerTheme[] = [
  { id: 'cream', name: 'Cream', swatch: '#eee9df', src: KEYBOARD_BASE_SRC },
  { id: 'lavender', name: 'Lavender', swatch: '#b8aee6', src: ITM + 'sticker-keyboard-lavender.svg' },
  { id: 'sage', name: 'Sage', swatch: '#a7bfa0', src: ITM + 'sticker-keyboard-sage.svg' },
  { id: 'charcoal', name: 'Charcoal', swatch: '#45484f', src: ITM + 'sticker-keyboard-charcoal.svg' },
]

const STICKER_SETS: StickerSet[] = [
  {
    id: 'workspace',
    name: 'Workspace',
    thumb: '/stickers/sticker-desk.svg',
    items: [
      { src: ITM + 'sticker-desk-9.svg', width: '216px', height: '216px', rotate: -8, pos: { left: '1128px', top: '50px' }, lamp: true },
      { src: KEYBOARD_BASE_SRC, width: '330px', height: '112px', rotate: 24, pos: { left: '-35px', top: '-50px' }, themes: KEYBOARD_THEMES },
      { src: ITM + 'sticker-stationery-3.svg', width: '120px', height: '126px', rotate: -6, pos: { left: '239px', top: '270px' } },
      { src: ITM + 'sticker-desk-0.svg', width: '148px', height: '60px', rotate: 58, pos: { left: '98px', top: '367px' } },
      { src: ITM + 'sticker-cutie-gameboy.svg', width: '196px', height: '150px', rotate: -10, pos: { left: '37px', top: '507px' } },
      { src: ITM + 'sticker-desk-7.svg', width: '70px', height: '120px', rotate: -8, pos: { left: '1246px', top: '302px' } },
      { src: ITM + 'sticker-cutie-bear.svg', width: '116px', height: '116px', rotate: -4, pos: { left: '1060px', top: '453px' }, stuck: true },
      { src: ITM + 'sticker-journal-3.svg', width: '168px', height: '76px', rotate: -8, pos: { left: '335px', top: '441px' } },
      { src: ITM + 'sticker-plant-succulent.svg', width: '150px', height: '150px', rotate: 3, pos: { left: '1166px', top: '541px' } },
    ],
  },
]

const LAMP_ITEM = STICKER_SETS[0].items.find((it) => it.lamp)
const LAMP_DEFAULT_SCALE = 1
const LAMP_DEFAULT_ROTATE = 10
const LONG_PRESS_MS = 420
const LONG_PRESS_SLOP = 8

const isPeelSticker = (src: string) => /sticker-(cutie|cute-pop|dev)-/.test(src)
const isDevSticker = (src: string) => /sticker-dev-/.test(src)
const DEV_STICKER_WIDTH = 'clamp(56px, 12.5vw, 132px)'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function scaleCssClamp(value: string, scale: number) {
  const pixelValue = value.match(/^([\d.]+)px$/)
  if (pixelValue) return `${(parseFloat(pixelValue[1]) * scale).toFixed(1)}px`
  const match = value.match(/^clamp\(([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)$/)
  if (!match) return value
  const min = (parseFloat(match[1]) * scale).toFixed(1)
  const vw = (parseFloat(match[2]) * scale).toFixed(2)
  const max = (parseFloat(match[3]) * scale).toFixed(1)
  return `clamp(${min}px, ${vw}vw, ${max}px)`
}

function stageScale(stage: HTMLElement) {
  const rect = stage.getBoundingClientRect()
  return rect.width ? rect.width / stage.offsetWidth : 1
}

function warmImage(src: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  return img
}

function dropIn(rotate: number, i: number, reduce: boolean) {
  const tilt = rotate >= 0 ? 1 : -1
  const overshoot = rotate + tilt * 4
  const step = Math.min(i, 6) * 0.06
  if (reduce) {
    return {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 1, scale: 1 },
    }
  }
  return {
    initial: { opacity: 0, scale: 0.72, y: -24, rotate: overshoot },
    animate: { opacity: 1, scale: 1, y: 0, rotate },
    transition: {
      type: 'spring' as const,
      bounce: 0.38,
      duration: 0.58,
      delay: 0.04 + step,
    },
  }
}

function pressOn(rotate: number, i: number, reduce: boolean) {
  const step = Math.min(i, 6) * 0.05
  if (reduce) {
    return {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 1, scale: 1 },
    }
  }
  return {
    initial: { opacity: 0, scale: 1.16, rotate },
    animate: { opacity: 1, scale: 1, rotate },
    transition: {
      type: 'spring' as const,
      bounce: 0.22,
      duration: 0.42,
      delay: 0.04 + step,
    },
  }
}

const LbResize = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M13 3h4v4M7 17H3v-4M17 3l-5 5M3 17l5-5" />
  </svg>
)

const LbReplace = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 7h11a3 3 0 013 3v0M17 13H6a3 3 0 01-3-3v0" />
    <path d="M6 4L3 7l3 3M14 16l3-3-3-3" />
  </svg>
)

const LbTrash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 6h12M7 6V4a1 1 0 011-1h4a1 1 0 011 1v2M15 6v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
  </svg>
)

function EditableNameTag({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && !el.textContent) el.textContent = 'Mort'
  }, [])

  return (
    <div className={`df-name-tag ${className}`.trim()}>
      <img className="df-name-tag-img" src="/stickers/items/hello-name-tag.svg" alt="" draggable={false} decoding="async" />
      <div
        ref={ref}
        className="df-name-tag-text"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Name"
        data-ph="Mort"
        spellCheck={false}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function PolaroidCamera() {
  return (
    <div className="df-polaroid" aria-hidden="true">
      <div className="top">
        <div className="flash" />
        <div className="timer" />
        <div className="sensor" />
        <div className="lens">
          <div className="glass" />
        </div>
        <div className="shutter" />
        <div className="viewfinder">
          <div className="glass">
            <div className="back" />
          </div>
        </div>
        <div className="toggle-container">
          <div className="toggle" />
        </div>
        <div className="power" />
        <div className="title" />
      </div>
      <div className="bottom">
        <div className="toggle-container">
          <div className="toggle">
            <div className="handle" />
          </div>
        </div>
        <div className="printer" />
        <div className="labels">
          <div className="rainbow" />
          <div className="logo">Polaroid</div>
          <div className="type" />
        </div>
      </div>
    </div>
  )
}

function MiniPod() {
  return (
    <div className="ipod">
      <div className="screen">
        <div className="battery" />
        <ul className="menu">
          <li className="s">Music</li>
          <li className="s">Extras</li>
          <li className="s">Settings</li>
          <li className="active">Shuffle Songs</li>
          <li>Backlight</li>
        </ul>
      </div>
      <div className="clickwheel">
        <button type="button" tabIndex={-1} className="clickwheel-button menu-button">Menu</button>
        <button type="button" tabIndex={-1} className="clickwheel-button rw">◀◀</button>
        <button type="button" tabIndex={-1} className="clickwheel-button ff">▶▶</button>
        <button type="button" tabIndex={-1} className="clickwheel-button pp"><span>▶</span>❚❚</button>
      </div>
    </div>
  )
}

type MatObjectKind = 'sticker' | 'object'

function MatObjectMenu({
  objectKey,
  kind,
  scale,
  rotate,
  flip,
  dx = 0,
  themes,
}: {
  objectKey: string
  kind: MatObjectKind
  scale: number
  rotate: number
  flip: boolean
  dx?: number
  themes?: StickerTheme[]
}) {
  const reduce = useReducedMotion()
  const { setActiveKey, overrides, patch, remove, tableSrcs } = useMatEdit()
  const [view, setView] = useState<'menu' | 'resize' | 'library' | 'theme'>('menu')
  const currentSrc = overrides[objectKey]?.src ?? themes?.[0]?.src
  const close = () => setActiveKey(null)

  const menuRows = 1 + (kind === 'sticker' ? 1 : 0) + (themes ? 1 : 0) + 1
  const xPos = dx ? `calc(-50% + ${dx}px)` : '-50%'
  const dims =
    view === 'library'
      ? { width: 326, height: 310, borderRadius: 22 }
      : view === 'theme'
        ? { width: 236, height: 112, borderRadius: 22 }
        : view === 'resize'
          ? { width: 244, height: 138, borderRadius: 22 }
          : { width: 170, height: 12 + menuRows * 46, borderRadius: 20 }

  return (
    <motion.div
      className="df-matmenu"
      data-flip={flip ? 'below' : 'above'}
      role="menu"
      aria-label={kind === 'sticker' ? 'Edit sticker' : 'Edit object'}
      onPointerDown={(e) => e.stopPropagation()}
      initial={reduce ? false : { opacity: 0, scale: 0.66, x: xPos, ...dims }}
      animate={reduce ? { opacity: 1, x: xPos, ...dims } : { opacity: 1, scale: 1, x: xPos, ...dims }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, x: xPos, transition: { duration: 0.14, ease: 'easeIn' } }}
      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.26, duration: 0.44 }}
    >
      <motion.div
        key={view}
        className="df-matmenu-view"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.14 }}
      >
        {view === 'menu' && (
          <div className="df-matmenu-rows">
            <button type="button" className="df-matmenu-row" onClick={() => setView('resize')}>
              <LbResize className="df-matmenu-ico" /> Resize
            </button>
            {kind === 'sticker' && (
              <button type="button" className="df-matmenu-row" onClick={() => setView('library')}>
                <LbReplace className="df-matmenu-ico" /> Replace
              </button>
            )}
            {themes && (
              <button type="button" className="df-matmenu-row" onClick={() => setView('theme')}>
                <span
                  className="df-matmenu-ico df-matmenu-themedot"
                  style={{ background: (themes.find((t) => t.src === currentSrc) ?? themes[0]).swatch }}
                  aria-hidden="true"
                />{' '}
                Theme
              </button>
            )}
            <button
              type="button"
              className="df-matmenu-row df-matmenu-row--danger"
              onClick={() => {
                remove(objectKey)
                close()
              }}
            >
              <LbTrash className="df-matmenu-ico" /> Delete
            </button>
          </div>
        )}
        {view === 'resize' && (
          <div className="df-matmenu-resize">
            <DialSlider
              value={scale}
              onChange={(s) => patch(objectKey, { scale: s })}
              min={0.5}
              max={1.8}
              step={0.05}
              label="Size"
              valueText={`${Math.round(scale * 100)}%`}
              ariaLabel="Object size"
            />
            <DialSlider
              value={rotate}
              onChange={(r) => patch(objectKey, { rotate: r })}
              min={-180}
              max={180}
              step={1}
              label="Tilt"
              valueText={`${Math.round(rotate)}°`}
              ariaLabel="Sticker rotation"
            />
            <button type="button" className="df-matmenu-done" onClick={() => setView('menu')}>
              Done
            </button>
          </div>
        )}
        {view === 'theme' && themes && (
          <div className="df-matmenu-theme">
            <div className="df-matmenu-theme-row" role="radiogroup" aria-label="Keyboard colour">
              {themes.map((t) => {
                const selected = (currentSrc ?? themes[0].src) === t.src
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={t.name}
                    title={t.name}
                    className={selected ? 'df-matmenu-swatch is-active' : 'df-matmenu-swatch'}
                    style={{ background: t.swatch }}
                    onClick={() => patch(objectKey, { src: t.src })}
                  />
                )
              })}
            </div>
            <button type="button" className="df-matmenu-done" onClick={() => setView('menu')}>
              Done
            </button>
          </div>
        )}
        {view === 'library' && (
          <Suspense
            fallback={
              <div
                className="df-matmenu-lib-empty"
                style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Loading stickers...
              </div>
            }
          >
            <LazyStickerReplaceLibrary
              tableSrcs={tableSrcs}
              reduce={!!reduce}
              onSelect={(src) => {
                patch(objectKey, { src })
                close()
              }}
            />
          </Suspense>
        )}
      </motion.div>
    </motion.div>
  )
}

function DraggableMatObject({
  objectKey,
  editable = false,
  kind = 'sticker',
  className = 'df-sticker-dragger',
  title = 'Hold to move',
  style,
  themes,
  onDraggingChange,
  children,
}: {
  objectKey: string
  editable?: boolean
  kind?: MatObjectKind
  className?: string
  title?: string
  style: React.CSSProperties
  themes?: StickerTheme[]
  onDraggingChange?: (dragging: boolean) => void
  children: React.ReactNode
}) {
  const { activeKey, setActiveKey, overrides, patch } = useMatEdit()
  const override = overrides[objectKey]
  const active = editable && activeKey === objectKey
  const [dragging, setDragging] = useState(false)
  const [flip, setFlip] = useState(false)
  const [menuDx, setMenuDx] = useState(0)
  const elRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)
  const dragRef = useRef<StickerDragState | null>(null)
  const suppressClickRef = useRef(false)

  const clearHold = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const releaseCapture = () => {
    const state = dragRef.current
    const el = elRef.current
    if (state && el?.hasPointerCapture(state.pointerId)) {
      try {
        el.releasePointerCapture(state.pointerId)
      } catch {
        // capture already gone if gesture completed
      }
    }
  }

  const placement = override?.left != null && override?.top != null ? { left: override.left, top: override.top } : undefined
  const placedStyle = placement
    ? (() => {
        const { left, right, top, bottom, ...rest } = style
        void left
        void right
        void top
        void bottom
        return { ...rest, left: placement.left, top: placement.top }
      })()
    : style

  const rootClassName = [className, dragging && 'is-dragging', active && 'df-matobject--active'].filter(Boolean).join(' ')

  const beginEdit = (el: HTMLDivElement) => {
    const stage = el.closest<HTMLElement>('.deskfolio-demo-stage')
    if (stage) {
      const sr = stage.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      setFlip(r.top - sr.top < sr.height * 0.4)
      const scale = stageScale(stage) || 1
      const centerX = r.left + r.width / 2 - sr.left
      const half = 168 * scale
      const pad = 14 * scale
      let dx = 0
      if (centerX - half < pad) dx = pad - (centerX - half)
      else if (centerX + half > sr.width - pad) dx = sr.width - pad - (centerX + half)
      setMenuDx(dx / scale)
    }
    if (dragRef.current) dragRef.current.held = true
    setActiveKey(objectKey)
  }

  const armDrag = (el: HTMLDivElement, pointerId: number, clientX: number, clientY: number) => {
    const stage = el.closest<HTMLElement>('.deskfolio-demo-stage')
    if (!stage || dragRef.current?.pointerId !== pointerId) return
    const scale = stageScale(stage) || 1
    const stageRect = stage.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const left = (rect.left - stageRect.left) / scale
    const top = (rect.top - stageRect.top) / scale
    const width = rect.width / scale
    const height = rect.height / scale
    dragRef.current = {
      ...dragRef.current,
      armed: true,
      stage,
      offsetX: (clientX - rect.left) / scale,
      offsetY: (clientY - rect.top) / scale,
      width,
      height,
      baseLeft: left,
      baseTop: top,
      lastLeft: left,
      lastTop: top,
    }

    el.style.left = `${left}px`
    el.style.top = `${top}px`
    el.style.right = 'auto'
    el.style.bottom = 'auto'
    el.style.transform = 'scale(1.055)'

    setDragging(true)
    onDraggingChange?.(true)
    try {
      el.setPointerCapture(pointerId)
    } catch {
      // browser capture decline fallback
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const el = e.currentTarget
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, armed: false, held: false }
    clearHold()
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      if (editable) beginEdit(el)
      else armDrag(el, e.pointerId, e.clientX, e.clientY)
    }, LONG_PRESS_MS)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current
    if (!state || state.pointerId !== e.pointerId) return
    if (state.armed) {
      if (
        !state.stage ||
        state.offsetX == null ||
        state.offsetY == null ||
        state.width == null ||
        state.height == null ||
        state.baseLeft == null ||
        state.baseTop == null
      ) {
        return
      }
      const scale = stageScale(state.stage) || 1
      const stageRect = state.stage.getBoundingClientRect()
      const maxLeft = Math.max(0, state.stage.offsetWidth - state.width)
      const maxTop = Math.max(0, state.stage.offsetHeight - state.height)
      const nextLeft = clamp((e.clientX - stageRect.left) / scale - state.offsetX, 0, maxLeft)
      const nextTop = clamp((e.clientY - stageRect.top) / scale - state.offsetY, 0, maxTop)
      state.lastLeft = nextLeft
      state.lastTop = nextTop
      const dx = nextLeft - state.baseLeft
      const dy = nextTop - state.baseTop
      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.055)`
      }
      e.preventDefault()
      return
    }
    const moved = Math.hypot(e.clientX - state.startX, e.clientY - state.startY) > LONG_PRESS_SLOP
    if (state.held) {
      if (moved) {
        setActiveKey(null)
        armDrag(e.currentTarget, state.pointerId, e.clientX, e.clientY)
      }
      return
    }
    if (moved) {
      clearHold()
      dragRef.current = null
    }
  }

  const onPointerUp = () => {
    clearHold()
    const state = dragRef.current
    if (elRef.current) {
      elRef.current.style.transform = ''
    }
    if (state?.armed && state.lastLeft != null && state.lastTop != null) {
      patch(objectKey, { left: state.lastLeft, top: state.lastTop })
    }
    if (state?.armed || state?.held) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    releaseCapture()
    dragRef.current = null
    setDragging(false)
    onDraggingChange?.(false)
  }

  const onPointerCancel = () => {
    clearHold()
    const state = dragRef.current
    if (elRef.current) {
      elRef.current.style.transform = ''
    }
    if (state?.armed && state.lastLeft != null && state.lastTop != null) {
      patch(objectKey, { left: state.lastLeft, top: state.lastTop })
    }
    releaseCapture()
    dragRef.current = null
    setDragging(false)
    onDraggingChange?.(false)
  }

  return (
    <div
      ref={elRef}
      className={rootClassName}
      data-sticker={objectKey}
      title={title}
      style={placedStyle}
      onClickCapture={(e) => {
        if (!suppressClickRef.current) return
        if ((e.target as HTMLElement).closest('.df-matmenu')) return
        e.preventDefault()
        e.stopPropagation()
        suppressClickRef.current = false
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onPointerUp}
    >
      {children}
      <AnimatePresence>
        {active && (
          <MatObjectMenu
            objectKey={objectKey}
            kind={kind}
            scale={override?.scale ?? 1}
            rotate={override?.rotate ?? 0}
            flip={flip}
            dx={menuDx}
            themes={themes}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function DraggableMatSticker({
  objectKey,
  item,
  index,
  reduce,
  onDraggingChange,
}: {
  objectKey: string
  item: StickerItem
  index: number
  reduce: boolean
  onDraggingChange: (dragging: boolean) => void
}) {
  const { overrides, activeKey } = useMatEdit()
  const ov = overrides[objectKey]
  const active = activeKey === objectKey
  const scale = ov?.scale ?? 1
  const rot = ov?.rotate ?? 0
  const src = ov?.src ?? item.src

  if (src === POLAROID_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-polaroid-dragger"
        style={
          {
            ...item.pos,
            ...(scale !== 1 ? { '--df-pol-scale': 0.26 * scale } : {}),
            ...(rot !== 0 ? { '--df-pol-rotate': `${-7 + rot}deg` } : {}),
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-polaroid-mat">
          <div className="df-polaroid-scale">
            <PolaroidCamera />
          </div>
        </div>
      </DraggableMatObject>
    )
  }

  if (src === IPOD_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-ipod-dragger"
        style={
          {
            ...item.pos,
            width: item.width,
            height: item.height,
            '--df-ipod-scale': 0.49 * scale,
            '--df-ipod-rotate': `${-14 + rot}deg`,
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-ipod-mat">
          <div className="df-mipod df-ipod-placed" aria-hidden="true">
            <MiniPod />
          </div>
        </div>
      </DraggableMatObject>
    )
  }

  if (src === NAME_TAG_SRC) {
    return (
      <DraggableMatObject
        objectKey={objectKey}
        editable
        kind="sticker"
        className="df-sticker-dragger df-name-tag-dragger"
        style={
          {
            ...item.pos,
            '--df-name-tag-scale': scale,
            '--df-name-tag-rotate': `${-8 + rot}deg`,
          } as React.CSSProperties
        }
        onDraggingChange={onDraggingChange}
      >
        <div className="df-name-tag-mat">
          <EditableNameTag className="df-name-tag-placed" />
        </div>
      </DraggableMatObject>
    )
  }

  const stuck = isPeelSticker(src)

  return (
    <DraggableMatObject
      objectKey={objectKey}
      editable
      kind="sticker"
      className={stuck ? 'df-sticker-dragger df-sticker-dragger--stuck' : 'df-sticker-dragger'}
      style={{ width: isDevSticker(src) ? DEV_STICKER_WIDTH : item.width, height: item.height, ...item.pos }}
      themes={item.src === KEYBOARD_BASE_SRC ? KEYBOARD_THEMES : undefined}
      onDraggingChange={onDraggingChange}
    >
      <div className="df-sticker-scale" style={{ transform: `scale(${active ? scale * 1.06 : scale}) rotate(${rot}deg)` }}>
        <motion.img
          key={src}
          className={stuck ? 'df-sticker-item df-sticker-stuck' : 'df-sticker-item'}
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          {...(stuck ? pressOn : dropIn)(item.rotate, index, reduce)}
        />
      </div>
    </DraggableMatObject>
  )
}

function DeskLamp({
  item,
  index,
  on,
  onToggle,
  placed = false,
}: {
  item: StickerItem
  index: number
  on: boolean
  onToggle: () => void
  placed?: boolean
}) {
  const reduce = useReducedMotion()
  const [warmup, setWarmup] = useState(false)
  return (
    <motion.button
      type="button"
      className={on ? (warmup ? 'df-lamp is-on df-lamp--warmup' : 'df-lamp is-on') : 'df-lamp'}
      style={placed ? { width: '100%', height: '100%' } : { width: item.width, height: item.height, ...item.pos }}
      role="switch"
      aria-checked={on}
      aria-label="Desk lamp light"
      onClick={() => {
        if (!on) setWarmup(true)
        onToggle()
      }}
      {...dropIn(item.rotate, index, !!reduce)}
    >
      <svg className="df-lamp-cast" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="lamp-beam" x1="121" y1="80" x2="-480" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff8e8" stopOpacity="0.92" />
            <stop offset="0.09" stopColor="#fff3cf" stopOpacity="0.62" />
            <stop offset="0.24" stopColor="#ffeab2" stopOpacity="0.34" />
            <stop offset="0.48" stopColor="#ffe7a6" stopOpacity="0.15" />
            <stop offset="0.76" stopColor="#ffe6a0" stopOpacity="0.05" />
            <stop offset="1" stopColor="#ffe6a0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lamp-pool">
            <stop offset="0" stopColor="#fff7e2" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#ffedbe" stopOpacity="0.16" />
            <stop offset="1" stopColor="#ffedbe" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lamp-hole">
            <stop offset="0.28" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <filter id="lamp-mblur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <mask id="lamp-mask">
            <rect x="-900" y="-500" width="1400" height="1500" fill="#fff" />
            <ellipse cx="150" cy="52" rx="82" ry="76" fill="url(#lamp-hole)" filter="url(#lamp-mblur)" />
          </mask>
          <filter id="lamp-pen" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="lamp-umb" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="lamp-b10" filterUnits="userSpaceOnUse" x="-820" y="-140" width="1180" height="940">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g mask="url(#lamp-mask)">
          <path d="M96 54 L-700 90 L-360 660 L150 104 Z" fill="url(#lamp-beam)" opacity="0.42" filter="url(#lamp-pen)" />
          <path d="M106 60 L-650 125 L-370 560 L136 96 Z" fill="url(#lamp-beam)" filter="url(#lamp-umb)" />
          <ellipse cx="-150" cy="210" rx="150" ry="82" transform="rotate(-14 -150 210)" fill="url(#lamp-pool)" filter="url(#lamp-b10)" />
        </g>
      </svg>
      <img className="df-lamp-img" src={item.src} alt="" draggable={false} decoding="async" />
    </motion.button>
  )
}

function MatStickers({ setId }: { setId: string }) {
  const reduce = useReducedMotion()
  const { overrides, activeKey } = useMatEdit()
  const [dragging, setDragging] = useState(false)
  const set = STICKER_SETS.find((s) => s.id === setId) ?? STICKER_SETS[0]
  const hasActiveSticker = set.items.filter((it) => !it.lamp).some((it, i) => `${set.id}-${i}-${it.src}` === activeKey)
  return (
    <div className={['df-stickers', dragging && 'is-dragging', hasActiveSticker && 'has-active'].filter(Boolean).join(' ')}>
      <AnimatePresence>
        {set.items
          .filter((it) => !it.lamp)
          .map((it, i) => ({ it, i, key: `${set.id}-${i}-${it.src}` }))
          .filter(({ key }) => !overrides[key]?.deleted)
          .map(({ it, i, key }) => (
            <DraggableMatSticker
              key={key}
              objectKey={key}
              item={it}
              index={i}
              reduce={!!reduce}
              onDraggingChange={setDragging}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}

function MatRollIntro() {
  const roll = { type: 'spring', bounce: 0.07, duration: 0.72, delay: 0.1 } as const
  return (
    <div className="df-rollintro" aria-hidden="true">
      <motion.div className="df-roll df-roll-l" initial={{ x: 0 }} animate={{ x: '-100.5%' }} transition={roll}>
        <span className="df-roll-rod">
          <span className="df-roll-sheen" />
        </span>
      </motion.div>
      <motion.div className="df-roll df-roll-r" initial={{ x: 0 }} animate={{ x: '100.5%' }} transition={roll}>
        <span className="df-roll-rod">
          <span className="df-roll-sheen" />
        </span>
      </motion.div>
    </div>
  )
}

const DESKFOLIO_DESKTOP_WARM_SRCS = [
  ...STICKER_SETS[0].items.map((it) => it.src).filter((s) => !s.startsWith('__component:')),
  '/stickers/items/sticker-cutie-bear.svg',
]

function coverVars(theme: { base: string; ink: 'light' | 'dark' }): React.CSSProperties {
  return {
    '--df-cover-1': `color-mix(in srgb, ${theme.base}, white 14%)`,
    '--df-cover-2': theme.base,
    '--df-cover-3': `color-mix(in srgb, ${theme.base}, black 16%)`,
    '--df-cover-ink': theme.ink === 'light' ? '#eef3f1' : '#5b4a52',
  } as React.CSSProperties
}

export function DeskFolioDesktop() {
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1200 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
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
  const [intro, setIntro] = useState(reduce ? 3 : 0)
  const [matDown, setMatDown] = useState(Boolean(reduce))

  useEffect(() => {
    if (reduce) {
      const timer = window.setTimeout(() => {
        setIntro(3)
        setMatDown(true)
      }, 0)
      return () => window.clearTimeout(timer)
    }
    const timers = [
      window.setTimeout(() => setIntro(1), 700),
      window.setTimeout(() => setMatDown(true), 880),
      window.setTimeout(() => setIntro(2), 980),
      window.setTimeout(() => setIntro(3), 1240),
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [reduce])

  const STAGE_BASE_W = 1400
  const STAGE_BASE_H = 720
  const PAGE_W = 350
  const PAGE_H = 483

  const stageScale = useMemo(() => {
    const pad = viewport.w < 768 ? 0 : 16
    const availableW = viewport.w - pad
    return Math.min(1, Math.max(0.24, Math.round((availableW / STAGE_BASE_W) * 1000) / 1000))
  }, [viewport.w])

  const bgTheme = GEC_MAT_THEMES.find((theme) => theme.id === 'gec-crimson') ?? GEC_MAT_THEMES[0]

  useEffect(() => {
    const imgs = DESKFOLIO_DESKTOP_WARM_SRCS.map(warmImage)
    return () => {
      imgs.forEach((img) => {
        img.src = ''
      })
    }
  }, [])

  const [activeBookId, setActiveBookId] = useState<string | null>(null)
  const [readingState, setReadingState] = useState<'idle' | 'flying-in' | 'open' | 'flying-out'>('idle')
  const originButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const activeBook = useMemo(
    () => (activeBookId ? GEC_BOOKS.find((b) => b.id === activeBookId) ?? null : null),
    [activeBookId],
  )

  const handleSelectBook = (bookId: string) => {
    if (readingState !== 'idle') return
    haptic('selection')
    setActiveBookId(bookId)
    if (reduce) {
      setReadingState('open')
    } else {
      setReadingState('flying-in')
    }
  }

  const handleCloseBook = () => {
    if (reduce) {
      const returnId = activeBookId
      setReadingState('idle')
      setActiveBookId(null)
      if (returnId) {
        originButtonRefs.current[returnId]?.focus()
      }
    } else {
      setReadingState('flying-out')
    }
  }

  const handleFlightOutComplete = () => {
    const returnId = activeBookId
    setReadingState('idle')
    setActiveBookId(null)
    if (returnId) {
      originButtonRefs.current[returnId]?.focus()
    }
  }

  const [lampOn, setLampOn] = useState(false)
  const [matOverrides, setMatOverrides] = useState<Record<string, MatOverride>>({
    'desk-lamp': { scale: LAMP_DEFAULT_SCALE, rotate: LAMP_DEFAULT_ROTATE },
  })
  const [activeMatKey, setActiveMatKey] = useState<string | null>(null)

  const matEdit = useMemo<MatEditApi>(() => {
    const set = STICKER_SETS[0]
    const tableSrcs = new Set<string>()
    set.items.forEach((it, i) => {
      if (it.lamp) return
      const ov = matOverrides[`${set.id}-${i}-${it.src}`]
      if (ov?.deleted) return
      tableSrcs.add(ov?.src ?? it.src)
    })
    return {
      activeKey: activeMatKey,
      setActiveKey: (key) => setActiveMatKey(key),
      overrides: matOverrides,
      patch: (key, partial) => setMatOverrides((prev) => ({ ...prev, [key]: { ...prev[key], ...partial } })),
      remove: (key) => setMatOverrides((prev) => ({ ...prev, [key]: { ...prev[key], deleted: true } })),
      tableSrcs,
    }
  }, [activeMatKey, matOverrides])

  useEffect(() => {
    if (!activeMatKey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMatKey(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeMatKey])

  const lampOverride = matOverrides['desk-lamp']

  return (
    <>
      <section className="deskfolio-live">
        <div
          className="df-stage-scale-wrapper"
          style={{
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'hidden',
            minHeight: `${Math.round(STAGE_BASE_H * stageScale)}px`,
            height: `${Math.round(STAGE_BASE_H * stageScale)}px`,
            margin: '0 0 0 50%',
            transform: 'translateX(-50%)',
            position: 'relative',
          }}
        >
          <div
            className="df-stage-scale-inner"
            style={{
              width: `${STAGE_BASE_W}px`,
              height: `${STAGE_BASE_H}px`,
              transform: `scale(${stageScale})`,
              transformOrigin: 'top center',
              flexShrink: 0,
            }}
          >
            <div
              className="demo-stage deskfolio-demo-stage"
              style={
                {
                  width: `${STAGE_BASE_W}px`,
                  minHeight: `${STAGE_BASE_H}px`,
                  margin: '0 auto',
                  transform: 'none',
                  '--df-picker-w': `${PAGE_W}px`,
                  ...bgTheme.style,
                } as React.CSSProperties
              }
            >
              <MatEditContext.Provider value={matEdit}>
                {activeMatKey && (
                  <div
                    className="df-matmenu-backdrop"
                    aria-hidden="true"
                    onPointerDown={() => setActiveMatKey(null)}
                  />
                )}
                {!matDown && <MatRollIntro />}
                {intro >= 2 && <MatPrintedLogo />}
                {intro >= 2 && <MatStickers setId="workspace" />}

                {intro >= 2 &&
                  GEC_BOOKS.map((book) => {
                    const coord = DESK_BOOK_COORDINATES[book.id]
                    if (!coord) return null
                    const isCurrentTraveling = activeBookId === book.id && readingState !== 'idle'
                    return (
                      <button
                        key={book.id}
                        ref={(el) => {
                          originButtonRefs.current[book.id] = el
                        }}
                        type="button"
                        className={`df-mini-desk-book df-mini-desk-book--${book.id} ${isCurrentTraveling ? 'is-hidden' : ''}`}
                        style={{
                          left: `${coord.x}px`,
                          top: `${coord.y}px`,
                          transform: `rotate(${coord.rotate}deg)`,
                        }}
                        title={`Open ${book.title}`}
                        aria-label={`Open ${book.title}`}
                        aria-disabled={readingState !== 'idle'}
                        disabled={readingState !== 'idle'}
                        onClick={() => handleSelectBook(book.id)}
                      >
                        <BookCoverArtwork id={book.id} size="mini" />
                      </button>
                    )
                  })}

                {activeBookId && (readingState === 'flying-in' || readingState === 'flying-out') && (
                  <motion.div
                    key={`flight-${activeBookId}-${readingState}`}
                    className="df-book-flight"
                    initial={
                      readingState === 'flying-in'
                        ? {
                            left: DESK_BOOK_COORDINATES[activeBookId].x,
                            top: DESK_BOOK_COORDINATES[activeBookId].y,
                            width: MINI_BOOK_SIZE.width,
                            height: MINI_BOOK_SIZE.height,
                            rotate: DESK_BOOK_COORDINATES[activeBookId].rotate,
                          }
                        : {
                            left: CENTER_BOOK_COORDINATES.x,
                            top: CENTER_BOOK_COORDINATES.y,
                            width: CENTER_BOOK_COORDINATES.width,
                            height: CENTER_BOOK_COORDINATES.height,
                            rotate: 0,
                          }
                    }
                    animate={
                      readingState === 'flying-in'
                        ? {
                            left: CENTER_BOOK_COORDINATES.x,
                            top: CENTER_BOOK_COORDINATES.y,
                            width: CENTER_BOOK_COORDINATES.width,
                            height: CENTER_BOOK_COORDINATES.height,
                            rotate: 0,
                          }
                        : {
                            left: DESK_BOOK_COORDINATES[activeBookId].x,
                            top: DESK_BOOK_COORDINATES[activeBookId].y,
                            width: MINI_BOOK_SIZE.width,
                            height: MINI_BOOK_SIZE.height,
                            rotate: DESK_BOOK_COORDINATES[activeBookId].rotate,
                          }
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            bounce: 0.18,
                            duration: readingState === 'flying-in' ? 0.52 : 0.48,
                          }
                    }
                    onAnimationComplete={() => {
                      if (readingState === 'flying-in') {
                        setReadingState('open')
                      } else if (readingState === 'flying-out') {
                        handleFlightOutComplete()
                      }
                    }}
                  >
                    <BookCoverArtwork id={activeBookId} size="full" />
                  </motion.div>
                )}

                {readingState === 'open' && activeBook && (
                  <div className="df-book-bloom">
                    <DeskFolio
                      key={activeBook.id}
                      cover={activeBook.cover}
                      pages={activeBook.pages}
                      backCover={activeBook.backCover}
                      closeOnEnd={true}
                      autoOpen={true}
                      onClose={handleCloseBook}
                      pageWidth={PAGE_W}
                      pageHeight={PAGE_H}
                      style={coverVars(activeBook.coverTheme)}
                      virtualizePages={true}
                    />
                  </div>
                )}

                <AnimatePresence>
                  {LAMP_ITEM && !lampOverride?.deleted && (
                    <DraggableMatObject
                      key="desk-lamp"
                      objectKey="desk-lamp"
                      editable
                      kind="object"
                      className="df-sticker-dragger df-lamp-dragger"
                      title="Hold to edit lamp"
                      style={{
                        width: scaleCssClamp(LAMP_ITEM.width, lampOverride?.scale ?? 1),
                        height: LAMP_ITEM.height ? scaleCssClamp(LAMP_ITEM.height, lampOverride?.scale ?? 1) : undefined,
                        ...LAMP_ITEM.pos,
                      }}
                    >
                      <DeskLamp
                        item={{ ...LAMP_ITEM, rotate: LAMP_ITEM.rotate + (lampOverride?.rotate ?? 0) }}
                        index={0}
                        on={lampOn}
                        onToggle={() => setLampOn((v) => !v)}
                        placed
                      />
                    </DraggableMatObject>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {LAMP_ITEM && !lampOverride?.deleted && !lampOn && intro >= 2 && (
                    <motion.div
                      className="df-lamp-hint"
                      aria-hidden="true"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
                      transition={reduce ? { duration: 0 } : { duration: 0.55, delay: 0.5 }}
                    >
                      <span className="df-lamp-hint-text">
                        tap to
                        <br />
                        light it!
                      </span>
                      <svg className="df-lamp-hint-arrow" viewBox="0 0 96 56" aria-hidden="true">
                        <path d="M7 8C22 29 47 39 78 34" />
                        <path d="M69 24L80 34L66 42" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MatEditContext.Provider>
            </div>
          </div>
        </div>
      </section>

      <div className="tagline deskfolio-writeup">
        <div className="df-writeup-intro">
          <h1 className="df-writeup-name">DeskFolio</h1>
          <p className="df-writeup-tagline">A pocket-sized portfolio that opens like a book.</p>
          <p className="df-writeup-copy">
            Built as a cute artist showcase with draggable desk pieces and editable stickers. What began as a journal idea
            quietly turned into a portfolio.
          </p>
          <p className="df-writeup-copy df-writeup-aside">
            I was going to name it Cutefolio, but someone had already used it.
          </p>
        </div>
        <div className="df-writeup-pills" aria-label="Deskfolio notes">
          <span className="df-writeup-pill df-writeup-pill--orange">Long-press edits</span>
          <span className="df-writeup-pill df-writeup-pill--green">Freepik + hand-built assets</span>
          <span className="df-writeup-pill df-writeup-pill--blue">React + motion.dev</span>
        </div>
        <div className="df-howto">
          <div className="df-howto-frame">
            <img
              className="df-howto-bear"
              src="/stickers/items/sticker-cutie-bear.svg"
              width={300}
              height={297}
              loading="lazy"
              decoding="async"
              alt="A bear sticker on the desk with the long-press edit menu floating above it"
            />
            <div className="df-howto-menu" aria-hidden="true">
              <span className="df-howto-menu-row">
                <LbResize className="df-howto-menu-ico" /> Resize
              </span>
              <span className="df-howto-menu-row">
                <LbReplace className="df-howto-menu-ico" /> Replace
              </span>
              <span className="df-howto-menu-row df-howto-menu-row--danger">
                <LbTrash className="df-howto-menu-ico" /> Delete
              </span>
            </div>
            <svg className="df-howto-cursor" viewBox="0 0 64 64" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.78696 6.09422C6.7281 5.68898 5.68898 6.7281 6.09422 7.78696L24.9891 57.1574C25.394 58.2154 26.8598 58.2962 27.3786 57.2892L36.7699 39.0589C37.2761 38.0763 38.0763 37.2761 39.0589 36.7699L57.2892 27.3786C58.2962 26.8598 58.2154 25.394 57.1574 24.9891L7.78696 6.09422ZM2.35847 9.21669C0.716609 4.92667 4.92668 0.716611 9.21669 2.35847L58.5871 21.2533C62.8737 22.8939 63.2012 28.8325 59.121 30.9345L40.8908 40.3258C40.6482 40.4507 40.4507 40.6482 40.3258 40.8908L30.9345 59.121C28.8325 63.2012 22.8939 62.8737 21.2533 58.5871L2.35847 9.21669Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="df-howto-text">
            <span className="df-howto-eyebrow">How to use</span>
            <p>
              Press and hold any sticker or desk object and this little menu blooms up: <strong>Resize</strong> to scale
              it, <strong>Replace</strong> to swap in a different sticker, or <strong>Delete</strong> to clear it off the
              desk.
            </p>
            <p>Drag anything to move it around.</p>
          </div>
        </div>
        <div className="df-reference-strip">
          <span className="df-reference-title">References</span>
          <div className="df-reference-pills">
            <a href="https://codepen.io/fossheim/pen/xxboBzO" target="_blank" rel="noreferrer">
              Polaroid
            </a>
            <a href="https://codepen.io/kreitlow/pen/mqgxYo" target="_blank" rel="noreferrer">
              iPod Shuffle
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
