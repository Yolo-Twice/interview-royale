import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import { type Auth, getAuth } from "firebase/auth"
import { type Firestore, getFirestore } from "firebase/firestore"
import { type FirebaseStorage, getStorage } from "firebase/storage"

import {
  assertFirebaseConfigured,
  getFirebaseClientConfig,
} from "~/lib/firebase/env"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

let appInstance: FirebaseApp | undefined
let authInstance: Auth | undefined
let firestoreInstance: Firestore | undefined
let storageInstance: FirebaseStorage | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!isBrowser()) {
    throw new Error("Firebase can only be initialized in the browser.")
  }

  assertFirebaseConfigured()

  if (appInstance) {
    return appInstance
  }

  appInstance =
    getApps().length > 0 ? getApp() : initializeApp(getFirebaseClientConfig())
  return appInstance
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp())
  }
  return authInstance
}

export function getFirestoreDb(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp())
  }
  return firestoreInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp())
  }
  return storageInstance
}
