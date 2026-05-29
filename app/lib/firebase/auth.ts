import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
  updateProfile,
} from "firebase/auth"

import { getFirebaseAuth } from "~/lib/firebase/client"
import { getFirebaseErrorMessage } from "~/lib/firebase/errors"

const googleProvider = new GoogleAuthProvider()

export type AuthCredentials = {
  email: string
  password: string
}

export type SignUpInput = AuthCredentials & {
  displayName?: string
}

export async function signInWithEmail(credentials: AuthCredentials): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      credentials.email,
      credentials.password
    )
    return result.user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Failed to sign in."))
  }
}

export async function signUpWithEmail(input: SignUpInput): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email,
      input.password
    )

    if (input.displayName) {
      await updateProfile(result.user, { displayName: input.displayName })
    }

    return result.user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Failed to create account."))
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(getFirebaseAuth(), googleProvider)
    return result.user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Failed to sign in with Google."))
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(getFirebaseAuth())
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Failed to sign out."))
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email)
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Failed to send reset email."))
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export function getCurrentUser(): User | null {
  return getFirebaseAuth().currentUser
}
