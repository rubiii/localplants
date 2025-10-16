import AnimatedRoute from "@/components/AnimatedRoute"
import ImageGrid, { ImageGridItem } from "@/components/ImageGrid"
import {
    MyAppAccount,
    PlantCollection,
    type PlantType,
} from "@localplants/jazz/schema"
import { motion } from "framer-motion"
import { Image, useAccount, useCoState } from "jazz-tools/react"
import { Link } from "wouter"

export default function HomePage() {
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  return (
    <AnimatedRoute title="Local Plants">
      <ol>
        {(me?.root.collections || []).map((collection) => (
          <li key={collection.$jazz.id}>
            <PlantCollectionView collectionId={collection.$jazz.id} />
          </li>
        ))}
      </ol>
    </AnimatedRoute>
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
      <Link to="/" className="hover:text-primary">
        <div className="mb-4 text-5xl font-black">{collection?.name || "…"}</div>
      </Link>

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
      <motion.div
        key={plant.$jazz.id}
        style={{ z: 10 }}
        whileHover={{ scale: 1.01, boxShadow: "0 5px 15px 5px rgba(0,0,0,0.125)", z: 9 }}
        transition={{ ease: "easeOut", duration: 0.1 }}
      >
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        height={500}
        width={500}
      />
      </motion.div>
    </Link>
  )
}
