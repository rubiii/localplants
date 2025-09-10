# 🌱 Local Plants

Local-First Plant care app for iOS and Android build with [Expo](https://expo.dev) and [Jazz](https://jazz.tools).

## TODO

[ ] - Get on Expo [Updates](https://docs.expo.dev/versions/latest/sdk/updates/)?  
[ ] - Show Jazz-Outage/Connection-Status?  
[ ] - Maybe make sync status (never, always, signedUp) explicit  
[ ] - Enable auth via usePassphraseAuth({ wordlist })  
[ ] - Add reasonable limits? Max collections, max plants, etc.
[ ] - Web build?  
[ ] - Use universal links for invites?  

## Features on display

- Stack navigation
- Deep linking
- Device permissions
- Camera access
- Photo library access
- Keyboard avoiding views
- Theming with Nativewind
- Proper system/auto theming
- Custom theme stored in Jazz
- Sharing with Jazz

## Get started

1. Install dependencies

   ```bash
   npx expo install
   ```

2. Start the app

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Get an app on your phone

Build the app locally:

```bash
npm run build:ios:dev
```

- Connect your phone to your mac.
- Open the Apple Music app, select your phone, then drag the local .ipa file onto the default/general view.
  Your cursor should have a plus sign added to it and this will install the app after you dropped it onto the window.

Activate developer mode on your phone:

- Open Settings: Go to your device’s Settings.
- Navigate to Privacy & Security: Scroll down and tap on Privacy & Security.
- Activate Developer Mode: Scroll to the bottom and find Developer Mode. Tap it.

## Docs

- React Native
  - [Core components](https://reactnative.dev/docs/components-and-apis)
  - [Directory](https://reactnative.directory)
- Expo
  - [Guides](https://docs.expo.dev/guides/overview/)
  - [Reference](https://docs.expo.dev/versions/latest/)
- React Navigation
  - [Getting started](https://reactnavigation.org/docs/getting-started)
  - [Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
