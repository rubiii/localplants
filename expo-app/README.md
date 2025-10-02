# 🌱 Local Plants - Expo App

Local-First Plant care app for iOS and Android build with [Expo](https://expo.dev) and [Jazz](https://jazz.tools).

## TODO

[ ] - Use `useSyncConnectionStatus`.  
[ ] - Disable sync by default and add authentication.  
[ ] - Add reasonable limits.  
[ ] - Get on Expo Updates.  

## Get started

Copy the `.env` file to `.env.local` and adjust the default values.
Then you can install dependencies and start the app:

```bash
npx expo install
npm start
```

Now this alone doesn't give you very much, because some kind of build
still needs to run on some iOS/Android device or simulator.
Theoretically you could use [Expo Go](https://expo.dev/blog/expo-go-vs-development-builds),
but this app has grown out of that limited setup quite quickly.

## Local builds

### iOS Simulator

Follow this guide to install Xcode and set up a simulator:  
https://docs.expo.dev/workflow/ios-simulator/

To get the app onto the simular, run:

```bash
npm build:ios:preview
```

and then drag the builds/preview/*.ipa file onto the simulator.

### Android Emulator

Follow this guide to install Java, Android Studio and Android Emulator:  
https://docs.expo.dev/workflow/android-studio-emulator/

To get the app onto the emulator, run:

```bash
npm build:android:preview
```

and then drag the builds/preview/*.apk file onto the emulator.

### iOS Devices

In Xcode, open Window > Devices & Simulators. Connect you phone or
whatever via USB once if it's not already listed under Devices and
then run:

```bash
npm run build:ios:dev
```

Drag the builds/dev/*.ipa file onto the "Installed Apps" section
for your device to install the app.

If the app doesn't seem to install you may need to focus the Xcode
device window because it may need to reconnect.

### Android Device

TODO

```bash
npm run build:android:dev
```

## Expo builds

TODO

##  Activate developer mode on your phone

- Open Settings: Go to your device’s Settings.
- Navigate to Privacy & Security: Scroll down and tap on Privacy & Security.
- Activate Developer Mode: Scroll to the bottom and find Developer Mode. Tap it.

## Docs

- Expo
  - [Guides](https://docs.expo.dev/guides/overview/)
  - [Reference](https://docs.expo.dev/versions/latest/)
- React Native
  - [Core components](https://reactnative.dev/docs/components-and-apis)
  - [Directory](https://reactnative.directory)
- React Navigation
  - [Getting started](https://reactnavigation.org/docs/getting-started)
  - [Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
- Jazz
  - [Docs](https://jazz.tools/docs/react-native-expo)
  - [How Jazz works under the hood](https://www.youtube.com/watch?v=ddBPPAYvd1Y)
