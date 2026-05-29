import type { User } from "firebase/auth"

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) {
    return "there"
  }
  if (user.displayName) {
    return user.displayName
  }
  if (user.email) {
    return user.email.split("@")[0] ?? "User"
  }
  return "User"
}

export function getUserFirstName(user: User | null | undefined): string {
  const displayName = getUserDisplayName(user)
  return displayName.split(" ")[0] ?? displayName
}

export function getUserInitials(user: User | null | undefined): string {
  if (!user) {
    return "?"
  }
  if (user.displayName) {
    return user.displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }
  if (user.email) {
    return user.email[0]?.toUpperCase() ?? "?"
  }
  return "?"
}

export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) {
    return "Good morning"
  }
  if (hour < 17) {
    return "Good afternoon"
  }
  return "Good evening"
}

export function getPersonalizedGreeting(user: User | null | undefined, date = new Date()): string {
  const greeting = getTimeGreeting(date)
  const firstName = getUserFirstName(user)
  return `${greeting}, ${firstName}.`
}
