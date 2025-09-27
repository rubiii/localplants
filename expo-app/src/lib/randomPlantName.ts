const names = [
  "Vincent van Grow",
  "Chris Fernsworth",
  "Leaf Erickson",
  "Sir Sprout-a-Lot",
  "Rooty McRootface",
  "Kale Me Maybe",
  "Sprinkle Sprout",
  "Twiggy Stardust",
  "Dr. Leafgood",
  "Baron von Bloom",
  "Baroness von Bloom",
  "Sir Succulent",
  "Berry Potter",
  "Spikey Minaj",
  "Leaf Armstrong",
  "Ivy League",
  "Sassy Grass",
  "Poppy Prickle",
  "Spike Lee",
  "Alexander the Plant",
  "Lord of the Sprigs",
  "Root Skywalker",
  "Moss Def",
  "Phyllis Dendron",
  "Sunflower Supreme",
  "Dandelion Dynamite",
  "Lil Sprout",
  "Cactus Everdeen",
  "Fernie Sanders",
  "Seedy Gonzales",
  "Keanu Leaves",
  "Chili Eilish",
  "Lil Plant X",
  "Peppermint Patti",
  "Stevia Buscemi",
  "Green Latifah",
]

export function randomPlantName(): string {
  return names[Math.floor(Math.random() * names.length)]
}

export function newRandomPlantName(currentName?: string): string {
  const maxTries = 5
  let tries = 0
  let newName = randomPlantName()

  while (currentName === newName && tries <= maxTries) {
    newName = randomPlantName()
    tries += 1
  }

  return newName
}
