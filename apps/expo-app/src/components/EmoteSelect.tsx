import { Icon } from "@/components/base"
import { Pressable, View } from "react-native"

export default function EmoteSelect({
  value,
  setValue,
}: {
  value?: string
  setValue: (value?: string) => void
}) {
  return (
    <View className="px-4 flex-row gap-3">
      <Emote name="excited" onPress={setValue} activeEmote={value} />
      <Emote name="neutral" onPress={setValue} activeEmote={value} />
      <Emote name="frown" onPress={setValue} activeEmote={value} />
      <Emote name="cry" onPress={setValue} activeEmote={value} />
      <Emote name="lol" onPress={setValue} activeEmote={value} />
    </View>
  )
}

function Emote({
  name,
  onPress,
  activeEmote,
}: {
  name: string
  onPress: (name: string) => void
  activeEmote?: string | undefined
}) {
  return (
    <Pressable onPressIn={() => onPress(name)}>
      <Icon
        community
        name={`emoticon-${name}-outline` as any}
        size={36}
        color={activeEmote === name ? "primary" : "muted"}
      />
    </Pressable>
  )
}
