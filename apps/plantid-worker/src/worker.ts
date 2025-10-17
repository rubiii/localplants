import {
  IdentityRequest,
  IdentityResult,
  IdentityResultError,
  IdentityResultImage,
  IdentityResultImages,
  Plant,
  PlantIdWorkerAccount,
  PlantNetApi,
  type IdentityRequestType,
  type PlantType,
} from "@localplants/jazz/schema"
import { type AxiosError } from "axios"
import { Group, type co, type Inbox } from "jazz-tools"
import { startWorker as startJazzWorker } from "jazz-tools/worker"
import config from "./config.ts"
import setupProcessExitHandling from "./lib/processExitHandling.ts"
import logger from "./logger.ts"
import {
  parseRateLimitHeader,
  plantNetIdentityRequest,
  type PlantNetRateLimit
} from "./plantNet/index.ts"
import type { PlantNetResponse } from "./plantNet/types.ts"

setupProcessExitHandling()

type InboxType =
  | { subscribe: Inbox["subscribe"] }
  | { subscribe: () => void }

async function main() {
  const { worker, inbox } = await startWorker()

  logger.info("Subscribing to inbox.")
  subscribe(inbox, ({ idRequest }) => handleInboxMessage({ worker, idRequest }))

  logger.info("Waiting for messages.")
}

async function handleInboxMessage({
  worker,
  idRequest
}: {
  worker: co.loaded<typeof PlantIdWorkerAccount>
  idRequest: IdentityRequestType
}) {
  logger.debug("Resolving request and plant values.")
  await idRequest.$jazz.ensureLoaded({ resolve: { results: true } })
  const plant = await Plant.load(idRequest.plantId, {
    resolve: { primaryImage: { image: true }, identity: true },
  })

  if (plant === null) {
    logger.error("Failed to resolve plant value:", { plant })
    return
  }

  let response
  try {
    response = await plantNetIdentityRequest({
      imageId: plant.primaryImage.image.$jazz.id,
    })
  } catch (error) {
    handleRequestError({ error: error as AxiosError, plant, idRequest })
  }
  if (!response) return

  logger.debug("Received PlantNet response:", {
    status: response.status,
    statusText: response.statusText,
  })

  const rateLimit = parseRateLimitHeader(response.headers.ratelimit as string)
  if (rateLimit) {
    logger.debug("Current PlantNet rate limit:", rateLimit)
    await updatePlantNetApi({ rateLimit })
  } else {
    logger.error("Failed to parse rate limit header.")
  }

  processResponse({ idRequest, data: response.data })

  logger.debug("Removing worker from plant.")
  plant.$jazz.owner.removeMember(worker)

  logger.info("Finished identifying plant.")
  idRequest.$jazz.set("completedAt", new Date().toISOString())
  plant.identity.$jazz.set("state", "processed")

  return idRequest
}

async function startWorker() {
  logger.info("Starting worker.")

  console.log("sync", config.jazzSyncServer)
  const {
    worker,
    experimental: { inbox },
  } = await startJazzWorker({
    AccountSchema: PlantIdWorkerAccount,
    syncServer: config.jazzSyncServer,
    accountID: config.plantIdWorkerAccount,
    accountSecret: config.plantIdWorkerSecret,
  })

  const loadedWorker = await worker.$jazz.ensureLoaded({
    resolve: { root: { identityRequests: { $each: true } } },
  })

  return { worker: loadedWorker, inbox }
}

function subscribe(
  inbox: InboxType,
  cb: ({ idRequest }: { idRequest: co.loaded<typeof IdentityRequest> }) => Promise<unknown>
) {
  logger.info("Subscribing to inbox.")
  inbox.subscribe(IdentityRequest, async (idRequest, senderID) => {
    logger.defaultMeta = { requestId: idRequest.$jazz.id }

    logger.info("Received a message:", {
      senderID: senderID,
      createdAt: new Date(idRequest.$jazz.createdAt).toISOString(),
    })

    await cb({ idRequest })
  })
}

function processResponse({
  idRequest,
  data,
}: {
  idRequest: co.loaded<typeof IdentityRequest>
  data: PlantNetResponse
}) {
  for (const { score, species, gbif, powo, images } of data.results) {
    const { genus, family } = species

    const resultImagesOwner = Group.create()
    resultImagesOwner.addMember(idRequest.$jazz.owner)
    const resultImages = IdentityResultImages.create([], resultImagesOwner)

    for (const img of images) {
      const resultImageOwner = Group.create()
      resultImageOwner.addMember(idRequest.$jazz.owner)

      const resultImage = IdentityResultImage.create(
        {
          author: img.author,
          license: img.license,
          citation: img.citation,
          organ: img.organ,
          date: new Date(img.date.timestamp).toISOString(),
          originalImageUrl: img.url.o,
          mediumImageUrl: img.url.m,
          smallImageUrl: img.url.s,
        },
        resultImageOwner
      )
      resultImages.$jazz.push(resultImage)
    }

    const resultOwner = Group.create()
    resultOwner.addMember(idRequest.$jazz.owner)

    const result = IdentityResult.create(
      {
        score: score,
        scientificName: species.scientificName,
        scientificSpeciesNameWithoutAuthor: species.scientificNameWithoutAuthor,
        scientificSpeciesNameAuthorship: species.scientificNameAuthorship,
        scientificGenusName: genus.scientificName,
        scientificGenusNameWithoutAuthor: genus.scientificNameWithoutAuthor,
        scientificGenusNameAuthorship: genus.scientificNameAuthorship,
        scientificFamilyName: family.scientificName,
        scientificFamilyNameWithoutAuthor: family.scientificNameWithoutAuthor,
        scientificFamilyNameAuthorship: family.scientificNameAuthorship,
        commonNames: species.commonNames,
        gbifID: gbif?.id,
        powoID: powo?.id,
        images: resultImages,
      },
      resultOwner
    )

    if (!idRequest.results)
      throw new Error("Expected IdentityRequest.results to be resolved")
    idRequest.results.$jazz.push(result)
  }
}

function handleRequestError({
  error,
  plant,
  idRequest,
}: {
  error: AxiosError
  plant: PlantType
  idRequest: IdentityRequestType
}) {
  if (!plant.identity) {
    logger.error("Unable to handle request error due to missing identity!")
    return
  }

  plant.identity.$jazz.set("state", "failure")
  idRequest.$jazz.set("completedAt", new Date().toISOString())

  const requestErrorGroup = Group.create()
  requestErrorGroup.addMember(idRequest.$jazz.owner)

  if (error.response) {
    idRequest.$jazz.set(
      "error",
      IdentityResultError.create(
        {
          status: error.response.status,
          statusText: error.response.statusText,
        },
        requestErrorGroup
      )
    )
  } else if (error.request) {
    idRequest.$jazz.set(
      "error",
      IdentityResultError.create(
        {
          status: 998,
          statusText: "No response",
        },
        requestErrorGroup
      )
    )
  } else {
    idRequest.$jazz.set(
      "error",
      IdentityResultError.create(
        {
          status: 999,
          statusText: "Failed to request",
        },
        requestErrorGroup
      )
    )
  }
}

async function updatePlantNetApi({ rateLimit, }: { rateLimit?: PlantNetRateLimit }) {
  const plantNetApi = await PlantNetApi.load(config.plantNetApiCoValue)
  if (!plantNetApi) throw new Error("Unable to find PlantNetApi CoValue.")

  if (rateLimit) {
    logger.debug("Updating PlantNetApi CoValue with", { rateLimit })
    plantNetApi.$jazz.set("remainingRequests", rateLimit.remainingRequests)
    plantNetApi.$jazz.set("resetInSeconds", rateLimit.resetInSeconds)
  }
}

await main()
