import { cn } from "../../../app/lib/utils"
import { verdictToColor } from "../../utils/scoreUtils"

export default function VerdictBadge({ verdict, className, size = "sm" }) {
  if (!verdict || verdict === "—") return null

  const color = verdictToColor(verdict)

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border font-medium transition-colors duration-200",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-0.5 text-xs",
        className
      )}
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}1a`,
      }}
    >
      {verdict}
    </span>
  )
}
