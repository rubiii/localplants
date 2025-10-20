import { clsx } from "clsx"
import { Pressable, View } from "react-native"
import Icon, { type MaterialCommunityIcon, type MaterialIcon } from "./Icon"

type Variant = "default"

const VARIANTS: Record<Variant, Record<"wrapper" | "text", string>> = {
  default: {
    wrapper: clsx(
      "p-1 rounded-full border border-[--border]",
      "group-active:border-[--primary] group-active:bg-[--primary]"
    ),
    text: "text-[--primary] group-active:text-[--background]",
  },
}

type MaterialProps = {
  name: MaterialIcon
  community?: false
}

type MaterialCommunityProps = {
  name: MaterialCommunityIcon
  community: true
}

type BaseProps = {
  onPress: () => void
  className?: string
  variant?: Variant
  size?: number
}

type Props = (MaterialProps & BaseProps) | (MaterialCommunityProps & BaseProps)

export default function IconButton({
  name,
  community = false,
  onPress,
  className,
  variant = "default",
  size = 22,
}: Props) {
  const wrapperClasses = clsx(
    "items-center justify-center",
    className,
    VARIANTS[variant].wrapper
  )

  const textClasses = VARIANTS[variant].text

  return (
    <Pressable onPress={onPress} className={clsx("group", className)}>
      <View className={wrapperClasses}>
        <Icon
          name={name as any}
          community={community}
          size={size}
          className={textClasses}
        />
      </View>
    </Pressable>
  )
}
