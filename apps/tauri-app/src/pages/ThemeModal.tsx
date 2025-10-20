import Modal, { type ModalProps } from "@/components/Modal"
import { useTheme } from "@/components/ThemeProvider"
import { THEME_COLORS, themePrimaryColors, type ThemeMode } from "@localplants/theme"
import { clsx } from "clsx"
import {
  Moon as DarkModeIcon,
  Sun as LightModeIcon,
  Monitor as SystemIcon,
} from "lucide-react"
import { type MouseEvent } from "react"

export default function ThemeModal({ isOpen, setIsOpen }: ModalProps) {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-6">
        <ThemeModeSwitch />
        <ThemeColorSwitch />
      </div>
    </Modal>
  )
}

function ThemeModeSwitch() {
  const { ref, setThemeMode, themeMode } = useTheme()

  const handleThemeModeChange = async (mode: ThemeMode, event: MouseEvent<HTMLButtonElement>) => {
    await setThemeMode(mode, event.currentTarget)
  }

  return (
    <div className="flex flex-col gap-2">
      <strong className="font-normal">Choose a theme:</strong>

      <div className="flex gap-4">
        <button
          ref={ref}
          onClick={(e) => void handleThemeModeChange("system", e)}
          className={clsx(
            "cursor-pointer transition-colors capitalize",
            "inline-flex px-3 py-2 items-center gap-2",
            "text-copy rounded-lg border border-border",
            { "bg-button": themeMode === "system" }
          )}
        >
          <SystemIcon size={20} />
          <span>System</span>
        </button>
        <button
          onClick={(e) => void handleThemeModeChange("light", e)}
          className={clsx(
            "cursor-pointer transition-colors capitalize",
            "inline-flex px-3 py-2 items-center gap-2",
            "text-copy rounded-lg border border-border",
            { "bg-button": themeMode === "light" }
          )}
        >
          <LightModeIcon size={20} />
          <span>Light</span>
        </button>
        <button
          onClick={(e) => void handleThemeModeChange("dark", e)}
          className={clsx(
            "cursor-pointer transition-colors capitalize",
            "inline-flex px-3 py-2 items-center gap-2",
            "text-copy rounded-lg border border-border",
            { "bg-button": themeMode === "dark" }
          )}
        >
          <DarkModeIcon size={20} />
          <span>Dark</span>
        </button>
      </div>
    </div>
  )
}

function ThemeColorSwitch() {
  const { changeThemeColor, themeColor } = useTheme()

  const handleColorChange = (color: typeof THEME_COLORS[number]) => {
    changeThemeColor(color)
  }

  return (
    <div className="flex flex-col gap-2">
      <strong className="font-normal">Choose a color:</strong>

      <div className="inline-flex gap-2 -ml-1">
        {THEME_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => { handleColorChange(color) }}
            className="cursor-pointer p-1"
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full border-2",
                { "border-copy": color === themeColor },
                { "border-card": color !== themeColor }
              )}
              style={{ backgroundColor: themePrimaryColors[color] }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
