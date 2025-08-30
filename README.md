# 🌱 Greens

A simple plant care app build on [Expo](https://expo.dev).

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

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

## Get an app on your phone

Build the app locally:
eas build --platform ios --profile development --local

- Connect your phone to your mac.
- Open the Apple Music app, select your phone, then drag the local .ipa file onto the default/general view.
  Your cursor should have a plus sign added to it and this will install the app after you dropped it onto the window.

Activate developer mode on your phone:

- Open Settings: Go to your device’s Settings.
- Navigate to Privacy & Security: Scroll down and tap on Privacy & Security.
- Activate Developer Mode: Scroll to the bottom and find Developer Mode. Tap it.

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

Setup:

- Need to install fastlane (why?)
  https://docs.expo.dev/build-reference/ios-builds/#building-ios-projects-with-fastlane
  https://docs.fastlane.tools/getting-started/ios/setup/
  brew install fastlane

Developer Certificate setup:

...

## Docs

- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

## Dependencies

- [Tamagui](https://tamagui.dev/docs/intro/introduction) for styling
