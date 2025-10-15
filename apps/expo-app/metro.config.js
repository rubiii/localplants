/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

/** @type {import("expo/metro-config").MetroConfig} */
let config = getDefaultConfig(__dirname)
const { transformer, resolver } = config

// Add wasm asset support for expo-sqlite
// config.resolver.assetExts.push("wasm")

// Add COEP and COOP headers to support SharedArrayBuffer for expo-sqlite
// config.server.enhanceMiddleware = (middleware) => {
//   return (req, res, next) => {
//     res.setHeader("Cross-Origin-Embedder-Policy", "credentialless")
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
//     middleware(req, res, next)
//   }
// }

// SVG transformer
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
}
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: resolver.sourceExts.concat("svg"),
  // .filter((ext) => ext !== "native.js")
  // .concat("svg"),
}

// Nativewind
module.exports = withNativeWind(config, { input: "./src/global.css" })
