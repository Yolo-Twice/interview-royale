import type { FirebaseOptions } from "firebase/app"

function readEnv(key: keyof ImportMetaEnv): string | undefined {
  const value = import.meta.env[key]
  return typeof value === "string" && value.length > 0 ? value : undefined
}

export function getFirebaseClientConfig(): FirebaseOptions {
  return {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
    measurementId: readEnv("VITE_FIREBASE_MEASUREMENT_ID"),
  }
}

const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const satisfies ReadonlyArray<keyof FirebaseOptions>

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseClientConfig()
  return requiredKeys.every((key) => Boolean(config[key]))
}

export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add VITE_FIREBASE_* variables to your .env file (see .env.example)."
    )
  }
}
