// Define the seasons (simplified for indoor care)
export type Season = "growing" | "dormant"

// Define watering frequency as an interval in days
export interface WateringInterval {
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
export interface WateringGroup {
  id: WateringGroupId
  label: string
  description: string[]
  intervals: Record<Season, WateringInterval>
}

export interface WateringRecommendation {
  minDays?: number
  maxDays?: number
  note: string
  wateringGroup?: WateringGroup
}

export type Hemisphere = "north" | "south"

export type PlantSize = "xs" | "sm" | "md" | "lg"
export interface PlantSizeSpec {
  id: PlantSize
  diameterRangeCm: [number, number] // inclusive range in cm
  description: string
}
