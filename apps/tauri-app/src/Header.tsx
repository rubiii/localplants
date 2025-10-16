import {
  CircleUserRound as AccountIcon,
  CircleArrowLeft as BackIcon,
  Moon as DarkModeIcon,
  Sun as LightModeIcon
} from 'lucide-react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'
import { Link } from "wouter"

const ICON_SIZE = 20

export type Props = {
  title?: string
  backTo?: string
}

export default function Header({ title, backTo }: Props) {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
      animationType: ThemeAnimationType.CIRCLE,
    })

  return (
    <div
      className="h-12 px-12 fixed top-0 left-0 right-0 z-100 flex items-center bg-background border-b border-border"
    >
      <div className="flex flex-1">
        <div className="flex-1">
          {backTo ? (
            <div className="flex gap-2 items-center">
              <Link to={backTo} className="hover:text-primary">
                <BackIcon size={ICON_SIZE} />
              </Link>

              <h1 className="text-title font-bold cursor-default">
                {title}
              </h1>
            </div>
          ) : (
            <h1 className="text-title font-bold cursor-default">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button ref={ref} onClick={toggleSwitchTheme} className="cursor-pointer">
            {isDarkMode ? <DarkModeIcon size={ICON_SIZE} /> : <LightModeIcon size={ICON_SIZE} />}
          </button>

          <Link to="/account">
            <AccountIcon size={ICON_SIZE} />
          </Link>
        </div>
      </div>
    </div>
  )
}
