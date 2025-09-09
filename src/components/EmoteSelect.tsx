import Icon from "@/components/Icon"
import { Pressable, View } from "react-native"

export default function EmoteSelect({
  value,
  setValue,
}: {
  value?: string
  setValue: (value?: string) => void
}) {
  return (
    <View className="px-6 flex-row gap-3">
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
  activeEmote?: string
}) {
  return (
    <Pressable onPressIn={() => onPress(name)}>
      <Icon.MaterialCommunity
        name={`emoticon-${name}-outline` as any}
        className={
          activeEmote === name ? "text-[--primary]" : "text-[--muted-text]"
        }
        size={36}
      />
    </Pressable>
  )
}
