'use client'

import React from 'react'
import {
  LOGO_COLORS,
  PATH_G_RED,
  PATH_G_YELLOW,
  PATH_G_BLUE,
  PATHS_G_EMBLEM,
  PATH_E,
  PATHS_C,
} from '@/lib/logoData'

export function MatPrintedLogo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`df-mat-printed-mark ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1310.29 510"
        className="df-mat-printed-svg"
        style={{ overflow: 'visible' }}
      >
        {/* Letter G */}
        <g id="mat-letter-G">
          <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
          <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
          <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
          {PATHS_G_EMBLEM.map((pathD, idx) => (
            <path key={idx} d={pathD} fill={LOGO_COLORS.emblem} />
          ))}
        </g>

        {/* Letter E */}
        <g id="mat-letter-E">
          <path d={PATH_E} fill={LOGO_COLORS.red} />
        </g>

        {/* Letter C with bulb */}
        <g id="mat-letter-C">
          <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} />
          <path d={PATHS_C[1].d} fill={LOGO_COLORS.red} />
          <path d={PATHS_C[2].d} fill={LOGO_COLORS.red} />
          <path d={PATHS_C[3].d} fill={LOGO_COLORS.red} />
          <path
            d={PATHS_C[4].d}
            fill="none"
            stroke={LOGO_COLORS.red}
            strokeWidth="0.75"
            strokeMiterlimit={10}
          />
        </g>
      </svg>
    </div>
  )
}
