import Icon from "@/components/Icon"
import plantSizes from "@/lib/watering/plantSizes"
import { PlantSize } from "@/lib/watering/types"
import { Pressable, Text, View } from "react-native"

export default function PlantSizeSelect({
  value,
  setValue,
}: {
  value?: PlantSize
  setValue: (value: PlantSize) => void
}) {
  return (
    <View className="gap-1">
      {/*<Text className="ml-6 text-[--text]">Pot size:</Text>*/}
      <View className="px-4 flex-row gap-3">
        <SelectItem value="xs" onPress={setValue} active={value === "xs"} />
        <SelectItem value="sm" onPress={setValue} active={value === "sm"} />
        <SelectItem value="md" onPress={setValue} active={value === "md"} />
        <SelectItem value="lg" onPress={setValue} active={value === "lg"} />
      </View>
    </View>
  )
}

const iconMapping: Record<PlantSize, string> = {
  "xs": "size-xs",
  "sm": "size-s",
  "md": "size-m",
  "lg": "size-l",
}

function SelectItem({
  value,
  onPress,
  active,
}: {
  value: PlantSize
  onPress: (value: PlantSize) => void
  active: boolean
}) {
  const { diameterRangeCm } = plantSizes[value]

  return (
    <Pressable onPressIn={() => onPress(value)} className="items-center">
      <Icon.MaterialCommunity
        name={iconMapping[value] as any}
        className={active ? "text-[--primary]" : "text-[--mutedText]"}
        size={36}
      />
      <Text className="text-xs leading-none text-center text-[--mutedText]">
        {diameterRangeCm[0]}–{diameterRangeCm[1]}
        {"\n"}cm
      </Text>
    </Pressable>
  )
}
