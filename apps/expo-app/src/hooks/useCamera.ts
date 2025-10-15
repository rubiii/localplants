import { type Asset, launchCamera } from "react-native-image-picker"

export default function useCamera() {
  const takePhoto = async (): Promise<Asset | null> => {
    const response = await launchCamera({
      saveToPhotos: true,
      mediaType: "photo",
      includeBase64: false,
      includeExtra: true,
    })

    if (response.didCancel) {
      console.debug("launchCamera was canceled", response)
      return null
    }

    if (response.errorCode) {
      console.error("launchCamera failed", response)
      return null
    }

    if (!response.assets || response.assets.length === 0) {
      console.debug("launchCamera returned w/o assets", response)
      return null
    }

    console.debug(`launchCamera returned ${response.assets.length} assets`)

    const asset = response.assets[0]
    console.debug(`launchCamera asset[0]: ${JSON.stringify(asset)}`)

    if (!asset || !asset.uri) {
      console.error("launchCamera asset[0] or uri missing", asset)
      return null
    }

    return asset
  }

  return {
    takePhoto,
  }
}
