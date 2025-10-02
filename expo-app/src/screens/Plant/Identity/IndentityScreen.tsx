import Button from "@/components/Button"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import config from "@/config"
import useNavigation from "@/hooks/useNavigation"
import {
  IdentityRequest,
  IdentityResults,
  Plant,
  PlantIdWorkerAccount,
} from "@/schema"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { experimental_useInboxSender, useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import { Text, View } from "react-native"
import HeaderLeft from "./HeaderLeft"
import IdentificationState from "./IdentificationState"
import IdentityState from "./IdentityState"
import PlantNetLogo from "./PlantNetLogo"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Plant Identity",
}

export default function PlantIdentityScreen() {
  const { navigation, route } = useNavigation<"Identity">()
  const { plantId } = route.params

  const plant = useCoState(Plant, plantId, {
    resolve: { identity: true },
  })
  const worker = useCoState(PlantIdWorkerAccount, config.plantIdWorkerAccount)
  const sendInboxMessage = experimental_useInboxSender(
    config.plantIdWorkerAccount,
  )

  const identifyPlant = async () => {
    if (!plant || !worker) {
      console.debug("Skip identifyPlant due to missing dependencies")
      return
    }

    // Create identity request
    const resultsGroup = Group.create()
    resultsGroup.addMember(plant.$jazz.owner)
    resultsGroup.addMember(worker, "writer")
    const results = IdentityResults.create([], resultsGroup)

    const requestGroup = Group.create()
    requestGroup.addMember(plant.$jazz.owner)
    requestGroup.addMember(worker, "writer")
    const request = IdentityRequest.create(
      {
        plantId: plantId,
        results: results,
      },
      requestGroup,
    )
    plant.identity.$jazz.set("request", request)
    plant.identity.$jazz.set("state", "scheduled")

    // Allow worker to temp. access primary image and identity.
    plant.$jazz.owner.addMember(worker, "reader")
    plant.identity.$jazz.owner.addMember(worker, "writer")

    // Notify worker of new request
    await sendInboxMessage(request)
  }

  const resetState = () => {
    if (!plant) return

    plant.identity.$jazz.set("state", "none")
  }

  useEffect(() => {
    const close = () => navigation.goBack()

    navigation.setOptions({
      headerLeft: () => <HeaderLeft text="Close" onPress={close} />,
      headerRight: undefined,
    })
  }, [navigation, plant?.identity.state])

  if (!plant?.identity) return <ScrollableScreenContainer /> // loading

  if (plant.identity.state === "identified")
    return <IdentityState plantIdentityId={plant.identity.$jazz.id} />

  if (plant.identity.state === "processed")
    return <IdentificationState plantIdentityId={plant.identity.$jazz.id} />

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-16 items-center">
      <Text className="text-lg text-[--text] text-center">
        Identifying your plant enables the app{"\n"}
        to suggest better watering schedules.
      </Text>

      <View className="gap-4">
        <Text className="text-sm text-[--text] text-center">
          Identification is
        </Text>
        <PlantNetLogo />
        <Text className="text-sm text-[--secondaryText] text-center">
          (requires your plant’s primary{"\n"}
          photo being send to Pl@ntNet)
        </Text>
      </View>

      {plant.identity.state === "none" ? (
        <Button onPress={identifyPlant} title="Identify plant" size="large" />
      ) : null}

      {plant.identity.state === "scheduled" ? (
        <>
          <Button title="Identifying …" size="large" disabled={true} />
          <Button onPress={resetState} title="Reset state" />
        </>
      ) : null}

      {plant.identity.state === "failure" ? (
        <>
          {plant.identity.request?.error ? (
            <Button
              title={`${plant.identity.request.error.status} ${plant.identity.request.error.statusText}`}
              size="large"
              disabled={true}
            />
          ) : (
            <Button title="Unknown error :/" size="large" disabled={true} />
          )}
          <Button onPress={resetState} title="Reset state" />
        </>
      ) : null}
    </ScrollableScreenContainer>
  )
}
