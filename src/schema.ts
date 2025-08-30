import { co, z } from "jazz-tools"

export const PlantImage = co.map({
  image: co.image(),
  thumbnail: co.image(),
  note: co.plainText(),
  moods: co.map({
    happy: z.boolean(),
    worried: z.boolean(),
  }),
  createdAt: z.iso.datetime(),
})
export type PlantImage = co.loaded<typeof PlantImage>

const PlantImages = co.list(PlantImage)
export type PlantImages = co.loaded<typeof PlantImages>

export const Plant = co.map({
  name: z.string(),
  primaryImage: PlantImage,
  images: PlantImages,
})
export type PlantType = co.loaded<typeof Plant>

const Plants = co.list(Plant)
export type PlantsType = co.loaded<typeof Plants>

const AccountRoot = co.map({
  plants: Plants,
})
export type AccountRoot = co.loaded<typeof AccountRoot>

const AccountProfile = co.map({
  name: z.string(),
})
export type AccountProfile = co.loaded<typeof AccountProfile>

export const MyAppAccount = co
  .account({
    root: AccountRoot,
    profile: AccountProfile,
  })
  .withMigration(async (account) => {
    if (account.root === undefined) {
      account.$jazz.set("root", { plants: [] })
    }
  })
