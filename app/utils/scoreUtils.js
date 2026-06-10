const SCORE_BANDS = [
  {
    min: 8,
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    bar: "#10b981",
  },
  {
    min: 6,
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    bar: "#f59e0b",
  },
  {
    min: 4,
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    bar: "#f97316",
  },
  {
    min: 0,
    bg: "bg-red-500/10",
    text: "text-red-600",
    bar: "#ef4444",
  },
]

const VERDICT_COLORS = {
  "Strong hire": "#10b981",
  Hire: "#84cc16",
  Borderline: "#f59e0b",
  "No hire": "#ef4444",
}

export function scoreToColor(score) {
  const band =
    SCORE_BANDS.find((entry) => score >= entry.min) ??
    SCORE_BANDS[SCORE_BANDS.length - 1]

  return { bg: band.bg, text: band.text, bar: band.bar }
}

export function verdictToColor(verdict) {
  return VERDICT_COLORS[verdict] ?? "#6b7280"
}

export function formatDimension(key) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatDate(iso) {
  const date = new Date(iso)

  const day = date.getDate()
  const month = date.toLocaleString("en-GB", { month: "short" })
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const period = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12

  return `${day} ${month} ${year}, ${hours}:${minutes} ${period}`
}

export function relativeDate(iso) {
  const date = new Date(iso)
  const now = new Date()

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )

  const diffMs = startOfToday.getTime() - startOfDate.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export function truncate(str, n) {
  if (str.length <= n) return str
  return `${str.slice(0, n)}...`
}

export function calcAverage(sessions) {
  if (!sessions?.length) return 0

  const total = sessions.reduce(
    (sum, session) => sum + (session.analysis?.scoreResult?.overall ?? 0),
    0
  )

  return total / sessions.length
}

export function mostCommonVerdict(sessions) {
  if (!sessions?.length) return null

  const counts = new Map()

  for (const session of sessions) {
    const verdict = session.analysis?.scoreResult?.verdict
    if (!verdict) continue
    counts.set(verdict, (counts.get(verdict) ?? 0) + 1)
  }

  if (counts.size === 0) return null

  let topVerdict = null
  let topCount = 0

  for (const [verdict, count] of counts) {
    if (count > topCount) {
      topVerdict = verdict
      topCount = count
    }
  }

  return topVerdict
}
