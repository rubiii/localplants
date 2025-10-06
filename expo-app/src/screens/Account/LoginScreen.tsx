import Button from "@/components/Button"
import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import wordlist from "@/lib/wordlist"
import { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { usePassphraseAuth } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Text, View } from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "Login">
}): NativeStackNavigationOptions => ({
  title: route.params?.signUp ? "Sign up" : "Login",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
})

function HeaderLeft() {
  const { navigation } = useNavigation<"Login">()
  return <HeaderTextButton text="Close" onPress={() => navigation.goBack()} />
}

export default function LoginScreen() {
  const { navigation, route } = useNavigation<"Login">()
  const { accountName } = route.params
  const signUp = route.params?.signUp || false

  const auth = usePassphraseAuth({ wordlist })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [loginPassphrase, setLoginPassphrase] = useState("")

  const login = async () => {
    setBusy(true)

    try {
      if (signUp) await auth.signUp(accountName)

      await auth.logIn(loginPassphrase)
      navigation.popTo("Account")
    } catch (error) {
      if (error instanceof Error) {
        if (error.cause instanceof Error) {
          setError(error.cause.message)
        } else {
          setError(error.message)
        }
      } else {
        setError("Unknown error")
      }
      setBusy(false)
    }
  }

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <TextField
        placeholder="Enter your passphrase"
        multiline
        value={loginPassphrase}
        setValue={(value) => setLoginPassphrase(value || "")}
      />
      {error ? (
        <View className="mt-1">
          <Text className="text-[--error]">{error}</Text>
        </View>
      ) : null}

      <Button
        title={signUp ? "Sign up" : "Login"}
        onPress={login}
        disabled={busy}
      />
    </ScrollableScreenContainer>
  )
}
