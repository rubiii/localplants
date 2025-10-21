
import { co, Group, z } from "jazz-tools"

const HemisphereEnum = z.enum(["north", "south"])
export type Hemisphere = z.infer<typeof HemisphereEnum>

const PlantSizeEnum = z.enum(["xs", "sm", "md", "lg"])
export type PlantSize = z.infer<typeof PlantSizeEnum>

export const IdentityResultError = co.map({
  status: z.number(),
  statusText: z.string(),
})

export const IdentityResultImage = co.map({
  author: z.string(),
  license: z.string(),
  citation: z.string(),
  organ: z.string(),
  date: z.iso.datetime(),
  originalImageUrl: z.string(),
  mediumImageUrl: z.string(),
  smallImageUrl: z.string(),
})
export const IdentityResultImages = co.list(IdentityResultImage)

export const IdentityResult = co.map({
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
  gbifID: z.optional(z.string()),
  powoID: z.optional(z.string()),
  images: IdentityResultImages,
})
export type IdentityResultType = co.loaded<typeof IdentityResult>
export const IdentityResults = co.list(IdentityResult)

export const IdentityRequest = co.map({
  plantId: z.string(),
  completedAt: z.optional(z.iso.datetime()),
  results: co.list(IdentityResult),
  error: co.optional(IdentityResultError),
})
export type IdentityRequestType = co.loaded<typeof IdentityRequest>
export const IdentityRequests = co.list(IdentityRequest)

export const PlantIdentity = co.map({
  state: z.enum(["none", "scheduled", "processed", "identified", "failure"]),
  request: co.optional(IdentityRequest),
  result: co.optional(IdentityResult),
})
export type PlantIdentityType = co.loaded<typeof PlantIdentity>

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
  hemisphere: z.optional(HemisphereEnum),
  size: PlantSizeEnum,
  aquiredAt: z.optional(z.date()),
  diedAt: z.optional(z.date()),
  primaryImage: PlantImage,
  images: PlantImages,
  identity: PlantIdentity,
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
  hemisphere: HemisphereEnum,
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
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      const collectionOwner = Group.create()
      const plantsOwner = Group.create()
      plantsOwner.addMember(collectionOwner)

      const firstCollection = PlantCollection.create(
        {
          name: "Your plants",
          hemisphere: "north",
          plants: Plants.create([], plantsOwner),
        },
        collectionOwner
      )

      account.$jazz.set("root", {
        collections: [firstCollection],
      })
      account.$jazz.set("profile", { name: "Anonymous Plant Owner" })
    }
  })

export const PlantIdWorkerAccount = co
  .account({
    root: co.map({
      identityRequests: IdentityRequests,
    }),
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", { identityRequests: [] })
      account.root?.$jazz.owner.makePublic()
    }
  })
