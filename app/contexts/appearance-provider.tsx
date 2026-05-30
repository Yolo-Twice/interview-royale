import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  applyAppearanceSettings,
  DEFAULT_APPEARANCE,
  loadAppearanceSettings,
  saveAppearanceSettings,
  type AppearanceSettings,
  type FontFamily,
  type FontSize,
  type Theme,
} from "~/lib/appearance-settings"

type AppearanceContextValue = {
  settings: AppearanceSettings
  setTheme: (theme: Theme) => void
  setFontSize: (fontSize: FontSize) => void
  setFontFamily: (fontFamily: FontFamily) => void
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined)

type AppearanceProviderProps = {
  children: ReactNode
}

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_APPEARANCE)

  useEffect(() => {
    const stored = loadAppearanceSettings()
    setSettings(stored)
    applyAppearanceSettings(stored)
  }, [])

  const updateSettings = useCallback(
    (updater: (prev: AppearanceSettings) => AppearanceSettings) => {
      setSettings((prev) => {
        const next = updater(prev)
        applyAppearanceSettings(next)
        saveAppearanceSettings(next)
        return next
      })
    },
    []
  )

  const setTheme = useCallback(
    (theme: Theme) => {
      updateSettings((prev) => ({ ...prev, theme }))
    },
    [updateSettings]
  )

  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      updateSettings((prev) => ({ ...prev, fontSize }))
    },
    [updateSettings]
  )

  const setFontFamily = useCallback(
    (fontFamily: FontFamily) => {
      updateSettings((prev) => ({ ...prev, fontFamily }))
    },
    [updateSettings]
  )

  const value = useMemo(
    () => ({
      settings,
      setTheme,
      setFontSize,
      setFontFamily,
    }),
    [settings, setTheme, setFontSize, setFontFamily]
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider.")
  }
  return context
}
