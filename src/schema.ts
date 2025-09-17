import { co, Group, z } from "jazz-tools"

export const PlantImage = co.map({
  image: co.image(),
  assetUri: z.optional(z.string()),
  note: z.optional(z.string()),
  emote: z.optional(z.string()),
  createdAt: z.iso.datetime(),
  addedAt: z.iso.datetime(),
})
export type PlantImageType = co.loaded<typeof PlantImage>

export const PlantImages = co.list(PlantImage)
export type PlantImagesType = co.loaded<typeof PlantImages>

export const Plant = co.map({
  name: z.string(),
  primaryImage: PlantImage,
  images: PlantImages,
})
export type PlantType = co.loaded<typeof Plant>

export const Plants = co.list(Plant)
export type PlantsType = co.loaded<typeof Plants>

const SharedBy = co.map({
  name: z.string(),
  accountID: z.string(),
  sharedAt: z.iso.datetime(),
})

export const PlantCollection = co.map({
  name: z.string(),
  plants: Plants,
  sharedBy: co.optional(SharedBy),
})
export type PlantCollectionType = co.loaded<typeof PlantCollection>

export const PlantCollections = co.list(PlantCollection)
export type PlantCollectionsType = co.loaded<typeof PlantCollections>

const AccountRoot = co.map({
  collections: PlantCollections,
})
export type AccountRootType = co.loaded<typeof AccountRoot>

const AccountProfile = co.map({
  name: z.string(),
})
export type AccountProfileType = co.loaded<typeof AccountProfile>

export const MyAppAccount = co
  .account({
    root: AccountRoot,
    profile: AccountProfile,
  })
  .withMigration(async (account) => {
    if (account.root === undefined) {
      const owner = Group.create()
      const firstCollection = PlantCollection.create(
        {
          name: "Your collection",
          plants: co.list(Plant).create([], owner),
        },
        owner,
      )
      account.$jazz.set("root", { collections: [firstCollection] })
      account.$jazz.set("profile", { name: "Anonymous Plant Owner" })
    }
  })
