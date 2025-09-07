import { Control, Controller, FieldErrors } from "react-hook-form"
import { Text, TextInput, View } from "react-native"
import { PlantFormValues } from "./types"

type FieldProps = {
  control: Control<PlantFormValues, any, PlantFormValues>
  errors: FieldErrors<PlantFormValues>
}

export default function NoteField({ control }: FieldProps) {
  return (
    <View>
      <Text className="pb-2 text-lg text-[--foregroundSecondary]">
        Something else?
      </Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Add a note if you like …"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={6}
            className="text-xl text-[--foregroundSecondary] bg-[--input] px-6 pt-4 pb-6 rounded-lg"
          />
        )}
        name="note"
      />
    </View>
  )
}
