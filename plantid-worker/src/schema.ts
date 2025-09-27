import { co, z } from "jazz-tools"
// import config from "./config"

export const PlantIdResultImage = co.map({
  author: z.string(),
  license: z.string(),
  citation: z.string(),
  organ: z.string(),
  date: z.iso.datetime(),
  originalImageUrl: z.string(),
  mediumImageUrl: z.string(),
  smallImageUrl: z.string(),
})
export const PlantIdResultImages = co.list(PlantIdResultImage)

export const PlantIdResult = co.map({
  score: z.number(),
  scientificSpeciesNameWithoutAuthor: z.string(),
  scientificSpeciesNameAuthorship: z.string(),
  scientificGenusNameWithoutAuthor: z.string(),
  scientificGenusNameAuthorship: z.string(),
  scientificGenusName: z.string(),
  scientificFamilyNameWithoutAuthor: z.string(),
  scientificFamilyNameAuthorship: z.string(),
  scientificFamilyName: z.string(),
  scientificName: z.string(),
  commonNames: z.array(z.string()),
  gbifID: z.string(),
  powoID: z.string(),
  images: PlantIdResultImages,
})
export const PlantIdResults = co.list(PlantIdResult)

export const PlantIdRequest = co.map({
  plantId: z.string(),
  completedAt: z.optional(z.iso.datetime()),
  results: co.list(PlantIdResult),
})
export const PlantIdRequests = co.list(PlantIdRequest)

export const PlantImage = co.map({
  image: co.image(),
  assetUri: z.optional(z.string()),
  note: z.optional(z.string()),
  emote: z.optional(z.string()),
  fileCreatedAt: z.optional(z.iso.datetime()),
})
export type PlantImageType = co.loaded<typeof PlantImage>

export const PlantImages = co.list(PlantImage)
export type PlantImagesType = co.loaded<typeof PlantImages>

export const Plant = co.map({
  name: z.string(),
  aquiredAt: z.optional(z.date()),
  diedAt: z.optional(z.date()),
  primaryImage: PlantImage,
  images: PlantImages,
  idRequests: PlantIdRequests,
  idResult: co.optional(PlantIdResult),
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

export const PlantNetApi = co.map({
  resetInSeconds: z.number(),
  remainingRequests: z.number(),
})

const AccountRoot = co.map({
  collections: PlantCollections,
  plantNetApi: PlantNetApi,
})
export type AccountRootType = co.loaded<typeof AccountRoot>

const AccountProfile = co.map({
  name: z.string(),
})
export type AccountProfileType = co.loaded<typeof AccountProfile>

export const MyAppAccount = co.account({
  root: AccountRoot,
  profile: AccountProfile,
})
// .withMigration(async (account) => {
//   if (!account.$jazz.has("root")) {
//     const owner = Group.create()
//     const firstCollection = PlantCollection.create(
//       {
//         name: "Your collection",
//         plants: Plants.create([], owner),
//       },
//       owner,
//     )
//     const plantNetApi = await PlantNetApi.load(config.plantNetApiCoValue)
//     account.$jazz.set("root", {
//       collections: [firstCollection],
//       plantNetApi,
//     })
//     account.$jazz.set("profile", { name: "Anonymous Plant Owner" })
//   }
// })

export const PlantIdWorkerAccount = co.account({
  root: co.map({
    plantIdRequests: PlantIdRequests,
    plantNetApi: PlantNetApi,
  }),
  profile: co.profile(),
})
// .withMigration(async (account) => {
//   if (!account.$jazz.has("root")) {
//     // const plantNetApiGroup = Group.create()
//     // plantNetApiGroup.addMember("everyone", "reader")
//     // const plantNetApi = PlantNetApi.create(
//     //   {
//     //     resetInSeconds: 0,
//     //     remainingRequests: 500,
//     //   },
//     //   plantNetApiGroup,
//     // )
//     // This creates a singleton. We reuse this exact coValue for every account.
//     // console.log("Created PlantNetApi:", { coValue: plantNetApi.$jazz.id })

//     const plantNetApi = await PlantNetApi.load(config.plantNetApiCoValue)
//     account.$jazz.set("root", { plantIdRequests: [], plantNetApi })
//     account.root?.$jazz.owner.makePublic()
//   }
// })
