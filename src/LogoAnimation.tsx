import React, { useMemo } from 'react';
import { interpolate as interpolateSvgPath } from 'flubber';
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
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
} from './logoData';

type ChromeAnimationConcept =
  | 'chrome-snap'
  | 'orbital-lock'
  | 'cascade-build';

export type BubbleAnimationConcept =
  | 'bubble-glossy'
  | 'bubble-flat'
  | 'bubble-hybrid';

export type LogoAnimationConcept =
  | ChromeAnimationConcept
  | BubbleAnimationConcept;

type GPart = 'red' | 'yellow' | 'blue' | 'emblem';

type Point = {
  x: number;
  y: number;
};

type ConceptConfig = {
  delays: Record<GPart, number>;
  controls: Record<GPart, Point>;
  spring: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  spins: Record<GPart, number>;
  arrivalFrames: number;
  trail: {
    maxLength: number;
    width: number;
    blur: number;
    opacity: number;
  };
};

const G_STARTS: Record<GPart, Point> = {
  red: { x: -1300, y: 0 },
  yellow: { x: 0, y: -900 },
  blue: { x: 1300, y: 0 },
  emblem: { x: 0, y: 900 },
};

const CONCEPT_CONFIGS: Record<ChromeAnimationConcept, ConceptConfig> = {
  'chrome-snap': {
    delays: { red: 0, yellow: 4, blue: 8, emblem: 12 },
    controls: {
      red: { x: -420, y: -220 },
      yellow: { x: 280, y: -300 },
      blue: { x: 420, y: 200 },
      emblem: { x: -160, y: 260 },
    },
    spring: { damping: 16, stiffness: 110, mass: 1 },
    spins: { red: -50, yellow: 60, blue: 75, emblem: 360 },
    arrivalFrames: 48,
    trail: { maxLength: 600, width: 12, blur: 5, opacity: 0.72 },
  },
  'orbital-lock': {
    delays: { red: 0, yellow: 3, blue: 6, emblem: 9 },
    controls: {
      red: { x: -500, y: -430 },
      yellow: { x: 480, y: -350 },
      blue: { x: 520, y: 430 },
      emblem: { x: -380, y: 300 },
    },
    spring: { damping: 11, stiffness: 95, mass: 1.1 },
    spins: { red: -150, yellow: 150, blue: 180, emblem: 360 },
    arrivalFrames: 56,
    trail: { maxLength: 800, width: 14, blur: 8, opacity: 0.84 },
  },
  'cascade-build': {
    delays: { red: 0, yellow: 10, blue: 20, emblem: 30 },
    controls: {
      red: { x: -360, y: -100 },
      yellow: { x: 150, y: -260 },
      blue: { x: 360, y: 100 },
      emblem: { x: -100, y: 280 },
    },
    spring: { damping: 20, stiffness: 105, mass: 0.9 },
    spins: { red: -30, yellow: 35, blue: 45, emblem: 360 },
    arrivalFrames: 42,
    trail: { maxLength: 450, width: 8, blur: 4, opacity: 0.62 },
  },
};

type BubblePart = Exclude<GPart, 'emblem'>;

type BubbleConceptConfig = {
  delays: Record<BubblePart, number>;
  locks: Record<BubblePart, number>;
  morphStarts: Record<BubblePart, number>;
  turns: number;
  direction: 1 | -1;
  radialPower: number;
  glossOpacity: number;
  shadowOpacity: number;
};

const BUBBLE_PARTS: BubblePart[] = ['red', 'yellow', 'blue'];

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

const BUBBLE_CENTERS: Record<BubblePart, Point> = {
  red: LOGO_CENTERS.gRed,
  yellow: LOGO_CENTERS.gYellow,
  blue: LOGO_CENTERS.gBlue,
};

const BUBBLE_CONFIGS: Record<BubbleAnimationConcept, BubbleConceptConfig> = {
  'bubble-glossy': {
    delays: { red: 0, yellow: 10, blue: 20 },
    locks: { red: 144, yellow: 152, blue: 160 },
    morphStarts: { red: 58, yellow: 68, blue: 78 },
    turns: 0.75,
    direction: 1,
    radialPower: 0.82,
    glossOpacity: 0.9,
    shadowOpacity: 0.32,
  },
  'bubble-flat': {
    delays: { red: 0, yellow: 6, blue: 12 },
    locks: { red: 144, yellow: 152, blue: 160 },
    morphStarts: { red: 82, yellow: 90, blue: 98 },
    turns: 1.5,
    direction: 1,
    radialPower: 0.7,
    glossOpacity: 0,
    shadowOpacity: 0,
  },
  'bubble-hybrid': {
    delays: { red: 0, yellow: 14, blue: 28 },
    locks: { red: 140, yellow: 150, blue: 160 },
    morphStarts: { red: 52, yellow: 68, blue: 84 },
    turns: 0.75,
    direction: -1,
    radialPower: 0.88,
    glossOpacity: 0.78,
    shadowOpacity: 0.24,
  },
};

const isBubbleConcept = (
  concept: LogoAnimationConcept
): concept is BubbleAnimationConcept => concept in BUBBLE_CONFIGS;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const circlePath = (center: Point, radius: number) =>
  `M ${center.x - radius},${center.y} ` +
  `a ${radius},${radius} 0 1,0 ${radius * 2},0 ` +
  `a ${radius},${radius} 0 1,0 ${-radius * 2},0 Z`;

const rotatePoint = (point: Point, angle: number): Point => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
});

const BubbleSpiralG: React.FC<{
  concept: BubbleAnimationConcept;
  frame: number;
}> = ({ concept, frame }) => {
  const config = BUBBLE_CONFIGS[concept];
  const morphers = useMemo(
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

  return (
    <>
      <defs>
        {BUBBLE_PARTS.map((part) => (
          <React.Fragment key={part}>
            <radialGradient
              id={`${concept}-${part}-surface`}
              cx="31%"
              cy="25%"
              r="76%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.92} />
              <stop offset="18%" stopColor="#ffffff" stopOpacity={0.42} />
              <stop offset="53%" stopColor={BUBBLE_COLORS[part]} stopOpacity={0.08} />
              <stop offset="100%" stopColor="#42110e" stopOpacity={0.34} />
            </radialGradient>
            <filter
              id={`${concept}-${part}-shadow`}
              x="-35%"
              y="-35%"
              width="170%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feDropShadow
                dx="0"
                dy="11"
                stdDeviation="10"
                floodColor={BUBBLE_COLORS[part]}
                floodOpacity={config.shadowOpacity}
              />
            </filter>
          </React.Fragment>
        ))}
      </defs>

      {BUBBLE_PARTS.map((part) => {
        const travelProgress = clamp01(
          (frame - config.delays[part]) /
            (config.locks[part] - config.delays[part])
        );
        const easedTravel = Easing.inOut(Easing.cubic)(travelProgress);
        const orbitAngle =
          easedTravel * config.turns * Math.PI * 2 * config.direction;
        const rotatedStart = rotatePoint(BUBBLE_STARTS[part], orbitAngle);
        const radiusScale = Math.pow(1 - easedTravel, config.radialPower);
        const x = rotatedStart.x * radiusScale;
        const y = rotatedStart.y * radiusScale;

        const morphProgress = clamp01(
          (frame - config.morphStarts[part]) /
            (config.locks[part] - config.morphStarts[part])
        );
        const easedMorph = Easing.inOut(Easing.cubic)(morphProgress);
        const pathD =
          morphProgress >= 1
            ? BUBBLE_TARGETS[part]
            : morphers[part](easedMorph);
        const glossFade =
          concept === 'bubble-hybrid'
            ? 1 - clamp01(easedMorph / 0.78)
            : 1 - easedMorph;
        const glossOpacity = config.glossOpacity * glossFade;
        const opacity = interpolate(
          frame,
          [config.delays[part], config.delays[part] + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <g
            key={part}
            id={`bubble-part-${part}`}
            transform={`translate(${x} ${y})`}
            opacity={opacity}
            style={{
              filter:
                glossOpacity > 0.004
                  ? `url(#${concept}-${part}-shadow)`
                  : undefined,
            }}
          >
            <path d={pathD} fill={BUBBLE_COLORS[part]} />
            {glossOpacity > 0.004 && (
              <path
                d={pathD}
                fill={`url(#${concept}-${part}-surface)`}
                opacity={glossOpacity}
                stroke="#ffffff"
                strokeOpacity={glossOpacity * 0.34}
                strokeWidth={1.4}
              />
            )}
          </g>
        );
      })}
    </>
  );
};

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

type PartMotion = Point & {
  angle: number;
  progress: number;
};

const getPartMotion = (
  part: GPart,
  progress: number,
  config: ConceptConfig
): PartMotion => {
  const pathProgress = clamp01(progress);
  const point = quadraticPoint(G_STARTS[part], config.controls[part], pathProgress);
  const derivative = quadraticDerivative(
    G_STARTS[part],
    config.controls[part],
    pathProgress
  );

  return {
    ...point,
    angle: (Math.atan2(derivative.y, derivative.x) * 180) / Math.PI,
    progress: pathProgress,
  };
};

const MotionTrail: React.FC<{
  id: string;
  center: Point;
  motion: PartMotion;
  color: string;
  config: ConceptConfig['trail'];
}> = ({ id, center, motion, color, config }) => {
  const derivativeAngle = (motion.angle * Math.PI) / 180;
  const fade = Math.pow(1 - motion.progress, 1.5);
  const length = config.maxLength * (1 - motion.progress);
  const head = { x: center.x + motion.x, y: center.y + motion.y };
  const tail = {
    x: head.x - Math.cos(derivativeAngle) * length,
    y: head.y - Math.sin(derivativeAngle) * length,
  };

  // Avoid degenerate, sub-pixel blurred lines near the spring endpoint. Some
  // Chromium SVG renderers expand those to the full filter region.
  if (fade <= 0.006 || length < 24) {
    return null;
  }

  return (
    <g opacity={fade * config.opacity} pointerEvents="none">
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          gradientUnits="userSpaceOnUse"
          x1={tail.x}
          y1={tail.y}
          x2={head.x}
          y2={head.y}
        >
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="72%" stopColor={color} stopOpacity={0.34} />
          <stop offset="100%" stopColor={color} stopOpacity={0.95} />
        </linearGradient>
        <filter
          id={`${id}-blur`}
          x="-40%"
          y="-400%"
          width="180%"
          height="900%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={config.blur} />
        </filter>
      </defs>
      <line
        x1={tail.x}
        y1={tail.y}
        x2={head.x}
        y2={head.y}
        stroke={`url(#${id}-gradient)`}
        strokeWidth={config.width * 1.8}
        strokeLinecap="round"
        filter={`url(#${id}-blur)`}
      />
      <line
        x1={tail.x}
        y1={tail.y}
        x2={head.x}
        y2={head.y}
        stroke={`url(#${id}-gradient)`}
        strokeWidth={config.width * 0.42}
        strokeLinecap="round"
      />
    </g>
  );
};

export interface LogoAnimationProps {
  theme?: 'light' | 'dark' | 'transparent';
  accentGlow?: boolean;
  concept?: LogoAnimationConcept;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  theme = 'light',
  accentGlow = true,
  concept = 'chrome-snap',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conceptIsBubble = isBubbleConcept(concept);
  const bubbleConcept = conceptIsBubble ? concept : null;
  const chromeConcept: ChromeAnimationConcept = conceptIsBubble
    ? 'chrome-snap'
    : concept;
  const conceptConfig = CONCEPT_CONFIGS[chromeConcept];
  const rawLogoProgress = bubbleConcept
    ? interpolate(frame, [324, 336], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // =========================================================================
  // 1. CHROME-INSPIRED SEGMENTED 'G' ASSEMBLY (Frames 0 - 75)
  // =========================================================================

  // Center offset distance: from G's resting X (234.6) to Screen Center (655.1) = +420.5px
  const G_CENTER_OFFSET_X = LOGO_CENTERS.overall.x - LOGO_CENTERS.gGroup.x; // ~420.5px

  // The assembled G glides from the hero position into the final lockup.
  const gSlideStartFrame = bubbleConcept ? 190 : 76;
  const gSlideRawProgress = spring({
    frame: frame - gSlideStartFrame,
    fps,
    config: { damping: 16, stiffness: 95, mass: 1.0 },
  });
  const gSlideToLeftProgress =
    bubbleConcept && frame >= 225 ? 1 : gSlideRawProgress;
  const gGroupOffsetX = interpolate(gSlideToLeftProgress, [0, 1], [G_CENTER_OFFSET_X, 0]);

  const partProgress = (part: GPart) =>
    spring({
      frame: frame - conceptConfig.delays[part],
      fps,
      durationInFrames: conceptConfig.arrivalFrames,
      config: conceptConfig.spring,
    });

  const gRedProgress = partProgress('red');
  const gYellowProgress = partProgress('yellow');
  const gBlueProgress = partProgress('blue');
  const gEmblemProgress = partProgress('emblem');

  const gRedMotion = getPartMotion('red', gRedProgress, conceptConfig);
  const gYellowMotion = getPartMotion('yellow', gYellowProgress, conceptConfig);
  const gBlueMotion = getPartMotion('blue', gBlueProgress, conceptConfig);
  const gEmblemMotion = getPartMotion('emblem', gEmblemProgress, conceptConfig);

  const partOpacity = (part: GPart) =>
    interpolate(
      frame,
      [conceptConfig.delays[part], conceptConfig.delays[part] + 10],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

  const partRotation = (part: GPart, motion: PartMotion) =>
    (1 - motion.progress) *
    (conceptConfig.spins[part] + motion.angle * (part === 'emblem' ? 0.08 : 0.32));

  const gRedScale = interpolate(gRedMotion.progress, [0, 1], [1.18, 1]);
  const gYellowScale = interpolate(gYellowMotion.progress, [0, 1], [1.14, 1]);
  const gBlueScale = interpolate(gBlueMotion.progress, [0, 1], [1.14, 1]);
  const gEmblemScale = interpolate(gEmblemMotion.progress, [0, 1], [0.2, 1]);

  // Emblem lock-in pulse ring as crescents snap into place
  const bubbleEmblemProgress = bubbleConcept
    ? spring({
        frame: frame - 160,
        fps,
        durationInFrames: 30,
        config: { damping: 18, stiffness: 105, mass: 0.9 },
      })
    : 0;
  const bubbleEmblemOpacity = bubbleConcept
    ? interpolate(frame, [160, 178], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
  const bubbleEmblemScale = bubbleConcept && frame >= 190
    ? 1
    : interpolate(bubbleEmblemProgress, [0, 1], [0.72, 1]);

  const emblemPulse = spring({
    frame: frame - (bubbleConcept ? 174 : 66),
    fps,
    config: { damping: 11, stiffness: 130 },
  });
  const pulseRadius = interpolate(emblemPulse, [0, 1], [0, 95]);
  const pulseOpacity = interpolate(emblemPulse, [0, 0.2, 1], [0, 0.85, 0], {
    extrapolateRight: 'clamp',
  });

  // =========================================================================
  // 2. LETTERS 'E' & 'C' ARRIVAL (Frames 76 - 120)
  // =========================================================================

  // --- LETTER 'E' ---
  const eStartFrame = bubbleConcept ? 200 : 76;
  const eRawProgress = spring({
    frame: frame - eStartFrame,
    fps,
    config: { damping: 17, stiffness: 110, mass: 1.0 },
  });
  const eProgress = bubbleConcept && frame >= 245 ? 1 : eRawProgress;
  const eX = interpolate(eProgress, [0, 1], [450, 0]);
  const eY = interpolate(eProgress, [0, 1], [40, 0]);
  const eScale = interpolate(eProgress, [0, 1], [0.85, 1]);
  const eOpacity = interpolate(frame, [eStartFrame, eStartFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- LETTER 'C' ---
  const cStartFrame = bubbleConcept ? 210 : 84;
  const cRawProgress = spring({
    frame: frame - cStartFrame,
    fps,
    config: { damping: 16, stiffness: 105, mass: 1.0 },
  });
  const cProgress = bubbleConcept && frame >= 245 ? 1 : cRawProgress;
  const cX = interpolate(cProgress, [0, 1], [600, 0]);
  const cY = interpolate(cProgress, [0, 1], [-30, 0]);
  const cScale = interpolate(cProgress, [0, 1], [0.8, 1]);
  const cOpacity = interpolate(frame, [cStartFrame, cStartFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =========================================================================
  // 3. CLEAN BULB FILAMENT GLOW (Seamlessly integrated into logo geometry)
  // No artificial misaligned ellipses; filament pulses with amber/gold electric surge
  // =========================================================================
  const bulbStartFrame = bubbleConcept ? 245 : 108;
  const bulbSparkFrame = frame - bulbStartFrame;
  const bulbEnvelope = interpolate(
    bulbSparkFrame,
    [0, 7, 38, 48],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const sinePulse = 0.5 + 0.5 * Math.sin(bulbSparkFrame * 0.55 - Math.PI / 2);
  const bubbleBulbProgress = clamp01(bulbSparkFrame / 55);
  const bubbleTwoPulse = Math.pow(
    0.5 - 0.5 * Math.cos(bubbleBulbProgress * Math.PI * 4),
    1.18
  );
  const bubbleBulbEnvelope = interpolate(
    bulbSparkFrame,
    [0, 8, 50, 55],
    [0, 1, 1, 0.35],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const filamentFlash = bubbleConcept
    ? frame > 300
      ? 0.35
      : bubbleBulbEnvelope * (0.22 + bubbleTwoPulse * 0.78)
    : bulbEnvelope * (0.5 + sinePulse * 0.5);
  const visibleFilamentFlash = filamentFlash * (1 - rawLogoProgress);
  const filamentStrokeWidth = 0.75 + visibleFilamentFlash * 1.1;
  const filamentColor = visibleFilamentFlash;

  // Interpolated color between #c43128 and #ffcc00
  const filamentStroke = filamentColor > 0.05
    ? `rgb(${Math.round(196 + filamentColor * 59)}, ${Math.round(49 + filamentColor * 155)}, ${Math.round(40 - filamentColor * 40)})`
    : LOGO_COLORS.red;

  // =========================================================================
  // 4. SUBTITLE: "GALGOTIAS ENTREPRENEURSHIP CELL" (Frames 85 - 130)
  // =========================================================================
  const subtitleStartFrame = bubbleConcept ? 245 : 112;
  const subtitleRawProgress = spring({
    frame: frame - subtitleStartFrame,
    fps,
    config: { damping: 20, stiffness: 95 },
  });
  const subtitleProgress =
    bubbleConcept && frame >= 300 ? 1 : subtitleRawProgress;
  const subtitleY = interpolate(subtitleProgress, [0, 1], [25, 0]);
  const subtitleOpacity = interpolate(frame, [subtitleStartFrame, subtitleStartFrame + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =========================================================================
  // 5. SHIMMER LIGHT BEAM & FINAL HOLD (Frames 155 - 239)
  // =========================================================================
  const shimmerStartFrame = bubbleConcept ? 305 : 155;
  const shimmerDuration = bubbleConcept ? 30 : 40;
  const shimmerFrame = frame - shimmerStartFrame;
  const shimmerX = interpolate(shimmerFrame, [0, shimmerDuration], [-300, 1600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmerOpacity = interpolate(
    shimmerFrame,
    bubbleConcept ? [0, 6, 24, 30] : [0, 8, 32, 40],
    [0, 0.45, 0.45, 0],
    {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    }
  );

  const finalBreath = interpolate(
    frame,
    bubbleConcept ? [306, 321, 336] : [150, 180, 210],
    bubbleConcept ? [1, 1.008, 1] : [1, 1.015, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Styling
  const bgStyle: React.CSSProperties = useMemo(() => {
    if (theme === 'transparent') {
      return { backgroundColor: 'transparent' };
    }
    if (theme === 'dark') {
      return {
        background: 'radial-gradient(circle at 50% 50%, #151821 0%, #0a0b10 100%)',
      };
    }
    return {
      background: 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f4f6f9 100%)',
    };
  }, [theme]);

  const textColor = theme === 'dark' ? '#d1d5db' : LOGO_COLORS.grey;
  const emblemFill = theme === 'dark' ? '#f3f4f6' : LOGO_COLORS.emblem;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...bgStyle,
      }}
    >
      {/* Ambient background glow */}
      {accentGlow && (
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 480,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(196, 49, 40, 0.12) 0%, rgba(252, 204, 0, 0.08) 40%, rgba(15, 117, 188, 0.05) 70%, transparent 100%)`,
            opacity: 0.32 * (1 - rawLogoProgress),
            transform: `scale(${finalBreath})`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* SVG Canvas Container */}
      <div
        style={{
          width: '75%',
          maxWidth: 1400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${finalBreath})`,
          filter: rawLogoProgress >= 1
            ? 'none'
            : theme === 'dark'
              ? `drop-shadow(0 15px 35px rgba(0, 0, 0, ${0.6 * (1 - rawLogoProgress)}))`
              : `drop-shadow(0 12px 30px rgba(0, 0, 0, ${0.07 * (1 - rawLogoProgress)}))`,
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
              <stop offset="0%" stopColor="#fff4b0" stopOpacity={0.58} />
              <stop offset="38%" stopColor="#fccc00" stopOpacity={0.3} />
              <stop offset="74%" stopColor="#dc672f" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7c7" stopOpacity={visibleFilamentFlash} />
              <stop offset="24%" stopColor="#fccc00" stopOpacity={visibleFilamentFlash * 0.95} />
              <stop offset="55%" stopColor="#ef7b2d" stopOpacity={visibleFilamentFlash * 0.62} />
              <stop offset="78%" stopColor="#c43128" stopOpacity={visibleFilamentFlash * 0.32} />
              <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
            </radialGradient>
            <clipPath id="bulbCavityClip">
              <circle cx="1120" cy="285" r="116" />
            </clipPath>
            <filter id="cInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
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
          </defs>
          <defs>
            <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={shimmerOpacity} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Clean filament electric glow filter */}
            <filter id="filamentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* GROUP 1: THE LETTER 'G' (Chrome-inspired assembly)       */}
          {/* ======================================================== */}
          <g
            id="letter-G-group"
            style={{
              transform: `translateX(${gGroupOffsetX}px)`,
            }}
          >
            {bubbleConcept ? (
              <BubbleSpiralG concept={bubbleConcept} frame={frame} />
            ) : (
              <>
                <MotionTrail
                  id={`trail-${concept}-red`}
                  center={LOGO_CENTERS.gRed}
                  motion={gRedMotion}
                  color={LOGO_COLORS.red}
                  config={conceptConfig.trail}
                />
                <MotionTrail
                  id={`trail-${concept}-yellow`}
                  center={LOGO_CENTERS.gYellow}
                  motion={gYellowMotion}
                  color={LOGO_COLORS.yellow}
                  config={conceptConfig.trail}
                />
                <MotionTrail
                  id={`trail-${concept}-blue`}
                  center={LOGO_CENTERS.gBlue}
                  motion={gBlueMotion}
                  color={LOGO_COLORS.blue}
                  config={conceptConfig.trail}
                />

                <g
                  id="g-part-red"
                  style={{
                    transformOrigin: `${LOGO_CENTERS.gRed.x}px ${LOGO_CENTERS.gRed.y}px`,
                    transform: `translate(${gRedMotion.x}px, ${gRedMotion.y}px) rotate(${partRotation('red', gRedMotion)}deg) scale(${gRedScale})`,
                    opacity: partOpacity('red'),
                  }}
                >
                  <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
                </g>

                <g
                  id="g-part-yellow"
                  style={{
                    transformOrigin: `${LOGO_CENTERS.gYellow.x}px ${LOGO_CENTERS.gYellow.y}px`,
                    transform: `translate(${gYellowMotion.x}px, ${gYellowMotion.y}px) rotate(${partRotation('yellow', gYellowMotion)}deg) scale(${gYellowScale})`,
                    opacity: partOpacity('yellow'),
                  }}
                >
                  <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
                </g>

                <g
                  id="g-part-blue"
                  style={{
                    transformOrigin: `${LOGO_CENTERS.gBlue.x}px ${LOGO_CENTERS.gBlue.y}px`,
                    transform: `translate(${gBlueMotion.x}px, ${gBlueMotion.y}px) rotate(${partRotation('blue', gBlueMotion)}deg) scale(${gBlueScale})`,
                    opacity: partOpacity('blue'),
                  }}
                >
                  <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
                </g>
              </>
            )}

            {/* 1.4 Saraswati Sacred Emblem Pulse Ring */}
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

            {/* 1.5 Saraswati Emblem */}
            <g
              id="g-part-emblem"
              style={{
                transformOrigin: `${LOGO_CENTERS.gEmblem.x}px ${LOGO_CENTERS.gEmblem.y}px`,
                transform: bubbleConcept
                  ? `scale(${bubbleEmblemScale})`
                  : `translate(${gEmblemMotion.x}px, ${gEmblemMotion.y}px) rotate(${partRotation('emblem', gEmblemMotion)}deg) scale(${gEmblemScale})`,
                opacity: bubbleConcept
                  ? bubbleEmblemOpacity
                  : partOpacity('emblem'),
              }}
            >
              {PATHS_G_EMBLEM.map((pathD, idx) => (
                <path key={idx} d={pathD} fill={emblemFill} />
              ))}
            </g>
          </g>

          {/* ======================================================== */}
          {/* GROUP 2: THE LETTER 'E'                                  */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* GROUP 3: THE LETTER 'C' + CLEAN BULB FILAMENT IGNITION   */}
          {/* ======================================================== */}
            <g
              id="letter-C"
              style={{
                transformOrigin: `${LOGO_CENTERS.c.x}px ${LOGO_CENTERS.c.y}px`,
                transform: `translate(${cX}px, ${cY}px) scale(${cScale})`,
                opacity: cOpacity,
              }}
            >
              {/* Shadow and additive light sit behind the natural bulb cutout. */}
              <g clipPath="url(#bulbCavityClip)">
                <circle
                  cx="1120"
                  cy="285"
                  r="116"
                  fill="url(#cavityShadow)"
                  opacity={1 - rawLogoProgress}
                />
                <circle
                  cx="1120"
                  cy="285"
                  r="132"
                  fill="url(#bulbGlow)"
                  opacity={visibleFilamentFlash}
                  style={{ mixBlendMode: 'screen' }}
                />
              </g>

              {/* Outer red body of C reveals the effect through its cavity. */}
              <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} />
              <path
                d={PATHS_C[0].d}
                fill={LOGO_COLORS.red}
                filter="url(#cInnerShadow)"
                opacity={1 - rawLogoProgress}
              />

              {/* Inner bulb reflection accent */}
              <path d={PATHS_C[1].d} fill={LOGO_COLORS.red} />

            {/* Bulb top glossy reflection arc */}
            <path
              d={PATHS_C[2].d}
              fill={visibleFilamentFlash > 0.3 ? '#ffe066' : LOGO_COLORS.red}
            />

            {/* Bulb base cap accent */}
            <path d={PATHS_C[3].d} fill={LOGO_COLORS.red} />

            {/* Bulb Filament Line - Lights up with brilliant electric warmth */}
            <path
              d={PATHS_C[4].d}
              fill="none"
              stroke={filamentStroke}
              strokeWidth={filamentStrokeWidth}
              strokeMiterlimit={10}
              filter={visibleFilamentFlash > 0.2 ? 'url(#filamentGlow)' : undefined}
            />
          </g>

          {/* ======================================================== */}
          {/* GROUP 4: SUBTITLE (GALGOTIAS ENTREPRENEURSHIP CELL)      */}
          {/* ======================================================== */}
          <g
            id="subtitle-group"
            style={{
              transformOrigin: `${LOGO_CENTERS.subtitle.x}px ${LOGO_CENTERS.subtitle.y}px`,
              transform: `translateY(${subtitleY}px)`,
              opacity: subtitleOpacity,
            }}
          >
            {PATHS_SUBTITLE.map((item, idx) => {
              const letterStaggerFrame = frame - (subtitleStartFrame + idx * 0.9);
              const letterRawProgress = spring({
                frame: letterStaggerFrame,
                fps,
                config: { damping: 15, stiffness: 120 },
              });
              const letterProgress =
                bubbleConcept && frame >= 300 ? 1 : letterRawProgress;
              const letterY = interpolate(letterProgress, [0, 1], [15, 0]);
              const letterOpacity = interpolate(letterStaggerFrame, [0, 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <path
                  key={idx}
                  d={item.d}
                  fill={textColor}
                  stroke={textColor}
                  strokeWidth={0.5}
                  strokeMiterlimit={10}
                  style={{
                    transform: `translateY(${letterY}px)`,
                    opacity: letterOpacity,
                  }}
                />
              );
            })}
          </g>

          {/* ======================================================== */}
          {/* SHIMMER LIGHT BEAM PASSING ACROSS                        */}
          {/* ======================================================== */}
          {shimmerOpacity > 0 && (
            <rect
              x={shimmerX}
              y={0}
              width={180}
              height={LOGO_HEIGHT}
              fill="url(#shimmerGradient)"
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
