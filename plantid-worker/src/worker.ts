import crypto from 'crypto'
import { co, Group, Inbox } from 'jazz-tools'
import { startWorker as startJazzWorker } from 'jazz-tools/worker'
import config from './config.js'
import setupProcessExitHandling from './lib/processExitHandling.js'
import logger from './logger.js'
import {
  parseRateLimitHeader,
  plantNetIdentityRequest,
  type PlantNetRateLimit,
} from './plantNet/index.js'
import type { PlantNetResponse } from './plantNet/types.js'
import {
  Plant,
  PlantIdRequest,
  PlantIdResult,
  PlantIdResultImage,
  PlantIdResultImages,
  PlantIdWorkerAccount,
} from './schema.js'

setupProcessExitHandling()

type InboxType = {
  subscribe: Inbox['subscribe']
} | {
  subscribe: () => void;
}

async function main() {
  const { worker, inbox } = await startWorker()

  subscribe(inbox, async ({ idRequest }) => {
    logger.debug('Resolving request and plant values.')
    await idRequest.$jazz.ensureLoaded({ resolve: { results: true } })
    const plant = await Plant.load(idRequest.plantId, {
      resolve: { primaryImage: { image: true } },
    })

    if (plant === null) {
      logger.error('Failed to resolve plant value:', { plant })
      return
    }

    const response = await plantNetIdentityRequest({
      imageId: plant.primaryImage.image.$jazz.id,
    })
    if (!response) return

    logger.debug('Received PlantNet response:', {
      status: response.status,
      statusText: response.statusText,
    })

    const rateLimit = parseRateLimitHeader(response.headers as any)
    if (rateLimit) {
      logger.debug('Current PlantNet rate limit:', rateLimit)
      await updatePlantNetApi({ worker, rateLimit })
    } else {
      logger.error('Failed to parse rate limit header.')
    }

    await processResponse({ idRequest, data: response.data })

    logger.debug('Removing worker from all CoValues.')
    idRequest.$jazz.owner.removeMember(worker)
    plant.$jazz.owner.removeMember(worker)

    logger.info('Finished identifying plant.')
    idRequest.$jazz.set('completedAt', new Date().toISOString())

    return idRequest
  })

  logger.info('Waiting for messages.')
}

async function startWorker() {
  logger.info('Starting worker.')

  const { worker, experimental: { inbox }, } = await startJazzWorker({
    AccountSchema: PlantIdWorkerAccount,
    syncServer: config.jazzSyncServer,
    accountID: config.plantIdWorkerAccount,
    accountSecret: config.plantIdWorkerSecret,
  })

  return { worker, inbox }
}

function subscribe(inbox: InboxType, cb: ({ idRequest }: { idRequest: co.loaded<typeof PlantIdRequest> }) => void) {
  logger.info('Subscribing to inbox.')
  inbox.subscribe(PlantIdRequest, async (idRequest, senderID) => {
    logger.defaultMeta = { iterationId: iterationId() }

    logger.info('Received a message:', {
      senderID: senderID,
      createdAt: new Date(idRequest.$jazz.createdAt).toISOString(),
    })

    cb({ idRequest })
  })
}

async function processResponse({
  idRequest,
  data,
}: {
  idRequest: co.loaded<typeof PlantIdRequest>
  data: PlantNetResponse
}) {
  for (const { score, species, gbif, powo, images } of data.results) {
    const { genus, family } = species

    const resultImagesOwner = Group.create()
    resultImagesOwner.addMember(idRequest.$jazz.owner)
    const resultImages = PlantIdResultImages.create([], resultImagesOwner)

    for (const img of images) {
      const resultImageOwner = Group.create()
      resultImageOwner.addMember(idRequest.$jazz.owner)

      const resultImage = PlantIdResultImage.create(
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
        resultImageOwner,
      )
      resultImages.$jazz.push(resultImage)
    }

    const resultOwner = Group.create()
    resultOwner.addMember(idRequest.$jazz.owner)

    const result = PlantIdResult.create(
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
        gbifID: gbif.id,
        powoID: powo.id,
        images: resultImages,
      },
      resultOwner,
    )

    if (!idRequest.results) throw new Error("Expected PlantIdRequest.results to be resolved")
    idRequest.results.$jazz.push(result)
  }
}

async function updatePlantNetApi({
  worker,
  rateLimit,
}: {
  worker: co.loaded<typeof PlantIdWorkerAccount>
  rateLimit: PlantNetRateLimit
}) {
  await worker.$jazz.ensureLoaded({
    resolve: { root: { plantNetApi: true } },
  })
  if (!worker.root?.plantNetApi) return

  const plantNetApi = worker.root.plantNetApi
  logger.debug('Updating PlantNetApi CoValue:', {
    coValueId: plantNetApi.$jazz.id,
  })
  if (rateLimit) {
    plantNetApi.$jazz.set('remainingRequests', rateLimit.remainingRequests)
    plantNetApi.$jazz.set('resetInSeconds', rateLimit.resetInSeconds)
  }
}

function iterationId() {
  return crypto.randomBytes(8).toString('hex')
}

main()
