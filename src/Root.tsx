import React from 'react';
import { Composition } from 'remotion';
import { LogoAnimation } from './LogoAnimation';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary 1080p Light Composition */}
      <Composition
        id="LogoAnimation"
        component={LogoAnimation}
        durationInFrames={210}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
        }}
      />

      {/* Dark Theme Composition */}
      <Composition
        id="LogoAnimationDark"
        component={LogoAnimation}
        durationInFrames={210}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'dark' as const,
          accentGlow: true,
        }}
      />

      {/* Square 1:1 Composition (Ideal for mobile splash screens) */}
      <Composition
        id="LogoAnimationSquare"
        component={LogoAnimation}
        durationInFrames={210}
        fps={60}
        width={1080}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
        }}
      />

      {/* Transparent Composition (for transparent web overlays / WebM) */}
      <Composition
        id="LogoAnimationTransparent"
        component={LogoAnimation}
        durationInFrames={210}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'transparent' as const,
          accentGlow: false,
        }}
      />

      {/* Chrome-inspired rough concept: balanced magnetic snap */}
      <Composition
        id="GEC-Chrome-Snap"
        component={LogoAnimation}
        durationInFrames={240}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'chrome-snap' as const,
        }}
      />

      {/* Chrome-inspired rough concept: energetic orbital convergence */}
      <Composition
        id="GEC-Orbital-Lock"
        component={LogoAnimation}
        durationInFrames={240}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'orbital-lock' as const,
        }}
      />

      {/* Chrome-inspired rough concept: premium staggered assembly */}
      <Composition
        id="GEC-Cascade-Build"
        component={LogoAnimation}
        durationInFrames={240}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'cascade-build' as const,
        }}
      />

      {/* Bubble concept: restrained dimensional spheres, clockwise lock-in */}
      <Composition
        id="GEC-Bubble-Glossy"
        component={LogoAnimation}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'bubble-glossy' as const,
        }}
      />

      {/* Bubble concept: flat brand discs with a longer clockwise vortex */}
      <Composition
        id="GEC-Bubble-Flat"
        component={LogoAnimation}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'bubble-flat' as const,
        }}
      />

      {/* Bubble concept: glossy-to-flat reverse spiral with stronger stagger */}
      <Composition
        id="GEC-Bubble-Hybrid"
        component={LogoAnimation}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'light' as const,
          accentGlow: true,
          concept: 'bubble-hybrid' as const,
        }}
      />
    </>
  );
};
