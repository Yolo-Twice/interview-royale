import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { User } from "firebase/auth"

import { isFirebaseConfigured } from "~/lib/firebase/env"
import { subscribeToAuthState } from "~/lib/firebase/auth"
import { ensureUserProfile } from "~/lib/firebase/users"

type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(configured)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser)
      setLoading(false)

      if (nextUser) {
        void ensureUserProfile(nextUser).catch((error) => {
          console.error("Failed to sync user profile:", error)
        })
      }
    })

    return unsubscribe
  }, [configured])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
    }),
    [configured, loading, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }
  return context
}
