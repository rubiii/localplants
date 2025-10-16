import AnimatedRoute from "@/components/AnimatedRoute"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { Plant } from "@localplants/jazz/schema"
import { Image, useCoState } from "jazz-tools/react"
import { useRoute } from "wouter"

export default function PlantPage() {
  const [, params] = useRoute("/plants/:id")
  const plantId = params?.id
  if (!plantId) throw new Error("Missing plantId")

  const plant = useCoState(Plant, plantId, {
    resolve: { primaryImage: { image: true } },
  })

  return (
    <AnimatedRoute title={plant?.name} backTo="/">
      <PrimaryImageView primaryImageId={plant?.primaryImage.image.$jazz.id} />

      <h1 className="text-5xl font-black mt-4 !text-left">{plant?.name}</h1>
    </AnimatedRoute>
  )
}

function PrimaryImageView({ primaryImageId }: { primaryImageId?: string }) {
  const window = useWindowDimensions()
  const imageHeight = window.height * 0.75

  if (!primaryImageId) return

  return (
    <div style={{ height: imageHeight }}>
      <Image
        imageId={primaryImageId}
        height="original"
        width="original"
        className="rounded-xl object-contain w-auto h-auto max-h-full max-w-full"
      />
    </div>
  )
}
