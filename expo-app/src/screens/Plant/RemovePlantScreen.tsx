import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount } from "@/schema"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandle,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount } from "jazz-tools/expo"
import { useEffect, useMemo, useRef } from "react"
import { Pressable, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {}

export default function RemovePlantScreen() {
  const { navigation, route } = useNavigation<"RemovePlant">()
  const { plantId, collectionId } = route.params

  // TODO: Maybe only load the collection by collectionId?
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: { plants: { $each: true } } } } },
  })

  const sheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["10%", 260], [])

  useEffect(() => sheetRef.current?.present(), [])

  const removePlant = () => {
    if (!me) return

    const collection = me.root.collections.find(
      (c) => c.$jazz.id === collectionId,
    )
    if (!collection) return

    collection.plants.$jazz.remove((p) => p.$jazz.id === plantId)
    navigation.popToTop()
  }

  const closeModal = () => sheetRef.current?.close()
  const onDismiss = () => navigation.goBack()

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  )

  const renderHandle = (props: BottomSheetHandleProps) => (
    <BottomSheetHandle
      {...props}
      indicatorStyle={{ backgroundColor: "transparent" }}
    />
  )

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        backgroundStyle={{ backgroundColor: "transparent" }}
        onDismiss={onDismiss}
      >
        <View className="flex-1 mb-16 gap-2 mx-4 items-center justify-end">
          <View className="w-full">
            <View className="py-4 px-8 w-full rounded-tr-lg rounded-tl-lg bg-[--card] border-b border-[--border]">
              <Text className="text-[--secondaryText] font-semibold text-center">
                Are you sure you want to completely remove this plant?
              </Text>
            </View>

            <Pressable
              onPress={removePlant}
              className="flex-row gap-2 py-4 px-8 w-full justify-center items-center rounded-br-lg rounded-bl-lg bg-[--card]"
            >
              <Icon.MaterialCommunity
                name="delete-outline"
                className="text-[--error]"
                size={24}
              />
              <Text className="text-xl font-semibold text-[--error]">
                Remove plant
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={closeModal}
            className="flex-row gap-2 py-4 px-8 w-full justify-center items-center rounded-lg bg-[--card]"
          >
            <Text className="text-xl font-semibold text-[--error]">Cancel</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}
