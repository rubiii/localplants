import Icon from "@/components/Icon"
import Text from "@/components/Text"
import { type Hemisphere as HemisphereType } from "@/lib/watering/types"
import { Pressable, View } from "react-native"

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
      {autoValue ? (
        <Hemisphere
          value={undefined}
          title={`Same as\ncollection\n(${capitalize(autoValue)})`}
          icon="autorenew"
          onPress={setValue}
          active={!value}
        />
      ) : null}
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
      <Icon name={icon as any} size={24} color={active ? "primary" : "muted"} />
      <Text color="muted" size="xs" className="break-words text-center">
        {title}
      </Text>
    </Pressable>
  )
}

function capitalize(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1)
}
