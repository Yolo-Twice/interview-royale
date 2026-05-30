export {
  assertFirebaseConfigured,
  getFirebaseClientConfig,
  isFirebaseConfigured,
} from "~/lib/firebase/env"
export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseStorage,
  getFirestoreDb,
} from "~/lib/firebase/client"
export {
  getCurrentUser,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  subscribeToAuthState,
} from "~/lib/firebase/auth"
export type { AuthCredentials, SignUpInput } from "~/lib/firebase/auth"
export { getFirebaseErrorMessage } from "~/lib/firebase/errors"
export { COLLECTIONS, userInterviewsPath } from "~/lib/firebase/collections"
export {
  getInterviewSession,
  interviewDocRef,
  interviewsCollectionRef,
  listInterviewSessions,
  saveInterviewSession,
} from "~/lib/firebase/firestore"
export {
  ensureUserProfile,
  getUserProfile,
  userDocRef,
} from "~/lib/firebase/users"
export type {
  Difficulty,
  InterviewSessionDocument,
  InterviewSessionInput,
  InterviewType,
  TranscriptLine,
  UserProfileDocument,
} from "~/lib/firebase/types"
