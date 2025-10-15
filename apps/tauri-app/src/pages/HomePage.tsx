import ImageGrid, { ImageGridItem } from "@/components/ImageGrid"
import {
  MyAppAccount,
  PlantCollection,
  type PlantType,
} from "@localplants/jazz/schema"
import { Image } from "jazz-tools/expo"
import { useAccount, useCoState } from "jazz-tools/react"
import { Link } from "wouter"

export default function HomePage() {
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  return (
    <div className="px-12 py-6">
      <div className="mb-6">
        <Link href="/login">Login</Link>
      </div>

      <ol className="list-none">
        {(me?.root.collections || []).map((collection) => (
          <li key={collection.$jazz.id}>
            <PlantCollectionView collectionId={collection.$jazz.id} />
          </li>
        ))}
      </ol>
    </div>
  )
}

function PlantCollectionView({ collectionId }: { collectionId: string }) {
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      sharedBy: true,
      plants: { $each: { primaryImage: { image: true } } },
    },
  })

  return (
    <div className="mb-12">
      <div className="mb-4 text-5xl font-black">{collection?.name || "…"}</div>

      <ImageGrid>
        {(collection?.plants || []).map((plant) => (
          <ImageGridItem key={plant.$jazz.id} id={plant.$jazz.id}>
            <PlantItem plant={plant} />
          </ImageGridItem>
        ))}
      </ImageGrid>
    </div>
  )
}

function PlantItem({ plant }: { plant: PlantType }) {
  if (!plant.primaryImage?.image) return

  return (
    <Link to={`/plants/${plant.$jazz.id}`}>
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        height={500}
        width={500}
      />
    </Link>
  )
}
