import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { getFirestoreDb } from "~/lib/firebase/client"
import { COLLECTIONS } from "~/lib/firebase/collections"
import type { UserProfileDocument } from "~/lib/firebase/types"
import type { User } from "firebase/auth"

export function userDocRef(userId: string) {
  return doc(getFirestoreDb(), COLLECTIONS.users, userId)
}

export async function ensureUserProfile(user: User): Promise<void> {
  const ref = userDocRef(user.uid)
  const snapshot = await getDoc(ref)

  if (snapshot.exists()) {
    return
  }

  const profile: Omit<UserProfileDocument, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>
    updatedAt: ReturnType<typeof serverTimestamp>
  } = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    targetRole: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(ref, profile)
}

export async function getUserProfile(userId: string): Promise<UserProfileDocument | null> {
  const snapshot = await getDoc(userDocRef(userId))
  if (!snapshot.exists()) {
    return null
  }
  return snapshot.data() as UserProfileDocument
}
