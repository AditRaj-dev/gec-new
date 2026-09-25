import {
  LOGO_COLORS,
  LOGO_VIEWBOX,
  PATH_E,
  PATH_G_BLUE,
  PATH_G_RED,
  PATH_G_YELLOW,
  PATHS_C,
  PATHS_G_EMBLEM,
  PATHS_SUBTITLE,
} from "@/lib/logoData";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-label="Galgotias Entrepreneurship Cell"
      className={className}
      role="img"
      viewBox={LOGO_VIEWBOX}
    >
      <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
      <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
      <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
      {PATHS_G_EMBLEM.map((path, index) => (
        <path d={path} fill={LOGO_COLORS.emblem} key={index} />
      ))}
      <path d={PATH_E} fill={LOGO_COLORS.red} />
      {PATHS_C.slice(0, 4).map((path, index) => (
        <path d={path.d} fill={LOGO_COLORS.red} key={index} />
      ))}
      <path
        d={PATHS_C[4].d}
        fill="none"
        stroke={LOGO_COLORS.red}
        strokeMiterlimit={10}
        strokeWidth="0.75"
      />
      {PATHS_SUBTITLE.map((path, index) => (
        <path
          d={path.d}
          fill={LOGO_COLORS.grey}
          key={index}
          stroke={LOGO_COLORS.grey}
          strokeMiterlimit={10}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

