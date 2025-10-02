import { WateringGroupId } from "./types"

const familyToWateringGroup: Record<string, WateringGroupId> = {
  // Succulent & Cactus
  "Crassulaceae": "succulentCactus",
  "Asphodelaceae": "succulentCactus",
  "Cactaceae": "succulentCactus",
  "Aizoaceae": "succulentCactus", // lithops
  "Euphorbiaceae": "succulentCactus", // many succulents

  // Tropical Foliage
  "Araceae": "tropicalFoliage",
  "Moraceae": "tropicalFoliage",
  "Marantaceae": "tropicalFoliage",
  "Araliaceae": "tropicalFoliage",

  // Moisture Loving & Ferns
  "Pteridaceae": "moistureLovingFern",
  "Aspleniaceae": "moistureLovingFern",
  "Davalliaceae": "moistureLovingFern",
  "Polypodiaceae": "moistureLovingFern",

  // Bulbs & Seasonals
  "Amaryllidaceae": "bulbSeasonal",
  "Iridaceae": "bulbSeasonal",
  "Liliaceae": "bulbSeasonal",

  // Carnivorous & Aquatic
  "Droseraceae": "carnivorousAquatic",
  "Nepenthaceae": "carnivorousAquatic",
  "Sarraceniaceae": "carnivorousAquatic",
  "Lentibulariaceae": "carnivorousAquatic",
  "Alismataceae": "carnivorousAquatic",
  "Hydrocharitaceae": "carnivorousAquatic",
  "Nymphaeaceae": "carnivorousAquatic",
}

export default familyToWateringGroup
