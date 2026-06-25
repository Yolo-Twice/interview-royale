import { getFirebaseAuth } from "~/lib/firebase/client"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

async function getAuthHeaders(): Promise<Record<string, string>> {
  const auth = getFirebaseAuth()
  const token = await auth.currentUser?.getIdToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

export async function getUserProfile(userId: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/users/${userId}`, { headers })
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }
  return response.json()
}

export async function updateUserProfile(userId: string, data: any) {
  const headers = await getAuthHeaders()
  headers["Content-Type"] = "application/json"
  
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update user profile")
  }
  return response.json()
}

export async function uploadPhoto(userId: string, file: File) {
  const headers = await getAuthHeaders()
  const formData = new FormData()
  formData.append("photo", file)

  const response = await fetch(`${API_URL}/users/${userId}/photo`, {
    method: "POST",
    headers,
    body: formData,
  })
  if (!response.ok) {
    throw new Error("Failed to upload photo")
  }
  return response.json()
}

export async function uploadResume(userId: string, file: File) {
  const headers = await getAuthHeaders()
  const formData = new FormData()
  formData.append("resume", file)

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: "POST",
    headers,
    body: formData,
  })
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to upload resume")
  }
  return response.json()
}

export async function getResume(userId: string) {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: "GET",
    headers,
  })
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to fetch resume info")
  }
  return response.json()
}

export async function removeResume(userId: string) {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}/users/${userId}/resume`, {
    method: "DELETE",
    headers,
  })
  if (!response.ok) {
    const text = await response.text().catch(() => null)
    throw new Error(text || "Failed to remove resume")
  }

  return response.status === 204 ? null : response.json().catch(() => null)
}
