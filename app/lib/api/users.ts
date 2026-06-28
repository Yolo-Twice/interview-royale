import {
  authenticatedFetch,
  authenticatedJsonFetch,
  getAuthenticatedUserId,
} from "~/lib/api/api-client"

export type UserProfile = {
  profilePictureUrl?: string | null
  photoURL?: string | null

  skills?: string[]
  primarySkills?: string[]
  tools?: string[]
  technologies?: string[]
}

const jsonHeaders = {
  "Content-Type": "application/json",
}

export async function getUserProfile(): Promise<UserProfile> {
  const userId = await getAuthenticatedUserId()
  return authenticatedJsonFetch<UserProfile>(`/users/${userId}`)
}

export async function updateUserProfile(data: any) {
  const userId = await getAuthenticatedUserId()
  const response = await authenticatedFetch(`/users/${userId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update user profile")
  }

  return response.json()
}

export async function uploadPhoto(file: File) {
  const userId = await getAuthenticatedUserId()
  const formData = new FormData()
  formData.append("photo", file)

  const response = await authenticatedFetch(`/users/${userId}/photo`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload photo")
  }

  return response.json()
}

export async function uploadResume(file: File) {
  const userId = await getAuthenticatedUserId()
  const formData = new FormData()
  formData.append("resume", file)

  const response = await authenticatedFetch(`/users/${userId}/resume`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to upload resume")
  }

  return response.json()
}

export async function getResume() {
  const userId = await getAuthenticatedUserId()
  const response = await authenticatedFetch(`/users/${userId}/resume`, {
    method: "GET",
  })

  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to fetch resume info")
  }

  return response.json()
}

export async function removeResume() {
  const userId = await getAuthenticatedUserId()
  const response = await authenticatedFetch(`/users/${userId}/resume`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to remove resume")
  }

  return response.status === 204 ? null : response.json().catch(() => null)
}
