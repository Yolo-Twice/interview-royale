import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type WithFieldValue,
} from "firebase/firestore"

import { getFirestoreDb } from "~/lib/firebase/client"
import { userInterviewsPath } from "~/lib/firebase/collections"
import type {
  InterviewSessionDocument,
  InterviewSessionInput,
} from "~/lib/firebase/types"

export function interviewDocRef(userId: string, interviewId: string) {
  return doc(getFirestoreDb(), userInterviewsPath(userId), interviewId)
}

export function interviewsCollectionRef(userId: string) {
  return collection(getFirestoreDb(), userInterviewsPath(userId))
}

export async function getInterviewSession(
  userId: string,
  interviewId: string
): Promise<InterviewSessionDocument | null> {
  const snapshot = await getDoc(interviewDocRef(userId, interviewId))
  if (!snapshot.exists()) {
    return null
  }
  return snapshot.data() as InterviewSessionDocument
}

export async function listInterviewSessions(userId: string): Promise<
  Array<{
    id: string
    data: InterviewSessionDocument
  }>
> {
  const interviewsQuery = query(
    interviewsCollectionRef(userId),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(interviewsQuery)

  return snapshot.docs.map((document: QueryDocumentSnapshot<DocumentData>) => ({
    id: document.id,
    data: document.data() as InterviewSessionDocument,
  }))
}

export async function saveInterviewSession(
  userId: string,
  interviewId: string,
  input: InterviewSessionInput
): Promise<void> {
  const ref = interviewDocRef(userId, interviewId)
  const existing = await getDoc(ref)

  const payload: WithFieldValue<Partial<InterviewSessionDocument>> = {
    ...input,
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  }

  await setDoc(ref, payload, { merge: true })
}
