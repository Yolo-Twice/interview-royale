import type { BugReport } from "../types/bugReport"

export async function submitBugReport(payload: BugReport): Promise<void> {
  try {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("category", payload.category)
    formData.append("severity", payload.severity)
    formData.append("description", payload.description)

    if (payload.stepsToReproduce) {
      formData.append("stepsToReproduce", payload.stepsToReproduce)
    }

    formData.append("metadata", JSON.stringify(payload.metadata))

    if (payload.screenshot) {
      formData.append("screenshot", payload.screenshot)
    }

    const response = await fetch("/api/bug-reports", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to submit bug report: ${response.statusText}`)
    }

    console.log("Bug report submitted successfully")
  } catch (error) {
    console.error("Bug report submission error:", error)
    throw error
  }
}
