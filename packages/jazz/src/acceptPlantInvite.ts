import { Group, type InviteSecret, type co } from "jazz-tools"
import type {
  MyAppAccount
} from "./schema"
import {
  Plant,
  PlantCollection,
  type PlantType
} from "./schema"

export default async function acceptPlantInvite({
  me,
  valueID,
  inviteSecret,
  sharerID,
  sharerName,
}: {
  me: co.loaded<typeof MyAppAccount>
  valueID: string
  inviteSecret: InviteSecret
  sharerID: string
  sharerName: string
}) {
  if (!me.root?.collections) throw new Error("me.root.collections must be loaded")

  let plant: PlantType | null
  try {
    plant = await me.acceptInvite(valueID, inviteSecret, Plant)
  } catch (error) {
    console.error("Failed to accept invite", { valueID, error })
    return
  }
  if (!plant) {
    console.debug("Failed to resolve plant for invite", { valueID })
    return
  }

  const sharerCollection = me.root.collections.find(
    (collection) => collection?.sharedBy?.accountID === sharerID
  )

  if (sharerCollection?.plants) {
    console.debug("Found existing sharer collection. Adding plant from invite.")

    sharerCollection.plants.$jazz.unshift(plant)
    return sharerCollection

  } else {
    console.debug("No existing sharer collection. Creating collection for plant from invite.")

    const collection = PlantCollection.create({
      name: `Plants shared by ${sharerName}`,
      hemisphere: plant.hemisphere ?? "north",
      plants: [plant],
      sharedBy: {
        name: sharerName,
        accountID: sharerID,
        sharedAt: new Date().toISOString(),
      },
    }, Group.create())
    me.root.collections.$jazz.push(collection)
    return collection
  }
}
