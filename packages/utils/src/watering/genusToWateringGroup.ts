import { type WateringGroupId } from "./types"

const genusToWateringGroup: Partial<Record<string, WateringGroupId>> = {
  // Succulent & Cactus
  "Aloe": "succulentCactus",
  "Echeveria": "succulentCactus",
  "Crassula": "succulentCactus",
  "Sedum": "succulentCactus",
  "Kalanchoe": "succulentCactus",
  "Haworthia": "succulentCactus",
  "Opuntia": "succulentCactus",
  "Mammillaria": "succulentCactus",
  "Lithops": "succulentCactus",

  // Tropical Foliage
  "Monstera": "tropicalFoliage",
  "Philodendron": "tropicalFoliage",
  "Anthurium": "tropicalFoliage",
  "Spathiphyllum": "tropicalFoliage",
  "Calathea": "tropicalFoliage",
  "Dieffenbachia": "tropicalFoliage",
  "Aglaonema": "tropicalFoliage",
  "Alocasia": "tropicalFoliage",
  "Ficus": "tropicalFoliage",
  "Schefflera": "tropicalFoliage",

  // Moisture Loving & Ferns
  "Nephrolepis": "moistureLovingFern",
  "Adiantum": "moistureLovingFern",
  "Asplenium": "moistureLovingFern",
  "Davallia": "moistureLovingFern",
  "Platycerium": "moistureLovingFern",
  "Maranta": "moistureLovingFern",

  // Bulbs & Seasonals
  "Hippeastrum": "bulbSeasonal",
  "Amaryllis": "bulbSeasonal",
  "Narcissus": "bulbSeasonal",
  "Freesia": "bulbSeasonal",
  "Crocus": "bulbSeasonal",
  "Tulipa": "bulbSeasonal",

  // Carnivorous & Aquatic
  "Dionaea": "carnivorousAquatic",
  "Nepenthes": "carnivorousAquatic",
  "Drosera": "carnivorousAquatic",
  "Sarracenia": "carnivorousAquatic",
  "Utricularia": "carnivorousAquatic",
  "Cryptocoryne": "carnivorousAquatic",
  "Anubias": "carnivorousAquatic",
  "Nymphaea": "carnivorousAquatic",
}

export default genusToWateringGroup
