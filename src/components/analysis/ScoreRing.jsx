import { scoreToColor } from "../../utils/scoreUtils.js"

const FONT_SIZES = {
  48: "text-xs",
  52: "text-xs",
  60: "text-sm",
  72: "text-sm",
  80: "text-base",
  96: "text-lg",
}

function fontSizeForRing(size) {
  const match = Object.keys(FONT_SIZES)
    .map(Number)
    .sort((a, b) => a - b)
    .find((breakpoint) => size <= breakpoint)

  return FONT_SIZES[match ?? 96]
}

export default function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference
  const color = scoreToColor(clampedScore / 10).bar
  const center = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
        opacity={0.2}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-[stroke-dashoffset] duration-500 ease-out"
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className={`fill-foreground font-semibold tabular-nums ${fontSizeForRing(size)}`}
      >
        {Math.round(clampedScore)}
      </text>
    </svg>
  )
}
