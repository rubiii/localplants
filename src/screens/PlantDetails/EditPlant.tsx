import Button from "@/components/Button"
import useNavigation from "@/hooks/useNavigation"
import { Plant } from "@/schema"
import { useRoute } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
} from "react-hook-form"
import { SafeAreaView, Text, TextInput, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit plant",
}

export default function EditPlant() {
  const route = useRoute()
  const plantId = (route.params as any).plantId

  const { goBack } = useNavigation()
  const plant = useCoState(Plant, plantId)

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormData>({
    defaultValues: {
      name: plant?.name,
    },
  })

  const onSubmit = (data: FormData) => {
    if (!plant) return

    plant.$jazz.set("name", data.name)
    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 pt-6 pb-12 px-5">
        <View className="flex-1">
          <PlantForm control={control} errors={errors} />
        </View>

        <Button
          title="Save changes"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </View>
    </SafeAreaView>
  )
}

type FormData = {
  name: string
}

function PlantForm({
  control,
  errors,
}: {
  control: Control<FormData, any, FormData>
  errors: FieldErrors<FormData>
}) {
  return (
    <>
      <Text className="pb-2 text-lg text-[--foregroundSecondary]">
        Your plant’s name:
      </Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="text-xl text-[--foreground] bg-[--input] px-6 pt-4 pb-6 rounded-xl"
          />
        )}
        name="name"
      />
      {errors.name && <Text>This is required.</Text>}
    </>
  )
}
