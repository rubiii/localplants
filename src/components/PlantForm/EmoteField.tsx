import Icon from "@/components/Icon"
import { Controller, FieldErrors, type Control } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import { PlantFormValues } from "./types"

type FieldProps = {
  control: Control<PlantFormValues, any, PlantFormValues>
  errors: FieldErrors<PlantFormValues>
}

export default function EmoteField({ control }: FieldProps) {
  return (
    <View>
      <Text className="pb-1.5 text-[--foregroundSecondary]">
        How does she feel?
      </Text>

      <Controller
        name="emote"
        control={control}
        render={({ field: { onChange, value } }) => {
          const toggleChange = (name: string) =>
            onChange(name === value ? undefined : name)

          return (
            <View className="flex-row gap-3">
              <Emote name="excited" onPress={toggleChange} active={value} />
              <Emote name="neutral" onPress={toggleChange} active={value} />
              <Emote name="frown" onPress={toggleChange} active={value} />
              <Emote name="cry" onPress={toggleChange} active={value} />
              <Emote name="lol" onPress={toggleChange} active={value} />
            </View>
          )
        }}
      />
    </View>
  )
}

function Emote({
  name,
  onPress,
  active,
}: {
  name: string
  onPress: (name: string) => void
  active?: string
}) {
  return (
    <Pressable onPressIn={() => onPress(name)}>
      <Icon.MaterialCommunity
        name={`emoticon-${name}-outline` as any}
        className={
          active === name ? "text-[--primary]" : "text-[--foregroundMuted]"
        }
        size={36}
      />
    </Pressable>
  )
}
