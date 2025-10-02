// Define the seasons (simplified for indoor care)
export type Season = "growing" | "dormant"

// Define watering frequency as an interval in days
export type WateringInterval = {
  minDays: number // shortest interval
  maxDays: number // longest interval
}

export type WateringGroupId =
  | "succulentCactus"
  | "tropicalFoliage"
  | "moistureLovingFern"
  | "bulbSeasonal"
  | "carnivorousAquatic"

// Watering groups with seasonal intervals
export type WateringGroup = {
  id: WateringGroupId
  label: string
  description: string[]
  intervals: Record<Season, WateringInterval>
}

export type WateringRecommendation = {
  minDays?: number
  maxDays?: number
  note: string
  wateringGroup?: WateringGroup
}

export type Hemisphere = "north" | "south"

export type PlantSize = "xs" | "sm" | "md" | "lg"
export type PlantSizeSpec = {
  id: PlantSize
  diameterRangeCm: [number, number] // inclusive range in cm
  description: string
}
