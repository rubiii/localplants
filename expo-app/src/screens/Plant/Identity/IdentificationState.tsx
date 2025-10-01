import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { IdentityResultType, PlantIdentity } from "@/schema"
import { FlashList } from "@shopify/flash-list/src"
import { clsx } from "clsx"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Image, Pressable, Text, View } from "react-native"
import HeaderLeft from "./HeaderLeft"
import HeaderRight from "./HeaderRight"
import PlantNetLogo from "./PlantNetLogo"

export default function IdentificationState({
  plantIdentityId,
}: {
  plantIdentityId: string
}) {
  const { navigation } = useNavigation<"Identity">()
  const [selected, setSelected] = useState<IdentityResultType | undefined>()

  const identity = useCoState(PlantIdentity, plantIdentityId, {
    resolve: { request: { results: { $each: { images: { $each: true } } } } },
  })

  useEffect(() => {
    const resetResults = () => {
      if (!identity) return

      identity.$jazz.set("result", undefined)
      identity.$jazz.set("request", undefined)
      identity.$jazz.set("state", "none")
    }

    const save = () => {
      if (!identity) return

      identity.$jazz.set("result", selected)
      identity.$jazz.set("state", "identified")
    }

    navigation.setOptions({
      headerLeft: () => <HeaderLeft text="Back" onPress={resetResults} />,
      headerRight: () => <HeaderRight onSave={selected ? save : undefined} />,
    })
  }, [navigation, selected, identity])

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <View className="gap-2 items-center">
        <PlantNetLogo />
        <Text className="text-[--text]">Top identification results</Text>
      </View>

      <FlashList
        data={identity?.request?.results}
        keyExtractor={(item, index) => item?.$jazz.id || index.toString()}
        renderItem={({ item }) =>
          item ? (
            <ResultItem
              result={item}
              isSelected={selected === item}
              onSelect={setSelected}
            />
          ) : null
        }
        numColumns={1}
      />
    </ScrollableScreenContainer>
  )
}

function ResultItem({
  result,
  isSelected,
  onSelect,
}: {
  result: IdentityResultType
  isSelected: boolean
  onSelect: (selected: IdentityResultType) => void
}) {
  const firstImage = result?.images?.at(0)

  return (
    <Pressable
      onPress={() => onSelect(result)}
      key={result.$jazz.id}
      className="gap-4 mb-6 flex-row"
    >
      <View className="w-5/12 gap-2 items-center">
        <View className="ml-10 self-center">
          <Text
            className={clsx("px-3 py-1.5 rounded-full font-bold text-xs", {
              "text-[--text] bg-[--card]": !isSelected,
              "text-[--background] bg-[--primary]": isSelected,
            })}
          >
            {(result.score * 100).toFixed(2)}%
          </Text>
        </View>

        {firstImage ? (
          <View className="flex-row gap-3 items-center">
            {isSelected ? (
              <Icon.MaterialCommunity
                name="checkbox-marked-circle"
                size={24}
                className="text-[--primary]"
              />
            ) : (
              <Icon.MaterialCommunity
                name="checkbox-blank-circle-outline"
                size={24}
                className="text-[--text]"
              />
            )}

            <Image
              key={firstImage.$jazz.id}
              src={firstImage.mediumImageUrl}
              className="w-32 h-auto aspect-square rounded-lg"
            />
          </View>
        ) : null}
      </View>

      <View className="mt-9 gap-3 w-7/12">
        <Text className="text-lg leading-tight text-[--text] break-words">
          {result.scientificName}
        </Text>
        <Text className="text-sm text-[--text] break-words">
          Genus: {result.scientificGenusName}
          {"\n"}
          Family: {result.scientificFamilyName}
        </Text>
        <Text className="mr-10 text-xs text-[--secondaryText]">
          Photo: {firstImage?.citation}
        </Text>
      </View>
    </Pressable>
  )
}
