const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = Date.now()
  const difference = now - date.getTime()

  if (difference < MINUTE) return "Just now"
  if (difference < HOUR) return `${Math.floor(difference / MINUTE)} minutes ago`
  if (difference < DAY) return `${Math.floor(difference / HOUR)} hours ago`
  if (difference < WEEK) return `${Math.floor(difference / DAY)} days ago`
  if (difference < MONTH) return `${Math.floor(difference / WEEK)} weeks ago`
  if (difference < YEAR) return date.toLocaleString("default", { month: "short", year: "numeric" })

  return date.toLocaleDateString()
}