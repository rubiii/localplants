import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import config from "@/config"
import useNavigation from "@/hooks/useNavigation"
import {
  Plant,
  PlantIdRequest,
  PlantIdResults,
  PlantIdWorkerAccount,
} from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { experimental_useInboxSender, useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Image, Platform, Pressable, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Identify Plant",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"PlantIdentification">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

function HeaderRight({ onSave }: { onSave?: () => void }) {
  return (
    <HeaderTextButton
      text="Save"
      variant="primary"
      onPress={onSave}
      disabled={!onSave}
    />
  )
}

type IdState = "unknown" | "initiated" | "inProgress"

export default function PlantIdentificationScreen() {
  const { navigation, route } = useNavigation<"PlantIdentification">()
  const { plantId, plantName } = route.params

  const [state, setState] = useState<IdState>("unknown")

  const plant = useCoState(Plant, plantId, {
    resolve: {
      idRequests: {
        $each: { results: { $each: { images: { $each: true } } } },
      },
    },
  })
  const worker = useCoState(PlantIdWorkerAccount, config.plantIdWorkerAccount)
  const sendInboxMessage = experimental_useInboxSender(
    config.plantIdWorkerAccount,
  )

  const identifyPlant = async () => {
    if (!plant || !worker) return

    setState("initiated")

    // Make worker able to access plant and images
    plant.$jazz.owner.addMember(worker, "reader")

    // Create id request
    const idResultsGroup = Group.create()
    idResultsGroup.addMember(plant.$jazz.owner)
    idResultsGroup.addMember(worker, "writer")
    const idResults = PlantIdResults.create([], idResultsGroup)

    const idRequestGroup = Group.create()
    idRequestGroup.addMember(plant.$jazz.owner)
    idRequestGroup.addMember(worker, "writer")
    const idRequest = PlantIdRequest.create(
      {
        plantId: plantId,
        results: idResults,
      },
      idRequestGroup,
    )
    plant.idRequests.$jazz.unshift(idRequest)

    // Notify worker of new id request
    await sendInboxMessage(idRequest)

    setState("inProgress")
  }

  useEffect(() => {
    const save = () => {
      console.log("TODO: save")
      navigation.goBack()
    }

    navigation.setOptions({
      headerRight: () => <HeaderRight onSave={save} />,
    })
  }, [navigation])

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <Pressable
        onPress={identifyPlant}
        className="group px-6 py-4 items-center rounded-lg border border-[--border] active:bg-[--primary]"
      >
        <Text className="text-xl text-[--text] group-active:text-[--background]">
          Identify
        </Text>
      </Pressable>

      {plant?.idRequests.map((request) => (
        <View
          key={request.$jazz.id}
          className="px-4 py-2 gap-2 rounded-lg border border-[--border]"
        >
          <Text className="font-bold text-[--text]">ID Request</Text>
          <Text className="text-[--text]">
            CreatedAt: {new Date(request.$jazz.createdAt).toLocaleString()}
            {request.completedAt ? (
              <>
                {"\n"}CompletedAt:{" "}
                {new Date(request.completedAt).toLocaleString()}
              </>
            ) : null}
          </Text>

          {request.results.map((result) =>
            result ? (
              <View key={result.$jazz.id}>
                <Text className="text-[--text]">
                  {result.scientificName} ({result.score})
                </Text>

                <View className="flex-row gap-1">
                  {result.images?.at(0) ? (
                    <Image
                      key={result.images?.at(0)?.$jazz.id}
                      src={result.images?.at(0)?.mediumImageUrl}
                      width={150}
                      height={90}
                    />
                  ) : null}
                </View>
              </View>
            ) : null,
          )}
        </View>
      ))}
    </ScrollableScreenContainer>
  )
}
