export const COLLECTIONS = {
  users: "users",
  interviews: "interviews",
} as const

export function userInterviewsPath(userId: string): string {
  return `${COLLECTIONS.users}/${userId}/${COLLECTIONS.interviews}`
}
