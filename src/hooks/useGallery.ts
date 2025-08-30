import { type Asset, launchImageLibrary } from "react-native-image-picker"

export default function useGallery() {
  const pickPhoto = async (): Promise<Asset | null> => {
    const response = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: false,
      includeExtra: true,
    })

    if (response.didCancel) {
      console.debug("launchImageLibrary was canceled", response)
      return null
    }

    if (response.errorCode) {
      console.error("launchImageLibrary failed", response)
      return null
    }

    if (!response.assets || response.assets.length === 0) {
      console.debug("launchImageLibrary returned w/o assets", response)
      return null
    }

    console.debug(
      `launchImageLibrary returned ${response.assets.length} assets`,
    )

    const asset = response.assets[0]
    console.debug(`launchImageLibrary asset[0]: ${JSON.stringify(asset)}`)

    if (!asset || !asset.uri) {
      console.error("launchImageLibrary asset[0] or uri missing", asset)
      return null
    }

    return asset
  }

  return {
    pickPhoto,
  }
}
