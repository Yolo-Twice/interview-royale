import { ChevronRight, Moon, Settings, Sun } from "lucide-react"

import { useAppearance } from "~/contexts/appearance-provider"
import type { FontFamily, FontSize, Theme } from "~/lib/appearance-settings"
import { cn } from "~/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
]

const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "inter", label: "Inter" },
  { value: "system", label: "System" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
]

function OptionGroup<T extends string>({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string
  icon?: typeof Sun
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 px-1 text-xs font-medium text-sidebar-foreground/70">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border px-2 py-1 text-xs transition-colors",
              value === option.value
                ? "border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary"
                : "border-sidebar-border bg-sidebar/50 text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SidebarSettings() {
  const { settings, setTheme, setFontSize, setFontFamily } = useAppearance()

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Settings">
            <Settings />
            <span>Settings</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-0 border-0 px-2 pb-2">
            <SidebarMenuSubItem>
              <div className="space-y-3 rounded-xl border border-sidebar-border bg-sidebar/60 p-2">
                <OptionGroup
                  label="Theme"
                  icon={settings.theme === "dark" ? Moon : Sun}
                  value={settings.theme}
                  options={THEME_OPTIONS}
                  onChange={setTheme}
                />
                <OptionGroup
                  label="Font size"
                  value={settings.fontSize}
                  options={FONT_SIZE_OPTIONS}
                  onChange={setFontSize}
                />
                <OptionGroup
                  label="Font style"
                  value={settings.fontFamily}
                  options={FONT_FAMILY_OPTIONS}
                  onChange={setFontFamily}
                />
              </div>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
