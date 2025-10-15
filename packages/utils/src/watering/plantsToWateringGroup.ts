import { type WateringGroupId } from "./types"

const topPlantsToWateringGroup: Record<string, WateringGroupId> = {
  // Succulent & Cactus
  "Aloe vera": "succulentCactus",
  "Echeveria elegans": "succulentCactus",
  "Crassula ovata": "succulentCactus",
  "Sedum morganianum": "succulentCactus",
  "Kalanchoe blossfeldiana": "succulentCactus",
  "Opuntia ficus-indica": "succulentCactus",
  "Mammillaria elongata": "succulentCactus",
  "Astrophytum asterias": "succulentCactus",

  // Tropical Foliage
  "Monstera deliciosa": "tropicalFoliage",
  "Ficus lyrata": "tropicalFoliage",
  "Philodendron hederaceum": "tropicalFoliage",
  "Anthurium andraeanum": "tropicalFoliage",
  "Spathiphyllum wallisii": "tropicalFoliage",
  "Dieffenbachia seguine": "tropicalFoliage",
  "Calathea orbifolia": "tropicalFoliage",
  "Aglaonema commutatum": "tropicalFoliage",
  "Alocasia amazonica": "tropicalFoliage",

  // Moisture Loving & Ferns
  "Nephrolepis exaltata": "moistureLovingFern",
  "Adiantum raddianum": "moistureLovingFern",
  "Asplenium nidus": "moistureLovingFern",
  "Davallia fejeensis": "moistureLovingFern",
  "Platycerium bifurcatum": "moistureLovingFern",
  "Maranta leuconeura": "moistureLovingFern",

  // Bulbs & Seasonals
  "Hippeastrum hybrid": "bulbSeasonal",
  "Amaryllis belladonna": "bulbSeasonal",
  "Narcissus tazetta": "bulbSeasonal",
  "Freesia refracta": "bulbSeasonal",
  "Crocus sativus": "bulbSeasonal",
  "Tulipa gesneriana": "bulbSeasonal",

  // Carnivorous & Aquatic
  "Dionaea muscipula": "carnivorousAquatic",
  "Nepenthes alata": "carnivorousAquatic",
  "Drosera capensis": "carnivorousAquatic",
  "Sarracenia purpurea": "carnivorousAquatic",
  "Utricularia vulgaris": "carnivorousAquatic",
  "Cryptocoryne wendtii": "carnivorousAquatic",
  "Anubias barteri": "carnivorousAquatic",
}

export default topPlantsToWateringGroup
