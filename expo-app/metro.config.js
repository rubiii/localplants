/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

/** @type {import("expo/metro-config").MetroConfig} */
let config = getDefaultConfig(__dirname)
const { transformer, resolver } = config

// SVG transformer
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
}
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
}

// Nativewind
config = withNativeWind(config, { input: "./src/global.css" })

module.exports = config
