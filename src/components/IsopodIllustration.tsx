import type { Product } from "@/lib/products";

interface Props {
  colors: Product["colors"];
  pattern: Product["pattern"];
  className?: string;
  label?: string;
  /** Explicit pixel size (needed when rendered inside next/og images). */
  size?: number;
}

export default function IsopodIllustration({ colors, pattern, className, label = "Stylized isopod illustration", size }: Props) {
  const [base, accent, dark] = colors;
  const segments = [0, 1, 2, 3, 4, 5, 6];

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={`bg-${base}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#f6f1e4" />
          <stop offset="100%" stopColor="#e7dcc4" />
        </radialGradient>
      </defs>
      <rect width="240" height="240" rx="20" fill={`url(#bg-${base})`} />

      <g transform="translate(120 128)">
        {/* head */}
        <ellipse cx="0" cy="-72" rx="26" ry="20" fill={dark} />
        <circle cx="-9" cy="-76" r="3" fill="#111" />
        <circle cx="9" cy="-76" r="3" fill="#111" />
        {/* antennae */}
        <path d="M -8 -88 C -20 -100, -28 -98, -34 -108" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 8 -88 C 20 -100, 28 -98, 34 -108" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* body segments */}
        {segments.map((i) => {
          const y = -46 + i * 20;
          const widthScale = 1 - Math.abs(i - 3) * 0.06;
          let fill = base;
          if (pattern === "banded" && i % 2 === 0) fill = accent;
          if (pattern === "spotted") fill = base;
          if (pattern === "marbled" && i % 3 === 0) fill = accent;
          return (
            <g key={i}>
              <rect
                x={-38 * widthScale}
                y={y}
                width={76 * widthScale}
                height="22"
                rx="11"
                fill={fill}
                stroke={dark}
                strokeWidth="1.5"
              />
              {pattern === "spotted" && (
                <>
                  <circle cx={-18 * widthScale} cy={y + 11} r="3.4" fill={dark} />
                  <circle cx={16 * widthScale} cy={y + 11} r="3.4" fill={dark} />
                </>
              )}
            </g>
          );
        })}

        {/* tail plate */}
        <ellipse cx="0" cy="98" rx="30" ry="16" fill={dark} />

        {/* legs */}
        {segments.map((i) => {
          const y = -40 + i * 20;
          return (
            <g key={`legs-${i}`}>
              <path d={`M ${-40} ${y + 10} q -14 6 -18 16`} stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d={`M ${40} ${y + 10} q 14 6 18 16`} stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
