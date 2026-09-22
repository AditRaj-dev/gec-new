'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { interpolate as interpolateSvgPath } from 'flubber';
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
type BubblePart = 'red' | 'yellow' | 'blue';

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

const cubicInOut = (value: number) => {
  const clamped = clamp01(value);
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
};

const circlePath = (center: Point, radius: number) =>
  `M ${center.x - radius},${center.y} ` +
  `a ${radius},${radius} 0 1,0 ${radius * 2},0 ` +
  `a ${radius},${radius} 0 1,0 ${-radius * 2},0 Z`;

const rotatePoint = (point: Point, angle: number): Point => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
});

const BUBBLE_PARTS: BubblePart[] = ['red', 'yellow', 'blue'];

const BUBBLE_FLAT_CONFIG = {
  delays: { red: 0, yellow: 6, blue: 12 },
  locks: { red: 144, yellow: 152, blue: 160 },
  morphStarts: { red: 82, yellow: 90, blue: 98 },
  turns: 1.5,
  radialPower: 0.7,
};

const BUBBLE_STARTS: Record<BubblePart, Point> = {
  red: { x: -780, y: 78 },
  yellow: { x: 0, y: -330 },
  blue: { x: 720, y: 68 },
};

const BUBBLE_RADII: Record<BubblePart, number> = {
  red: 112,
  yellow: 88,
  blue: 66,
};

const BUBBLE_CENTERS: Record<BubblePart, Point> = {
  red: LOGO_CENTERS.gRed,
  yellow: LOGO_CENTERS.gYellow,
  blue: LOGO_CENTERS.gBlue,
};

const BUBBLE_TARGETS: Record<BubblePart, string> = {
  red: PATH_G_RED,
  yellow: PATH_G_YELLOW,
  blue: PATH_G_BLUE,
};

const BUBBLE_COLORS: Record<BubblePart, string> = {
  red: LOGO_COLORS.red,
  yellow: LOGO_COLORS.yellow,
  blue: LOGO_COLORS.blue,
};

const DOCK_FLIGHT_DURATION_MS = 1100;
const DOCK_SETTLE_HOLD_MS = 60;
const DOCK_CROSSFADE_DURATION_MS = 220;
const DOCK_CROSSFADE_START_MS =
  DOCK_FLIGHT_DURATION_MS + DOCK_SETTLE_HOLD_MS;
const DOCK_HANDOFF_DELAY_MS =
  DOCK_CROSSFADE_START_MS + DOCK_CROSSFADE_DURATION_MS + 40;
const DOCK_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * BrandEntranceCurtain
 *
 * Fullscreen Bubble Flat brand entrance with circle-to-path spiral morphing,
 * a 72-frame bulb ignition, theatrical split-curtain reveal, and
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

  const bubbleMorphers = useMemo(
    () => ({
      red: interpolateSvgPath(
        circlePath(BUBBLE_CENTERS.red, BUBBLE_RADII.red),
        BUBBLE_TARGETS.red,
        { maxSegmentLength: 4 }
      ),
      yellow: interpolateSvgPath(
        circlePath(BUBBLE_CENTERS.yellow, BUBBLE_RADII.yellow),
        BUBBLE_TARGETS.yellow,
        { maxSegmentLength: 4 }
      ),
      blue: interpolateSvgPath(
        circlePath(BUBBLE_CENTERS.blue, BUBBLE_RADII.blue),
        BUBBLE_TARGETS.blue,
        { maxSegmentLength: 4 }
      ),
    }),
    []
  );

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
    // Run the initial state transition on the next frame so the effect only
    // synchronizes with browser APIs during its setup phase.
    const initFrame = window.requestAnimationFrame(initCheck);

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
      window.cancelAnimationFrame(initFrame);
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
        opacity: 0,
        transition: [
          `transform ${DOCK_FLIGHT_DURATION_MS}ms ${DOCK_EASING}`,
          `opacity ${DOCK_CROSSFADE_DURATION_MS}ms ease-out ${DOCK_CROSSFADE_START_MS}ms`,
        ].join(', '),
        willChange: 'transform, opacity',
      });

      targetLogo.style.transition =
        `opacity ${DOCK_CROSSFADE_DURATION_MS}ms ease-out`;

      // Crossfade only when the moving logo is already visually aligned with
      // the navbar slot, avoiding a flash or a doubled logo during handoff.
      setTimeout(() => {
        targetLogo.style.opacity = '1';
      }, DOCK_CROSSFADE_START_MS);
    }

    // Handshake: reveal navbar logo and clean unmount
    setTimeout(() => {
      const targetLogo = document.getElementById(targetSlotId);
      if (targetLogo) {
        targetLogo.style.opacity = '1';
      }
      setIsUnmounted(true);
      window.dispatchEvent(new CustomEvent('gec-intro-completed'));
      if (onComplete) onComplete();
    }, DOCK_HANDOFF_DELAY_MS);
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

  // 1. Bubble Flat G assembly and final lockup glide.
  const G_CENTER_OFFSET_X = LOGO_CENTERS.overall.x - LOGO_CENTERS.gGroup.x;
  const gSlideRawProgress = computeSpring(frame - 190, {
    damping: 16,
    stiffness: 95,
    mass: 1.0,
  });
  const gSlideProgress = frame >= 225 ? 1 : gSlideRawProgress;
  const gGroupOffsetX = interpolate(gSlideProgress, [0, 1], [G_CENTER_OFFSET_X, 0]);

  const bubbleStates = BUBBLE_PARTS.map((part) => {
    const travelProgress = clamp01(
      (frame - BUBBLE_FLAT_CONFIG.delays[part]) /
        (BUBBLE_FLAT_CONFIG.locks[part] - BUBBLE_FLAT_CONFIG.delays[part])
    );
    const easedTravel = cubicInOut(travelProgress);
    const orbitAngle = easedTravel * BUBBLE_FLAT_CONFIG.turns * Math.PI * 2;
    const rotatedStart = rotatePoint(BUBBLE_STARTS[part], orbitAngle);
    const radiusScale = Math.pow(
      1 - easedTravel,
      BUBBLE_FLAT_CONFIG.radialPower
    );
    const morphProgress = clamp01(
      (frame - BUBBLE_FLAT_CONFIG.morphStarts[part]) /
        (BUBBLE_FLAT_CONFIG.locks[part] -
          BUBBLE_FLAT_CONFIG.morphStarts[part])
    );
    const pathD =
      morphProgress >= 1
        ? BUBBLE_TARGETS[part]
        : bubbleMorphers[part](cubicInOut(morphProgress));

    return {
      part,
      pathD,
      x: rotatedStart.x * radiusScale,
      y: rotatedStart.y * radiusScale,
      opacity: interpolate(
        frame,
        [BUBBLE_FLAT_CONFIG.delays[part], BUBBLE_FLAT_CONFIG.delays[part] + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ),
    };
  });

  const emblemRawProgress = computeSpring(frame - 160, {
    damping: 18,
    stiffness: 105,
    mass: 0.9,
  });
  const emblemProgress = frame >= 190 ? 1 : emblemRawProgress;
  const emblemScale = interpolate(emblemProgress, [0, 1], [0.72, 1]);
  const emblemOpacity = interpolate(frame, [160, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const emblemPulse = computeSpring(frame - 174, { damping: 11, stiffness: 130 });
  const pulseRadius = interpolate(emblemPulse, [0, 1], [0, 95]);
  const pulseOpacity = interpolate(emblemPulse, [0, 0.2, 1], [0, 0.85, 0], {
    extrapolateRight: 'clamp',
  });

  // 2. Letters E & C Arrival
  const eStartFrame = 200;
  const eRawProgress = computeSpring(frame - eStartFrame, { damping: 17, stiffness: 110, mass: 1.0 });
  const eProgress = frame >= 245 ? 1 : eRawProgress;
  const eX = interpolate(eProgress, [0, 1], [450, 0]);
  const eY = interpolate(eProgress, [0, 1], [40, 0]);
  const eScale = interpolate(eProgress, [0, 1], [0.85, 1]);
  const eOpacity = interpolate(frame, [eStartFrame, eStartFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cStartFrame = 210;
  const cRawProgress = computeSpring(frame - cStartFrame, { damping: 16, stiffness: 105, mass: 1.0 });
  const cProgress = frame >= 245 ? 1 : cRawProgress;
  const cX = interpolate(cProgress, [0, 1], [600, 0]);
  const cY = interpolate(cProgress, [0, 1], [-30, 0]);
  const cScale = interpolate(cProgress, [0, 1], [0.8, 1]);
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
  const cavityIllumination =
    (0.12 + filamentFlash * 0.88) * (1 - rawLogoProgress);
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
  const subtitleProgress = frame >= 300 ? 1 : subtitleRawProgress;
  const subtitleY = interpolate(subtitleProgress, [0, 1], [25, 0]);
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
        className="absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor,
          transform: curtainOpen ? 'translateY(-100%)' : 'translateY(0%)',
          pointerEvents: curtainOpen ? 'none' : 'auto',
        }}
      />

      {/* Bottom Split Panel */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor,
          transform: curtainOpen ? 'translateY(100%)' : 'translateY(0%)',
          pointerEvents: curtainOpen ? 'none' : 'auto',
        }}
      />

      {/* Seam — visible only while the panels travel. A static line across the
          hero bisects the logo; a moving one reads as the split opening. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[rgba(163,4,15,0.28)] transition-opacity duration-300"
        style={{ opacity: curtainOpen ? 1 : 0 }}
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
              {bubbleStates.map(({ part, pathD, x, y, opacity }) => (
                <g
                  key={part}
                  id={`g-bubble-${part}`}
                  transform={`translate(${x} ${y})`}
                  opacity={opacity}
                >
                  <path d={pathD} fill={BUBBLE_COLORS[part]} />
                </g>
              ))}

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
                  transform: `scale(${emblemScale})`,
                  opacity: emblemOpacity,
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
