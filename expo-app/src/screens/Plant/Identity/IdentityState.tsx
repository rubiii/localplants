import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { PlantIdentity } from "@/schema"
import { useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import { Text, View } from "react-native"
import HeaderLeft from "./HeaderLeft"

export default function IdentityState({
  plantIdentityId,
}: {
  plantIdentityId?: string
}) {
  const { navigation } = useNavigation<"Identity">()

  const identity = useCoState(PlantIdentity, plantIdentityId, {
    resolve: { result: { images: true } },
  })

  useEffect(() => {
    const resetResult = () => {
      if (!identity) return

      identity.$jazz.set("state", "processed")
      identity.$jazz.set("result", undefined)
    }

    navigation.setOptions({
      headerLeft: () => <HeaderLeft text="Back" onPress={resetResult} />,
      headerRight: undefined,
    })
  }, [navigation, identity])

  const result = identity?.result

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-6">
      <View>
        <Text className="text-xs text-[--secondaryText]">Scientific name</Text>
        <Text className="text-xl leading-tight text-[--text]">
          {result?.scientificName}
        </Text>
      </View>

      <View>
        <Text className="text-xs text-[--secondaryText]">Genus</Text>
        <Text className="text-lg leading-tight text-[--text]">
          {result?.scientificGenusName}
        </Text>
      </View>

      <View>
        <Text className="text-xs text-[--secondaryText]">Family</Text>
        <Text className="text-lg leading-tight text-[--text]">
          {result?.scientificFamilyName}
        </Text>
      </View>
    </ScrollableScreenContainer>
  )
}
