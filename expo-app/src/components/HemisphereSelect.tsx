import Icon from "@/components/Icon"
import { type Hemisphere as HemisphereType } from "@/lib/watering/types"
import { Pressable, Text, View } from "react-native"

export default function HemisphereSelect({
  autoValue,
  value,
  setValue,
}: {
  autoValue?: string
  value?: string
  setValue: (value?: HemisphereType) => void
}) {
  return (
    <View className="px-1.5 flex-row gap-3">
      <Hemisphere
        value={undefined}
        title={
          autoValue
            ? `Same as\ncollection\n(${capitalize(autoValue)})`
            : "Same as\ncollection"
        }
        icon="autorenew"
        onPress={setValue}
        active={!value}
      />
      <Hemisphere
        value="north"
        title="North"
        icon="north"
        onPress={setValue}
        active={value === "north"}
      />
      <Hemisphere
        value="south"
        title="South"
        icon="south"
        onPress={setValue}
        active={value === "south"}
      />
    </View>
  )
}

function Hemisphere({
  value,
  title,
  icon,
  onPress,
  active,
}: {
  value?: HemisphereType
  title: string
  icon: string
  onPress: (value?: HemisphereType) => void
  active: boolean
}) {
  return (
    <Pressable
      onPressIn={() => onPress(value)}
      className="mx-1 gap-1 items-center"
    >
      <Icon.Material
        name={icon as any}
        className={active ? "text-[--primary]" : "text-[--mutedText]"}
        size={24}
      />
      <Text className="break-words text-xs text-center text-[--mutedText]">
        {title}
      </Text>
    </Pressable>
  )
}

function capitalize(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1)
}
