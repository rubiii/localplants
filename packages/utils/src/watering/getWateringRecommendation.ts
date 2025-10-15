import familyToWateringGroup from "./familyToWateringGroup"
import genusToWateringGroup from "./genusToWateringGroup"
import plantsToWateringGroup from "./plantsToWateringGroup"
import {
  type Hemisphere,
  type PlantSize,
  type Season,
  type WateringInterval,
  type WateringRecommendation,
} from "./types"
import wateringGroups from "./wateringGroups"

export default function getWateringRecommendation({
  species,
  genus,
  family,
  hemisphere,
  size,
}: {
  species: string
  genus?: string
  family?: string
  hemisphere: Hemisphere
  size: PlantSize
}): WateringRecommendation {
  const result = determineWateringGroup(species, genus, family)
  if (!result) return { minDays: 7, maxDays: 10, note: "Fallback suggestion" }

  const { wateringGroupId, identifiedVia } = result
  const wateringGroup = wateringGroups[wateringGroupId]

  const season = getSeason(hemisphere)
  let interval = wateringGroup.intervals[season]
  interval = adjustIntervalForPlantSize(interval, size)

  return {
    ...interval,
    wateringGroup: wateringGroup,
    note: `Identified via ${identifiedVia}`,
  }
}

function getSeason(hemisphere: "north" | "south"): Season {
  const month = new Date().getMonth()

  if (hemisphere === "north") {
    // Northern hemisphere growing season: Mar (3) – Aug (8)
    return month >= 3 && month <= 8 ? "growing" : "dormant"
  } else {
    // Southern hemisphere growing season: Sep (9) – Feb (2)
    return month >= 9 || month <= 2 ? "growing" : "dormant"
  }
}

const plantSizeFactors: Record<PlantSize, number> = {
  xs: 0.7, // dries out fastest → 30% shorter interval
  sm: 0.9, // slightly faster than base
  md: 1.0, // baseline
  lg: 1.2, // more soil mass, dries slow → 20% longer
}

function adjustIntervalForPlantSize(
  interval: WateringInterval,
  plantSize: PlantSize
): WateringInterval {
  const factor = plantSizeFactors[plantSize]

  return {
    minDays: Math.max(1, Math.round(interval.minDays * factor)),
    maxDays: Math.max(1, Math.round(interval.maxDays * factor)),
  }
}

function determineWateringGroup(
  species: string,
  genus?: string,
  family?: string
) {
  if (plantsToWateringGroup[species]) {
    return {
      wateringGroupId: plantsToWateringGroup[species],
      identifiedVia: "plants",
    }
  } else if (genus && genusToWateringGroup[genus]) {
    return {
      wateringGroupId: genusToWateringGroup[genus],
      identifiedVia: "genus",
    }
  } else if (family && familyToWateringGroup[family]) {
    return {
      wateringGroupId: familyToWateringGroup[family],
      identifiedVia: "family",
    }
  }
}
