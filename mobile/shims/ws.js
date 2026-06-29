// React Native ships a global WebSocket. @supabase/realtime-js lazily
// require()s the Node "ws" package, which pulls in Node's "stream" module and
// fails to bundle under Metro. This app doesn't use Supabase realtime, but
// Metro still bundles the (dynamic) require, so we redirect "ws" to the
// platform WebSocket via metro.config.js. realtime-js consumes the default
// export as `new WS(url, ...)`, which the global WebSocket satisfies.
module.exports = global.WebSocket;
