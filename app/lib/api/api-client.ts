import { signOut, type User } from "firebase/auth"

import { getFirebaseAuth } from "~/lib/firebase/client"
import { getCurrentUser } from "~/lib/firebase/auth"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
export const INTERVIEW_RATE_LIMIT_MESSAGE =
  "Interview request limit reached. Please wait before starting another interview."

export class ApiAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiAuthError"
  }
}

export class ApiRateLimitError extends Error {
  constructor(message: string = INTERVIEW_RATE_LIMIT_MESSAGE) {
    super(message)
    this.name = "ApiRateLimitError"
  }
}

function buildApiUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`
}

async function getAuthenticatedUser(): Promise<User> {
  const user = getCurrentUser()

  if (!user) {
    throw new ApiAuthError("You must be signed in to continue.")
  }

  return user
}

async function redirectToLogin() {
  void signOut(getFirebaseAuth()).catch(() => undefined)

  if (typeof window !== "undefined") {
    window.location.assign("/login")
  }
}

export async function authenticatedFetch(
  path: string,
  init: RequestInit = {}
) {
  const user = await getAuthenticatedUser()
  const token = await user.getIdToken()
  const headers = new Headers(init.headers ?? {})
  headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  })

  if (response.status === 401) {
    await redirectToLogin()
    throw new ApiAuthError("Your session expired. Please sign in again.")
  }

  if (response.status === 429) {
    throw new ApiRateLimitError()
  }

  return response
}

export async function authenticatedJsonFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await authenticatedFetch(path, init)

  if (response.status === 204) {
    return null as T
  }

  const contentType = response.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) {
    return (await response.text()) as T
  }

  return response.json() as Promise<T>
}

export async function getAuthenticatedUserId(): Promise<string> {
  const user = await getAuthenticatedUser()
  return user.uid
}