import { activeColorClasses, colorClasses, type ThemeColor } from "@/theme"
import {
  type MaterialCommunityIcons as MaterialCommunityType,
  type MaterialIcons as MaterialIconType,
} from "@expo/vector-icons"
import MaterialCommunity from "@expo/vector-icons/MaterialCommunityIcons"
import Material from "@expo/vector-icons/MaterialIcons"
import { clsx } from "clsx"
import { cssInterop } from "nativewind"

cssInterop(Material, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

cssInterop(MaterialCommunity, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

export type MaterialIcon = keyof typeof MaterialIconType.glyphMap
type MaterialProps = {
  name: MaterialIcon
  community?: false
}

export type MaterialCommunityIcon = keyof typeof MaterialCommunityType.glyphMap
type MaterialCommunityProps = {
  name: MaterialCommunityIcon
  community: true
}

type BaseProps = {
  size: number
  color?: ThemeColor | undefined
  activeColor?: ThemeColor | undefined
  className?: string
}

type Props = (MaterialProps & BaseProps) | (MaterialCommunityProps & BaseProps)

export default function Icon({
  name,
  community,
  color,
  activeColor,
  className,
  ...props
}: Props) {
  const computedClassName = clsx(
    className,
    colorClasses(color),
    activeColorClasses(activeColor),
  )

  if (community) {
    return (
      <MaterialCommunity name={name} className={computedClassName} {...props} />
    )
  }

  return <Material name={name} className={computedClassName} {...props} />
}
