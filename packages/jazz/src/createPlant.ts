import { Group } from "jazz-tools"
import {
  Plant,
  PlantIdentity,
  PlantImages,
  type Hemisphere,
  type PlantCollectionType,
  type PlantImageType,
  type PlantSize
} from "./schema"

export default function createPlant({
  name,
  hemisphere,
  size,
  emote,
  note,
  collection,
  plantImage,
}: {
  name: string
  hemisphere: Hemisphere
  size: PlantSize,
  emote?: string | undefined
  note?: string | undefined
  collection: PlantCollectionType
  plantImage: PlantImageType
}) {
  if (!collection.plants) throw new Error("collection.plants must be loaded")
  if (!plantImage.image) throw new Error("plantImage.image must be loaded")

  const plantOwner = Group.create()

  // Ensure members of collection can access all plants.
  plantOwner.addMember(collection.$jazz.owner)

  plantImage.$jazz.set("emote", emote)
  plantImage.$jazz.set("note", note)
  const plantImages = PlantImages.create([plantImage], Group.create())
  const identity = PlantIdentity.create({ state: "none" }, Group.create())

  // Ensure that adding a new member to the plant's owner group
  // allows the new member to access all values and references.
  plantImage.$jazz.owner.addMember(plantOwner)
  plantImage.image.$jazz.owner.addMember(plantOwner)
  plantImages.$jazz.owner.addMember(plantOwner)
  identity.$jazz.owner.addMember(plantOwner)

  const plant = Plant.create({
    name,
    hemisphere,
    size,
    identity,
    primaryImage: plantImage,
    images: plantImages,
  }, plantOwner)
  collection.plants.$jazz.unshift(plant)

  return plant
}
