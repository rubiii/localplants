import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import { Text } from "@/components/base"
import useNavigation from "@/hooks/useNavigation"
import { PlantIdentity } from "@localplants/jazz/schema"
import { useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import { View } from "react-native"
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
      identity.$jazz.set("result", undefined as never)
    }

    navigation.setOptions({
      headerLeft: () => <HeaderLeft text="Back" onPress={resetResult} />,
      headerRight: () => undefined,
    })
  }, [navigation, identity])

  const result = identity?.result

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-6">
      <View>
        <Text size="sm" color="secondary">
          Scientific name
        </Text>
        <Text size="lg" className="leading-tight">
          {result ? result["scientificName"] : ""}
        </Text>
      </View>

      <View>
        <Text size="sm" color="secondary">
          Genus
        </Text>
        <Text size="lg" className="leading-tight">
          {result ? result["scientificGenusName"] : ""}
        </Text>
      </View>

      <View>
        <Text size="sm" color="secondary">
          Family
        </Text>
        <Text size="lg" className="leading-tight">
          {result ? result["scientificFamilyName"] : ""}
        </Text>
      </View>
    </ScrollableScreenContainer>
  )
}
