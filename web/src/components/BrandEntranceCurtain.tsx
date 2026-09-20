'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  LOGO_VIEWBOX,
  LOGO_HEIGHT,
  LOGO_COLORS,
  LOGO_CENTERS,
  PATH_G_RED,
  PATH_G_YELLOW,
  PATH_G_BLUE,
  PATHS_G_EMBLEM,
  PATH_E,
  PATHS_C,
  PATHS_SUBTITLE,
} from '@/lib/logoData';

export interface BrandEntranceCurtainProps {
  /** Callback fired immediately when the logo finishes docking into the topbar */
  onComplete?: () => void;
  /** Force play even if the user has already seen the entrance during this browser session */
  forcePlay?: boolean;
  /** DOM ID of the target topbar navbar logo element to dock into (default: 'navbar-brand-logo') */
  targetSlotId?: string;
  /** Background canvas color for the entrance curtain (default: '#FCF8ED' — Brand Warm Cream) */
  backgroundColor?: string;
  /** Frame timestamp in seconds at which the docking FLIP animation begins (default: 5.60s = frame 336 @ 60fps) */
  dockTimeSeconds?: number;
  /** Visual theme for the entrance */
  theme?: 'light' | 'dark';
}

type Point = { x: number; y: number };
type GPart = 'red' | 'yellow' | 'blue' | 'emblem';

type PartMotion = Point & {
  angle: number;
  progress: number;
};

// --- Math & Spring Helpers ---
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const smoothstep = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};

const interpolate = (
  value: number,
  inputRange: readonly number[] | number[],
  outputRange: readonly number[] | number[],
  options?: { extrapolateLeft?: 'clamp'; extrapolateRight?: 'clamp' }
): number => {
  const length = inputRange.length;
  if (length === 0) return 0;
  if (length === 1) return outputRange[0];

  if (value <= inputRange[0]) {
    if (options?.extrapolateLeft === 'clamp') return outputRange[0];
    const p = (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
    return outputRange[0] + p * (outputRange[1] - outputRange[0]);
  }

  if (value >= inputRange[length - 1]) {
    if (options?.extrapolateRight === 'clamp') return outputRange[length - 1];
    const p =
      (value - inputRange[length - 2]) /
      (inputRange[length - 1] - inputRange[length - 2]);
    return outputRange[length - 2] + p * (outputRange[length - 1] - outputRange[length - 2]);
  }

  let i = 1;
  while (i < length && inputRange[i] < value) {
    i++;
  }
  const inMin = inputRange[i - 1];
  const inMax = inputRange[i];
  const outMin = outputRange[i - 1];
  const outMax = outputRange[i];
  const p = (value - inMin) / (inMax - inMin);
  return outMin + p * (outMax - outMin);
};

const parseHex = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
};

const interpolateColors = (
  val: number,
  inputRange: [number, number],
  colors: [string, string]
): string => {
  const p = clamp01((val - inputRange[0]) / (inputRange[1] - inputRange[0]));
  const [r1, g1, b1] = parseHex(colors[0]);
  const [r2, g2, b2] = parseHex(colors[1]);
  const r = Math.round(r1 + (r2 - r1) * p);
  const g = Math.round(g1 + (g2 - g1) * p);
  const b = Math.round(b1 + (b2 - b1) * p);
  return `rgb(${r}, ${g}, ${b})`;
};

// Analytical damped harmonic spring
const computeSpring = (
  frame: number,
  config: { damping: number; stiffness: number; mass?: number }
): number => {
  if (frame <= 0) return 0;
  const mass = config.mass ?? 1.0;
  const omega0 = Math.sqrt(config.stiffness / mass);
  const zeta = config.damping / (2 * Math.sqrt(config.stiffness * mass));
  const t = frame / 60; // 60fps

  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * t);
    return 1 - decay * (Math.cos(omegaD * t) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * t));
  }
  return 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
};

// Quadratic Bezier curves for assembly
const quadraticPoint = (start: Point, control: Point, progress: number): Point => {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y,
  };
};

const quadraticDerivative = (
  start: Point,
  control: Point,
  progress: number
): Point => ({
  x: 2 * (1 - progress) * (control.x - start.x) - 2 * progress * control.x,
  y: 2 * (1 - progress) * (control.y - start.y) - 2 * progress * control.y,
});

const CHROME_SNAP_CONFIG = {
  delays: { red: 0, yellow: 8, blue: 16, emblem: 24 },
  controls: {
    red: { x: -420, y: 30 },
    yellow: { x: 40, y: -260 },
    blue: { x: 380, y: 70 },
    emblem: { x: 20, y: 220 },
  },
  spring: { damping: 18, stiffness: 110, mass: 0.9 },
  spins: { red: -45, yellow: 45, blue: 30, emblem: 360 },
  trail: { maxLength: 360, width: 7, blur: 3.5, opacity: 0.55 },
};

const G_STARTS: Record<GPart, Point> = {
  red: { x: -1100, y: -160 },
  yellow: { x: 90, y: -880 },
  blue: { x: 1050, y: 320 },
  emblem: { x: -280, y: 840 },
};

const getPartMotion = (part: GPart, progress: number): PartMotion => {
  const p = clamp01(progress);
  const point = quadraticPoint(G_STARTS[part], CHROME_SNAP_CONFIG.controls[part], p);
  const derivative = quadraticDerivative(G_STARTS[part], CHROME_SNAP_CONFIG.controls[part], p);
  return {
    ...point,
    angle: (Math.atan2(derivative.y, derivative.x) * 180) / Math.PI,
    progress: p,
  };
};

/**
 * BrandEntranceCurtain
 *
 * Fullscreen brand entrance curtain with 72-frame smooth bulb glow ignition,
 * continuous color interpolation, theatrical split-curtain reveal, and
 * hardware-accelerated FLIP docking into `#navbar-brand-logo`.
 */
export const BrandEntranceCurtain: React.FC<BrandEntranceCurtainProps> = ({
  onComplete,
  forcePlay = false,
  targetSlotId = 'navbar-brand-logo',
  backgroundColor = '#FCF8ED',
  dockTimeSeconds = 5.60,
  theme = 'light',
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [frame, setFrame] = useState(0);
  const [flightStyle, setFlightStyle] = useState<React.CSSProperties>({});

  const movingBoxRef = useRef<HTMLDivElement>(null);
  const hasTriggeredDockRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // 1. Session and Accessibility Guard
  const initCheck = useCallback(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('gec_intro_seen');

    if ((hasSeenIntro && !forcePlay) || prefersReducedMotion) {
      const targetLogo = document.getElementById(targetSlotId);
      if (targetLogo) {
        targetLogo.style.opacity = '1';
      }
      setIsUnmounted(true);
      if (onComplete) onComplete();
      return;
    }

    try {
      sessionStorage.setItem('gec_intro_seen', 'true');
    } catch {}

    // Hide target logo while entrance plays
    const targetLogo = document.getElementById(targetSlotId);
    if (targetLogo) {
      targetLogo.style.opacity = '0';
    }

    setShouldRender(true);
  }, [forcePlay, onComplete, targetSlotId]);

  useEffect(() => {
    initCheck();

    // Support replay trigger via custom event
    const handleReplay = () => {
      hasTriggeredDockRef.current = false;
      startTimeRef.current = null;
      setCurtainOpen(false);
      setIsUnmounted(false);
      setFlightStyle({});
      setFrame(0);

      const targetLogo = document.getElementById(targetSlotId);
      if (targetLogo) {
        targetLogo.style.opacity = '0';
      }
      setShouldRender(true);
    };

    window.addEventListener('gec-replay-intro', handleReplay);
    return () => {
      window.removeEventListener('gec-replay-intro', handleReplay);
    };
  }, [initCheck, targetSlotId]);

  // 2. FLIP Docking Flight & Curtain Split
  const executeDocking = useCallback(() => {
    if (hasTriggeredDockRef.current) return;
    hasTriggeredDockRef.current = true;
    setCurtainOpen(true);

    const targetLogo = document.getElementById(targetSlotId);
    const movingBox = movingBoxRef.current;

    if (targetLogo && movingBox) {
      const first = movingBox.getBoundingClientRect();
      const last = targetLogo.getBoundingClientRect();

      const deltaX = last.left - first.left;
      const deltaY = last.top - first.top;
      const scale = first.width > 0 ? last.width / first.width : 0.28;

      setFlightStyle({
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
        transformOrigin: 'top left',
        transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease 450ms',
        willChange: 'transform, opacity',
      });
    }

    // Handshake: reveal navbar logo and clean unmount
    setTimeout(() => {
      const targetLogo = document.getElementById(targetSlotId);
      if (targetLogo) {
        targetLogo.style.opacity = '1';
        targetLogo.style.transition = 'opacity 200ms ease-out';
      }
      setIsUnmounted(true);
      window.dispatchEvent(new CustomEvent('gec-intro-completed'));
      if (onComplete) onComplete();
    }, 680);
  }, [onComplete, targetSlotId]);

  // 3. 60FPS RAF Simulation
  useEffect(() => {
    if (!shouldRender || isUnmounted) return;

    const dockTargetFrame = dockTimeSeconds * 60; // Frame 336 @ 5.60s

    const step = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      const currentFrame = elapsed * 60;
      setFrame(currentFrame);

      if (currentFrame >= dockTargetFrame) {
        executeDocking();
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldRender, isUnmounted, dockTimeSeconds, executeDocking]);

  if (!shouldRender || isUnmounted) return null;

  // =========================================================================
  // ANIMATION EQUATIONS (Synchronized with Remotion LogoAnimation.tsx)
  // =========================================================================
  const rawLogoProgress = interpolate(frame, [324, 336], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 1. Assembled G Glide (Center X 655.1 -> 234.6, Offset 420.5px)
  const G_CENTER_OFFSET_X = LOGO_CENTERS.overall.x - LOGO_CENTERS.gGroup.x;
  const gSlideRawProgress = computeSpring(frame - 76, { damping: 16, stiffness: 95, mass: 1.0 });
  const gGroupOffsetX = interpolate(gSlideRawProgress, [0, 1], [G_CENTER_OFFSET_X, 0]);

  // Parts progress
  const gRedProgress = computeSpring(frame - CHROME_SNAP_CONFIG.delays.red, CHROME_SNAP_CONFIG.spring);
  const gYellowProgress = computeSpring(frame - CHROME_SNAP_CONFIG.delays.yellow, CHROME_SNAP_CONFIG.spring);
  const gBlueProgress = computeSpring(frame - CHROME_SNAP_CONFIG.delays.blue, CHROME_SNAP_CONFIG.spring);
  const gEmblemProgress = computeSpring(frame - CHROME_SNAP_CONFIG.delays.emblem, CHROME_SNAP_CONFIG.spring);

  const gRedMotion = getPartMotion('red', gRedProgress);
  const gYellowMotion = getPartMotion('yellow', gYellowProgress);
  const gBlueMotion = getPartMotion('blue', gBlueProgress);
  const gEmblemMotion = getPartMotion('emblem', gEmblemProgress);

  const partOpacity = (del: number) =>
    interpolate(frame, [del, del + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const partRotation = (part: GPart, motion: PartMotion) =>
    (1 - motion.progress) *
    (CHROME_SNAP_CONFIG.spins[part] + motion.angle * (part === 'emblem' ? 0.08 : 0.32));

  const gRedScale = interpolate(gRedMotion.progress, [0, 1], [1.18, 1]);
  const gYellowScale = interpolate(gYellowMotion.progress, [0, 1], [1.14, 1]);
  const gBlueScale = interpolate(gBlueMotion.progress, [0, 1], [1.14, 1]);
  const gEmblemScale = interpolate(gEmblemMotion.progress, [0, 1], [0.2, 1]);

  // Saraswati Emblem Pulse Ring
  const emblemPulse = computeSpring(frame - 66, { damping: 11, stiffness: 130 });
  const pulseRadius = interpolate(emblemPulse, [0, 1], [0, 95]);
  const pulseOpacity = interpolate(emblemPulse, [0, 0.2, 1], [0, 0.85, 0], {
    extrapolateRight: 'clamp',
  });

  // 2. Letters E & C Arrival
  const eStartFrame = 76;
  const eRawProgress = computeSpring(frame - eStartFrame, { damping: 17, stiffness: 110, mass: 1.0 });
  const eX = interpolate(eRawProgress, [0, 1], [450, 0]);
  const eY = interpolate(eRawProgress, [0, 1], [40, 0]);
  const eScale = interpolate(eRawProgress, [0, 1], [0.85, 1]);
  const eOpacity = interpolate(frame, [eStartFrame, eStartFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cStartFrame = 84;
  const cRawProgress = computeSpring(frame - cStartFrame, { damping: 16, stiffness: 105, mass: 1.0 });
  const cX = interpolate(cRawProgress, [0, 1], [600, 0]);
  const cY = interpolate(cRawProgress, [0, 1], [-30, 0]);
  const cScale = interpolate(cRawProgress, [0, 1], [0.8, 1]);
  const cOpacity = interpolate(frame, [cStartFrame, cStartFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. Smooth Extended 72-Frame Bulb Glow (Frames 245 - 336)
  const bulbStartFrame = 245;
  const bulbSparkFrame = frame - bulbStartFrame;
  const bubbleBulbProgress = clamp01(bulbSparkFrame / 72);
  const bubbleBulbAttack = smoothstep(bulbSparkFrame / 12);
  const bubbleTwoPulse = 0.5 - 0.5 * Math.cos(bubbleBulbProgress * Math.PI * 4);
  const bubbleBulbSettle = smoothstep((bulbSparkFrame - 60) / 12);
  const bubblePulsingGlow = 0.18 + bubbleTwoPulse * 0.82;
  const bubbleAnimatedGlow =
    bubbleBulbAttack * (bubblePulsingGlow * (1 - bubbleBulbSettle) + 0.3 * bubbleBulbSettle);

  const filamentFlash =
    bulbSparkFrame < 0 ? 0 : bulbSparkFrame <= 72 ? bubbleAnimatedGlow : 0.3;
  const visibleFilamentFlash = filamentFlash * (1 - rawLogoProgress);
  const cavityIllumination = visibleFilamentFlash;
  const filamentStrokeWidth = 0.75 + visibleFilamentFlash * 1.1;

  const filamentStroke =
    visibleFilamentFlash <= 0
      ? LOGO_COLORS.red
      : interpolateColors(visibleFilamentFlash, [0, 1], [LOGO_COLORS.red, '#ffcc00']);

  const bulbReflectionFill =
    visibleFilamentFlash <= 0
      ? LOGO_COLORS.red
      : interpolateColors(visibleFilamentFlash, [0, 1], [LOGO_COLORS.red, '#ffe066']);

  // 4. Subtitle Arrival
  const subtitleStartFrame = 245;
  const subtitleRawProgress = computeSpring(frame - subtitleStartFrame, { damping: 20, stiffness: 95 });
  const subtitleY = interpolate(subtitleRawProgress, [0, 1], [25, 0]);
  const subtitleOpacity = interpolate(frame, [subtitleStartFrame, subtitleStartFrame + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Shimmer Light Beam
  const shimmerStartFrame = 305;
  const shimmerDuration = 30;
  const shimmerFrame = frame - shimmerStartFrame;
  const shimmerX = interpolate(shimmerFrame, [0, shimmerDuration], [-300, 1600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmerOpacity = interpolate(
    shimmerFrame,
    [0, 6, 24, 30],
    [0, 0.45, 0.45, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isDark = theme === 'dark';
  const textColor = isDark ? '#d1d5db' : LOGO_COLORS.grey;
  const emblemFill = isDark ? '#f3f4f6' : LOGO_COLORS.emblem;

  return (
    <div
      id="gec-entrance-curtain"
      className="fixed inset-0 z-[99999] pointer-events-none"
      aria-hidden={curtainOpen}
    >
      {/* Top Split Panel */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-b border-[rgba(163,4,15,0.14)]"
        style={{
          backgroundColor,
          transform: curtainOpen ? 'translateY(-100%)' : 'translateY(0%)',
          pointerEvents: curtainOpen ? 'none' : 'auto',
        }}
      />

      {/* Bottom Split Panel */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-[rgba(163,4,15,0.14)]"
        style={{
          backgroundColor,
          transform: curtainOpen ? 'translateY(100%)' : 'translateY(0%)',
          pointerEvents: curtainOpen ? 'none' : 'auto',
        }}
      />

      {/* Skip Button */}
      {!curtainOpen && (
        <button
          onClick={executeDocking}
          className="absolute top-6 right-6 z-[100000] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#5F5650] hover:text-[#A3040F] bg-[#FFFDF8]/90 hover:bg-[#FFFDF8] border border-[rgba(163,4,15,0.2)] rounded-full shadow-sm transition-all duration-200 cursor-pointer pointer-events-auto active:scale-95 flex items-center gap-1.5"
          aria-label="Skip brand entrance intro"
        >
          <span>Skip Intro</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Center Stage & FLIP Moving Box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={movingBoxRef}
          id="gec-entrance-moving-box"
          style={{
            width: 'min(88vw, 680px)',
            aspectRatio: '1310.29 / 594.8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...flightStyle,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={LOGO_VIEWBOX}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <radialGradient id="curtainCavityShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff4b0" stopOpacity={0.58} />
                <stop offset="38%" stopColor="#fccc00" stopOpacity={0.3} />
                <stop offset="74%" stopColor="#dc672f" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="curtainBulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff7c7" stopOpacity={visibleFilamentFlash} />
                <stop offset="24%" stopColor="#fccc00" stopOpacity={visibleFilamentFlash * 0.95} />
                <stop offset="55%" stopColor="#ef7b2d" stopOpacity={visibleFilamentFlash * 0.62} />
                <stop offset="78%" stopColor="#c43128" stopOpacity={visibleFilamentFlash * 0.32} />
                <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
              </radialGradient>
              <clipPath id="curtainBulbCavityClip">
                <circle cx="1120" cy="285" r="116" />
              </clipPath>
              <filter id="curtainCInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feComponentTransfer in="SourceAlpha" result="inverseAlpha">
                  <feFuncA type="table" tableValues="1 0" />
                </feComponentTransfer>
                <feGaussianBlur in="inverseAlpha" stdDeviation="7" result="shadowBlur" />
                <feOffset in="shadowBlur" dx="6" dy="6" result="shadowOffset" />
                <feComposite in="shadowOffset" in2="SourceAlpha" operator="in" result="innerShadow" />
                <feFlood floodColor="#741c17" floodOpacity="0.4" result="shadowColor" />
                <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="coloredShadow" />
                </feMerge>
              </filter>
              <linearGradient id="curtainShimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={shimmerOpacity} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="curtainFilamentGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* GROUP 1: LETTER 'G' */}
            <g
              id="letter-G-group"
              style={{
                transform: `translateX(${gGroupOffsetX}px)`,
              }}
            >
              {/* Red Outer Crescent */}
              <g
                id="g-part-red"
                style={{
                  transformOrigin: `${LOGO_CENTERS.gRed.x}px ${LOGO_CENTERS.gRed.y}px`,
                  transform: `translate(${gRedMotion.x}px, ${gRedMotion.y}px) rotate(${partRotation('red', gRedMotion)}deg) scale(${gRedScale})`,
                  opacity: partOpacity(CHROME_SNAP_CONFIG.delays.red),
                }}
              >
                <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
              </g>

              {/* Yellow Inner Crescent */}
              <g
                id="g-part-yellow"
                style={{
                  transformOrigin: `${LOGO_CENTERS.gYellow.x}px ${LOGO_CENTERS.gYellow.y}px`,
                  transform: `translate(${gYellowMotion.x}px, ${gYellowMotion.y}px) rotate(${partRotation('yellow', gYellowMotion)}deg) scale(${gYellowScale})`,
                  opacity: partOpacity(CHROME_SNAP_CONFIG.delays.yellow),
                }}
              >
                <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
              </g>

              {/* Blue Innermost Crescent */}
              <g
                id="g-part-blue"
                style={{
                  transformOrigin: `${LOGO_CENTERS.gBlue.x}px ${LOGO_CENTERS.gBlue.y}px`,
                  transform: `translate(${gBlueMotion.x}px, ${gBlueMotion.y}px) rotate(${partRotation('blue', gBlueMotion)}deg) scale(${gBlueScale})`,
                  opacity: partOpacity(CHROME_SNAP_CONFIG.delays.blue),
                }}
              >
                <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
              </g>

              {/* Saraswati Pulse Ring */}
              {pulseOpacity > 0 && (
                <circle
                  cx={LOGO_CENTERS.gEmblem.x}
                  cy={LOGO_CENTERS.gEmblem.y}
                  r={pulseRadius}
                  fill="none"
                  stroke={LOGO_COLORS.yellow}
                  strokeWidth={2.5}
                  opacity={pulseOpacity}
                />
              )}

              {/* Saraswati Sacred Emblem */}
              <g
                id="g-part-emblem"
                style={{
                  transformOrigin: `${LOGO_CENTERS.gEmblem.x}px ${LOGO_CENTERS.gEmblem.y}px`,
                  transform: `translate(${gEmblemMotion.x}px, ${gEmblemMotion.y}px) rotate(${partRotation('emblem', gEmblemMotion)}deg) scale(${gEmblemScale})`,
                  opacity: partOpacity(CHROME_SNAP_CONFIG.delays.emblem),
                }}
              >
                {PATHS_G_EMBLEM.map((pathD, idx) => (
                  <path key={idx} d={pathD} fill={emblemFill} />
                ))}
              </g>
            </g>

            {/* GROUP 2: LETTER 'E' */}
            <g
              id="letter-E"
              style={{
                transformOrigin: `${LOGO_CENTERS.e.x}px ${LOGO_CENTERS.e.y}px`,
                transform: `translate(${eX}px, ${eY}px) scale(${eScale})`,
                opacity: eOpacity,
              }}
            >
              <path d={PATH_E} fill={LOGO_COLORS.red} />
            </g>

            {/* GROUP 3: LETTER 'C' + SMOOTH EXTENDED BULB GLOW */}
            <g
              id="letter-C"
              style={{
                transformOrigin: `${LOGO_CENTERS.c.x}px ${LOGO_CENTERS.c.y}px`,
                transform: `translate(${cX}px, ${cY}px) scale(${cScale})`,
                opacity: cOpacity,
              }}
            >
              {/* Cavity illumination */}
              <g clipPath="url(#curtainBulbCavityClip)">
                <circle
                  cx="1120"
                  cy="285"
                  r="116"
                  fill="url(#curtainCavityShadow)"
                  opacity={cavityIllumination}
                />
                <circle
                  cx="1120"
                  cy="285"
                  r="132"
                  fill="url(#curtainBulbGlow)"
                  opacity={visibleFilamentFlash}
                  style={{ mixBlendMode: 'screen' }}
                />
              </g>

              {/* Outer body of C */}
              <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} />
              <path
                d={PATHS_C[0].d}
                fill={LOGO_COLORS.red}
                filter="url(#curtainCInnerShadow)"
                opacity={1 - rawLogoProgress}
              />

              {/* Inner bulb reflection accent */}
              <path d={PATHS_C[1].d} fill={LOGO_COLORS.red} />

              {/* Top glossy reflection arc (Smooth continuous color interpolation) */}
              <path d={PATHS_C[2].d} fill={bulbReflectionFill} />

              {/* Bulb base cap */}
              <path d={PATHS_C[3].d} fill={LOGO_COLORS.red} />

              {/* Soft filtered filament duplicate (fades smoothly without filter popping) */}
              <path
                d={PATHS_C[4].d}
                fill="none"
                stroke="#ffd866"
                strokeWidth={filamentStrokeWidth + 1.8}
                strokeMiterlimit={10}
                opacity={visibleFilamentFlash * 0.72}
                filter="url(#curtainFilamentGlow)"
              />

              {/* Crisp filament */}
              <path
                d={PATHS_C[4].d}
                fill="none"
                stroke={filamentStroke}
                strokeWidth={filamentStrokeWidth}
                strokeMiterlimit={10}
              />
            </g>

            {/* GROUP 4: SUBTITLE */}
            <g
              id="subtitle-group"
              style={{
                transformOrigin: `${LOGO_CENTERS.subtitle.x}px ${LOGO_CENTERS.subtitle.y}px`,
                transform: `translateY(${subtitleY}px)`,
                opacity: subtitleOpacity,
              }}
            >
              {PATHS_SUBTITLE.map((item, idx) => (
                <path
                  key={idx}
                  d={item.d}
                  fill={textColor}
                  stroke={textColor}
                  strokeWidth={0.5}
                  strokeMiterlimit={10}
                />
              ))}
            </g>

            {/* SHIMMER LIGHT BEAM */}
            {shimmerOpacity > 0 && (
              <rect
                x={shimmerX}
                y={0}
                width={180}
                height={LOGO_HEIGHT}
                fill="url(#curtainShimmerGradient)"
                transform="skewX(-25)"
                pointerEvents="none"
                style={{ mixBlendMode: 'overlay' }}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
