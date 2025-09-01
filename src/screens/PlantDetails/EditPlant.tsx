import useNavigation from "@/hooks/useNavigation"
import { Plant } from "@/schema"
import { useRoute } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { useCoState } from "jazz-tools/expo"
import { Controller, useForm } from "react-hook-form"
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit plant",
}

type FormData = {
  name: string
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
          <Text className="pb-1.5 text-[--foreground]">Name:</Text>

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
                className="text-xl text-[--foregroundMuted] bg-[--input] px-6 pt-4 pb-6 rounded-xl"
              />
            )}
            name="name"
          />
          {errors.name && <Text>This is required.</Text>}
        </View>

        <View>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            className={clsx("rounded-2xl py-6 px-8", {
              "bg-[--primary]": isValid,
              "bg-[--backgroundSecondary]": !isValid,
            })}
          >
            <Text
              className={clsx("text-xl", {
                "text-[--primaryForeground]": isValid,
                "text-[--background]": !isValid,
              })}
            >
              Save changes
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
