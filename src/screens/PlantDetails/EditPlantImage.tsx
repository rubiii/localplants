import Button from "@/components/Button"
import DismissKeyboard from "@/components/DismissKeyboard"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation from "@/hooks/useNavigation"
import { Plant, PlantImage } from "@/schema"
import { useRoute } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
} from "react-hook-form"
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native"

type FormData = {
  note: string
  emote: string
}

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit plant image",
  headerRight: () => <HeaderRight />,
}

function HeaderRight() {
  const route = useRoute()
  const plantId = (route.params as any).plantId
  const plantImageId = (route.params as any).plantImageId

  const { goBack } = useNavigation()
  const plant = useCoState(Plant, plantId, {
    resolve: {
      primaryImage: true,
      images: {
        $each: true,
      },
    },
  })

  // TODO: maybe add a confirm dialog somehow?
  const removePlantImage = () => {
    if (!plant) return

    plant.images.$jazz.remove((i) => i.$jazz.id === plantImageId)
    if (plant.primaryImage.$jazz.id === plantImageId) {
      plant.$jazz.set("primaryImage", plant.images[0])
    }

    goBack()
  }

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable className="group p-2 -mr-2" onPress={removePlantImage}>
        <Icon.MaterialCommunity
          name="delete-circle-outline"
          className="text-[--foreground] group-active:text-[--error]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}

export default function EditPlantImage() {
  const route = useRoute()
  const plantImageId = (route.params as any).plantImageId

  const { goBack } = useNavigation()
  const plantImage = useCoState(PlantImage, plantImageId)

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormData>({
    defaultValues: {
      emote: plantImage?.emote,
      note: plantImage?.note?.toString(),
    },
  })

  const onSubmit = (data: FormData) => {
    if (!plantImage || !isValid) return

    plantImage.$jazz.set("emote", data.emote)
    plantImage.$jazz.set("note", data.note)

    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <DismissKeyboard>
        <View className="flex-1 pt-6 pb-12 px-5">
          <View className="flex-1">
            <PlantForm control={control} errors={errors} />
          </View>

          <Button
            title="Save changes"
            size="large"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>
      </DismissKeyboard>
    </SafeAreaView>
  )
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
      <View className="pt-10">
        <Text className="pb-2 text-lg text-[--foregroundSecondary]">
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

      <View className="pt-10">
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
              className="text-xl text-[--foreground] bg-[--input] px-6 pt-4 pb-6 rounded-xl"
            />
          )}
          name="note"
        />
      </View>
    </>
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
    <Pressable onPress={() => onPress(name)}>
      <Icon.MaterialCommunity
        name={`emoticon-${name}-outline` as any}
        className={active === name ? "text-[--primary]" : "text-[--foreground]"}
        size={36}
      />
    </Pressable>
  )
}
