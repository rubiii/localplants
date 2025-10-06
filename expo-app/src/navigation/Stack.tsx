import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { InviteSecret } from "jazz-tools"

export type RootStackParamList = {
  Welcome: undefined
  Permissions: undefined

  // Account
  Account: undefined
  Auth: undefined
  Login: { accountName: string; signUp?: boolean }
  CustomTheme: { customThemeName: string } | undefined

  // Collection
  Plants: undefined
  Collection: {
    title: string
    collectionId: string
    readOnly: boolean
  }
  AddCollection: undefined
  EditCollection: {
    collectionName: string
    collectionId: string
  }

  // Plants
  Plant: {
    title: string
    plantId: string
    primaryImageId: string
    collectionId: string
    readOnly: boolean
  }
  PlantImageModal: { plantImageId: string }
  AddPlantImage: { plantId: string }
  AddPlant: { collectionId: string }
  EditPlant: { plantId: string; plantName: string; collectionId: string }
  Identity: { plantId: string; plantName: string }

  // Sharing
  SharePlant: { plantId: string }
  AcceptSharedPlant: {
    valueID: string
    inviteSecret: InviteSecret
    sharerID: string
    sharerName: string
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default Stack
