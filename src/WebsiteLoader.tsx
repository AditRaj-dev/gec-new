import React, { useEffect, useState, useRef } from 'react';
import {
  LOGO_VIEWBOX,
  LOGO_WIDTH,
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
} from './logoData';

export interface WebsiteLoaderProps {
  /** Theme styling */
  theme?: 'light' | 'dark';
  /** Total animation duration in milliseconds (default: 3500ms) */
  durationMs?: number;
  /** Callback triggered when the intro animation completes */
  onComplete?: () => void;
  /** Whether to automatically fade out the loader overlay after completion */
  autoDismiss?: boolean;
  /** Delay in ms before fading out after settle (default: 500ms) */
  dismissDelayMs?: number;
}

/**
 * High-performance, zero-dependency Website Loader Component
 * Features circular inward spiral motion for G's elements and clean bulb filament illumination.
 */
export const WebsiteLoader: React.FC<WebsiteLoaderProps> = ({
  theme = 'light',
  durationMs = 3500,
  onComplete,
  autoDismiss = true,
  dismissDelayMs = 500,
}) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const p = Math.min(elapsed / durationMs, 1);
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
        if (autoDismiss) {
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsDismissed(true);
            }, 600);
          }, dismissDelayMs);
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, onComplete, autoDismiss, dismissDelayMs]);

  if (isDismissed) return null;

  // Frame simulation at 60fps
  const currentFrame = progress * (durationMs / 1000) * 60;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  const getSubProgress = (startFrame: number, endFrame: number) => {
    if (currentFrame <= startFrame) return 0;
    if (currentFrame >= endFrame) return 1;
    return (currentFrame - startFrame) / (endFrame - startFrame);
  };

  const calcCircular = (
    p: number,
    initialRadius: number,
    spiralAngleDeg: number,
    selfRotDeg: number,
    initialScale: number
  ) => {
    const r = (1 - p) * initialRadius;
    const angle = (1 - p) * spiralAngleDeg;
    const rad = (angle * Math.PI) / 180;
    const dx = r * Math.cos(rad);
    const dy = r * Math.sin(rad);
    const rotate = (1 - p) * selfRotDeg;
    const scale = initialScale + p * (1 - initialScale);
    return { dx, dy, rotate, scale };
  };

  // --- CENTERED HERO G ASSEMBLY & GLIDE ---
  const G_CENTER_OFFSET_X = 420.5;
  const gGlideP = easeOutCubic(getSubProgress(52, 90));
  const gGroupOffsetX = (1 - gGlideP) * G_CENTER_OFFSET_X;

  // --- 1. G RED (From Left) ---
  const gRedP = easeOutBack(getSubProgress(6, 48));
  const gRedMotion = { dx: (1 - gRedP) * -LOGO_WIDTH, dy: 0, rotate: (1 - gRedP) * -90, scale: 1 + (1 - gRedP) * 0.5 };
  const gRedOpacity = Math.min(getSubProgress(6, 18), 1);

  // --- 2. G YELLOW (From Top) ---
  const gYellowP = easeOutBack(getSubProgress(14, 54));
  const gYellowMotion = { dx: 0, dy: (1 - gYellowP) * -LOGO_HEIGHT * 1.5, rotate: (1 - gYellowP) * 90, scale: 1 + (1 - gYellowP) * 0.5 };
  const gYellowOpacity = Math.min(getSubProgress(14, 26), 1);

  // --- 3. G BLUE (From Right) ---
  const gBlueP = easeOutBack(getSubProgress(22, 60));
  const gBlueMotion = { dx: (1 - gBlueP) * LOGO_WIDTH, dy: 0, rotate: (1 - gBlueP) * 180, scale: 1 + (1 - gBlueP) * 0.5 };
  const gBlueOpacity = Math.min(getSubProgress(22, 34), 1);

  // --- 4. G EMBLEM (From Bottom) ---
  const gEmblemP = easeOutBack(getSubProgress(30, 70));
  const gEmblemScale = 0.2 + gEmblemP * 0.8;
  const gEmblemRot = (1 - gEmblemP) * 360;
  const gEmblemMotion = { dx: 0, dy: (1 - gEmblemP) * LOGO_HEIGHT * 1.5 };
  const gEmblemOpacity = Math.min(getSubProgress(30, 44), 1);

  // Emblem Pulse
  const pulseP = getSubProgress(48, 78);
  const pulseRadius = pulseP * 95;
  const pulseOpacity = pulseP > 0 && pulseP < 1 ? (1 - pulseP) * 0.85 : 0;

  // --- 5. LETTER E ---
  const eP = easeOutCubic(getSubProgress(55, 95));
  const eX = (1 - eP) * 450;
  const eY = (1 - eP) * 40;
  const eScale = 0.85 + eP * 0.15;
  const eOpacity = Math.min(getSubProgress(55, 68), 1);

  // --- 6. LETTER C ---
  const cP = easeOutCubic(getSubProgress(63, 103));
  const cX = (1 - cP) * 600;
  const cY = (1 - cP) * -30;
  const cScale = 0.8 + cP * 0.2;
  const cOpacity = Math.min(getSubProgress(63, 76), 1);

  // --- 7. CLEAN BULB FILAMENT GLOW ---
  const bulbSparkP = getSubProgress(84, 116);
  const filamentFlash = bulbSparkP > 0 && bulbSparkP < 1
    ? Math.sin(bulbSparkP * Math.PI)
    : 0;
  const filamentStrokeWidth = 0.75 + filamentFlash * 0.85;
  const filamentColor = filamentFlash > 0.3 ? '#fccc00' : LOGO_COLORS.red;

  // --- 8. SUBTITLE ---
  const subtitleP = easeOutCubic(getSubProgress(85, 130));
  const subtitleY = (1 - subtitleP) * 25;
  const subtitleOpacity = Math.min(getSubProgress(85, 110), 1);

  // --- 9. SHIMMER ---
  const shimmerP = getSubProgress(125, 170);
  const shimmerX = -300 + shimmerP * 1900;
  const shimmerOpacity = shimmerP > 0 && shimmerP < 1 
    ? Math.sin(shimmerP * Math.PI) * 0.45 
    : 0;

  const isDark = theme === 'dark';
  const bgGradient = isDark
    ? 'radial-gradient(circle at 50% 50%, #151821 0%, #0a0b10 100%)'
    : 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f4f6f9 100%)';
  const textColor = isDark ? '#d1d5db' : LOGO_COLORS.grey;
  const emblemFill = isDark ? '#f3f4f6' : LOGO_COLORS.emblem;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgGradient,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 480,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(196, 49, 40, 0.12) 0%, rgba(252, 204, 0, 0.08) 40%, rgba(15, 117, 188, 0.05) 70%, transparent 100%)`,
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />

      {/* SVG Canvas Container */}
      <div
        style={{
          width: '75%',
          maxWidth: 1300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: isDark
            ? 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6))'
            : 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.07))',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={LOGO_VIEWBOX}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="cavityShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity={0.65} />
              <stop offset="70%" stopColor="#000000" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fccc00" stopOpacity={filamentFlash * 0.9} />
              <stop offset="40%" stopColor="#c43128" stopOpacity={filamentFlash * 0.5} />
              <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
            </radialGradient>
            <filter id="cInnerShadow">
              <feOffset dx="6" dy="6" />
              <feGaussianBlur stdDeviation="8" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
            <linearGradient id="webShimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={shimmerOpacity} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <filter id="webFilamentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Group: G (Circular Motion) */}
          <g
            id="letter-G-group"
            style={{
              transform: `translateX(${gGroupOffsetX}px)`,
            }}
          >
            {/* 1.1 Red Outer Crescent */}
            <g
              style={{
                transformOrigin: `${LOGO_CENTERS.gRed.x}px ${LOGO_CENTERS.gRed.y}px`,
                transform: `translate(${gRedMotion.dx}px, ${gRedMotion.dy}px) rotate(${gRedMotion.rotate}deg) scale(${gRedMotion.scale})`,
                opacity: gRedOpacity,
              }}
            >
              <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
              <line x1={LOGO_CENTERS.gRed.x} y1={LOGO_CENTERS.gRed.y} x2={LOGO_CENTERS.gRed.x - 1000} y2={LOGO_CENTERS.gRed.y} stroke={LOGO_COLORS.red} strokeWidth="12" strokeLinecap="round" style={{ opacity: (1 - gRedP) * 0.8 }} />
            </g>

            {/* 1.2 Yellow Inner Crescent */}
            <g
              style={{
                transformOrigin: `${LOGO_CENTERS.gYellow.x}px ${LOGO_CENTERS.gYellow.y}px`,
                transform: `translate(${gYellowMotion.dx}px, ${gYellowMotion.dy}px) rotate(${gYellowMotion.rotate}deg) scale(${gYellowMotion.scale})`,
                opacity: gYellowOpacity,
              }}
            >
              <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
              <line x1={LOGO_CENTERS.gYellow.x} y1={LOGO_CENTERS.gYellow.y} x2={LOGO_CENTERS.gYellow.x} y2={LOGO_CENTERS.gYellow.y - 1000} stroke={LOGO_COLORS.yellow} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gYellowP) * 0.8 }} />
            </g>

            {/* 1.3 Blue Innermost Crescent */}
            <g
              style={{
                transformOrigin: `${LOGO_CENTERS.gBlue.x}px ${LOGO_CENTERS.gBlue.y}px`,
                transform: `translate(${gBlueMotion.dx}px, ${gBlueMotion.dy}px) rotate(${gBlueMotion.rotate}deg) scale(${gBlueMotion.scale})`,
                opacity: gBlueOpacity,
              }}
            >
              <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
              <line x1={LOGO_CENTERS.gBlue.x} y1={LOGO_CENTERS.gBlue.y} x2={LOGO_CENTERS.gBlue.x + 1000} y2={LOGO_CENTERS.gBlue.y} stroke={LOGO_COLORS.blue} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gBlueP) * 0.8 }} />
            </g>

            {/* 1.4 Saraswati Sacred Emblem Pulse Ring */}
            {pulseOpacity > 0 && (
              <circle
                cx={LOGO_CENTERS.gEmblem.x}
                cy={LOGO_CENTERS.gEmblem.y}
                r={pulseRadius}
                fill="none"
                stroke={LOGO_COLORS.emblem}
                strokeWidth={3}
                style={{ opacity: pulseOpacity }}
              />
            )}

            {/* 1.4 Saraswati Emblem */}
            <g
              style={{
                transformOrigin: `${LOGO_CENTERS.gEmblem.x}px ${LOGO_CENTERS.gEmblem.y}px`,
                transform: `translate(${gEmblemMotion.dx}px, ${gEmblemMotion.dy}px) rotate(${gEmblemRot}deg) scale(${gEmblemScale})`,
                opacity: gEmblemOpacity,
              }}
            >
              {PATHS_G_EMBLEM.map((pathD, idx) => (
                <path
                  key={idx}
                  d={pathD}
                  fill={emblemFill}
                />
              ))}
            </g>
          </g>

          {/* Group: E */}
          <g
            style={{
              transformOrigin: `${LOGO_CENTERS.e.x}px ${LOGO_CENTERS.e.y}px`,
              transform: `translate(${eX}px, ${eY}px) scale(${eScale})`,
              opacity: eOpacity,
            }}
          >
            <path d={PATH_E} fill={LOGO_COLORS.red} />
          </g>

          {/* Group: C (With authentic filament illumination) */}
          <g
            style={{
              transformOrigin: `${LOGO_CENTERS.c.x}px ${LOGO_CENTERS.c.y}px`,
              transform: `translate(${cX}px, ${cY}px) scale(${cScale})`,
              opacity: cOpacity,
            }}
          >
            {/* Outer red C */}
            <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} filter="url(#cInnerShadow)" />

            {/* Cavity shadow & Glow */}
            <circle cx="1120" cy="285" r="140" fill="url(#cavityShadow)" />
            <circle cx="1120" cy="285" r="160" fill="url(#bulbGlow)" style={{ mixBlendMode: 'screen' }} />

            {/* Reflection accent */}
            <path d={PATHS_C[1].d} fill={LOGO_COLORS.red} />
            {/* Top gloss */}
            <path
              d={PATHS_C[2].d}
              fill={filamentFlash > 0.3 ? '#ffe066' : LOGO_COLORS.red}
              style={{ transition: 'fill 0.15s ease' }}
            />
            {/* Screw base cap */}
            <path d={PATHS_C[3].d} fill={LOGO_COLORS.red} />
            {/* Filament */}
            <path
              d={PATHS_C[4].d}
              fill="none"
              stroke={filamentColor}
              strokeWidth={filamentStrokeWidth}
              strokeMiterlimit={10}
              filter={filamentFlash > 0.2 ? 'url(#webFilamentGlow)' : undefined}
            />
          </g>

          {/* Group: Subtitle */}
          <g
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

          {/* Shimmer Beam */}
          {shimmerOpacity > 0 && (
            <rect
              x={shimmerX}
              y={0}
              width={180}
              height={LOGO_HEIGHT}
              fill="url(#webShimmerGradient)"
              transform="skewX(-25)"
              pointerEvents="none"
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </svg>
      </div>
    </div>
  );
};
