import { type WateringGroup, type WateringGroupId } from "./types"

const wateringGroups: Record<WateringGroupId, WateringGroup> = {
  succulentCactus: {
    id: "succulentCactus",
    label: "Succulent & Cactus",
    description: [
      "Aloe, Echeveria, Crassula, Lithops, Cereus.",
      "Thick leaves/stems, drought-adapted.",
      "Water rarely, dry out fully between.",
    ],
    intervals: {
      growing: { minDays: 14, maxDays: 21 },
      dormant: { minDays: 21, maxDays: 30 },
    },
  },
  tropicalFoliage: {
    id: "tropicalFoliage",
    label: "Tropical Foliage",
    description: [
      "Monstera, Philodendron, Calathea, Ficus lyrata.",
      "Large leaves, high transpiration, like even moisture.",
      "Keep slightly moist, avoid drying out completely.",
    ],
    intervals: {
      growing: { minDays: 5, maxDays: 7 },
      dormant: { minDays: 7, maxDays: 10 },
    },
  },
  moistureLovingFern: {
    id: "moistureLovingFern",
    label: "Ferns & Moisture-Lovers",
    description: [
      "Nephrolepis, Adiantum, Asplenium, Calathea orbifolia.",
      "Thrive in high humidity and constant moisture.",
      "Water frequently, never let soil fully dry.",
    ],
    intervals: {
      growing: { minDays: 7, maxDays: 10 },
      dormant: { minDays: 10, maxDays: 14 },
    },
  },
  bulbSeasonal: {
    id: "bulbSeasonal",
    label: "Bulbs & Seasonals",
    description: [
      "Amaryllis, Hippeastrum, Narcissus, Tulip.",
      "Have a dormancy period.",
      "Water generously when in growth, reduce heavily or stop in dormancy.",
    ],
    intervals: {
      growing: { minDays: 3, maxDays: 5 },
      dormant: { minDays: 5, maxDays: 7 },
    },
  },
  carnivorousAquatic: {
    id: "carnivorousAquatic",
    label: "Carnivorous / Aquatic",
    description: [
      "Venus flytrap, Nepenthes, Sarracenia, Cryptocoryne, Anubias.",
      "Require constant wet or standing water, often rain/distilled only.",
      "Water constantly, keep soil/substrate saturated.",
    ],
    intervals: {
      growing: { minDays: 7, maxDays: 10 },
      dormant: { minDays: 30, maxDays: 60 },
    },
  },
}

export default wateringGroups
