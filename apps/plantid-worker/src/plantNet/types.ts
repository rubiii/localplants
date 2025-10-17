export interface PlantNetResponse {
  results: {
    score: number
    species: {
      scientificNameWithoutAuthor: string
      scientificNameAuthorship: string
      genus: {
        scientificNameWithoutAuthor: string
        scientificNameAuthorship: string
        scientificName: string
      }
      family: {
        scientificNameWithoutAuthor: string
        scientificNameAuthorship: string
        scientificName: string
      }
      commonNames: string[]
      scientificName: string
    }
    images: {
      organ: string
      author: string
      license: string
      date: {
        timestamp: number
        string: string
      }
      url: {
        o: string
        m: string
        s: string
      }
      citation: string
    }[]
    gbif?: {
      id: string
    }
    powo?: {
      id: string
    }
    iucn?: {
      id: string
      category: string
    }
  }[]
}
