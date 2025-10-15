import { type PlantSize, type PlantSizeSpec } from "./types"

const plantSizes: Record<PlantSize, PlantSizeSpec> = {
  "xs": {
    id: "xs",
    diameterRangeCm: [5, 8],
    description: "Tiny pots (5–8 cm), starter plants, succulents, small herbs.",
  },
  "sm": {
    id: "sm",
    diameterRangeCm: [9, 13],
    description:
      "Small pots (9–13 cm), common for small foliage plants and young houseplants.",
  },
  "md": {
    id: "md",
    diameterRangeCm: [14, 20],
    description:
      "Medium pots (14–20 cm), typical for most mature tabletop plants.",
  },
  "lg": {
    id: "lg",
    diameterRangeCm: [21, 30],
    description:
      "Large pots (21–30 cm), floor-standing plants like palms, ficus, monstera.",
  },
}

export default plantSizes
