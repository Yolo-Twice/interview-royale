export type Theme = "light" | "dark"
export type FontSize = "sm" | "md" | "lg"
export type FontFamily = "inter" | "system" | "serif" | "mono"

export type AppearanceSettings = {
  theme: Theme
  fontSize: FontSize
  fontFamily: FontFamily
}

export const APPEARANCE_STORAGE_KEY = "interview-royale-appearance"

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "light",
  fontSize: "md",
  fontFamily: "inter",
}

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark"
}

export function isFontSize(value: unknown): value is FontSize {
  return value === "sm" || value === "md" || value === "lg"
}

export function isFontFamily(value: unknown): value is FontFamily {
  return value === "inter" || value === "system" || value === "serif" || value === "mono"
}

export function loadAppearanceSettings(): AppearanceSettings {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE

  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY)
    if (!raw) return DEFAULT_APPEARANCE

    const parsed = JSON.parse(raw) as Partial<AppearanceSettings>
    return {
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_APPEARANCE.theme,
      fontSize: isFontSize(parsed.fontSize) ? parsed.fontSize : DEFAULT_APPEARANCE.fontSize,
      fontFamily: isFontFamily(parsed.fontFamily)
        ? parsed.fontFamily
        : DEFAULT_APPEARANCE.fontFamily,
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

export function saveAppearanceSettings(settings: AppearanceSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(settings))
}

export function applyAppearanceSettings(settings: AppearanceSettings) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  root.classList.toggle("dark", settings.theme === "dark")
  root.dataset.fontSize = settings.fontSize
  root.dataset.fontFamily = settings.fontFamily
}

export const APPEARANCE_INIT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem("${APPEARANCE_STORAGE_KEY}")||"{}");var r=document.documentElement;if(s.theme==="dark")r.classList.add("dark");else r.classList.remove("dark");r.dataset.fontSize=s.fontSize||"md";r.dataset.fontFamily=s.fontFamily||"inter";}catch(e){}})();`
