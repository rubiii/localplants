import Icon from "@/components/Icon"
import { Control, Controller, FieldErrors } from "react-hook-form"
import { Pressable, Text, TextInput, View } from "react-native"
import { PlantFormValues } from "./types"

type FieldProps = {
  control: Control<PlantFormValues, any, PlantFormValues>
  errors: FieldErrors<PlantFormValues>
}

export default function NameField({
  control,
  errors,
  generatePlantName,
}: FieldProps & { generatePlantName: () => void }) {
  return (
    <View className="gap-2">
      <Text className="text-[--foregroundSecondary]">What’s their name?</Text>

      <View className="flex-1 flex-row items-center">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              className="flex-1 pl-6 pr-2 py-4 text-xl leading-tight text-[--foregroundSecondary] bg-[--input] rounded-tl-lg rounded-bl-lg"
            />
          )}
          name="name"
        />

        <Pressable
          onPress={generatePlantName}
          className="group px-4 h-full items-center justify-center bg-[--input] rounded-tr-lg rounded-br-lg border-l-hairline border-[--background]"
        >
          <Icon.Material
            name="auto-awesome"
            size={24}
            className="text-[--foregroundSecondary] group-active:text-[--primary]"
          />
        </Pressable>
      </View>

      {errors.name && (
        <Text className="pt-2 text-[--error]">Please enter a name</Text>
      )}
    </View>
  )
}
