import { type AccountRootType, PlantCollection } from "./schema"

export default function createCollection({
  accountRoot,
  name,
  hemisphere,
}: {
  accountRoot: AccountRootType
  name: string
  hemisphere: "north" | "south"
}) {
  if (!accountRoot.collections) {
    throw new Error("Expect account collections to be loaded")
  }

  const collection = PlantCollection.create({
    name: name.trim(),
    hemisphere,
    plants: [],
  })
  accountRoot.collections.$jazz.unshift(collection)
}
