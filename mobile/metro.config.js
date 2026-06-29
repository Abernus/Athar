// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// @supabase/realtime-js dynamically require()s the Node "ws" package, which
// imports Node's "stream" and breaks the bundle. We don't use realtime, so
// redirect "ws" to a shim backed by React Native's global WebSocket.
const wsShim = path.resolve(__dirname, "shims/ws.js");
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "ws" || moduleName.startsWith("ws/")) {
    return context.resolveRequest(context, wsShim, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
