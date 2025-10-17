import { Group } from "jazz-tools"
import { createImage } from "jazz-tools/media"
import { PlantImage } from "./schema"

export default async function createPlantImage({
  uri,
  timestamp,
}: {
  uri: string
  timestamp?: string
}) {
  const image = await createImage(uri, {
    owner: Group.create(),
    progressive: true,
    placeholder: "blur",
    maxSize: 2400,
  })

  const fileCreatedAt = timestamp
    ? new Date(timestamp).toISOString()
    : undefined

  return PlantImage.create(
    {
      image,
      assetUri: uri,
      fileCreatedAt,
    },
    Group.create()
  )
}
