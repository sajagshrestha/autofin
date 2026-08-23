import { T as TSS_SERVER_FUNCTION, c as createServerFn, a as getRequestHeader } from "./index.mjs";
import { g as getSessionUserFromCookieHeader } from "./session-B8Lju8xH.mjs";
import "../_libs/react.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import "node:async_hooks";
import "node:stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/drizzle-orm.mjs";
import "path";
import "fs";
import "os";
import "net";
import "tls";
import "perf_hooks";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getSessionUserFn_createServerFn_handler = createServerRpc({
  id: "5605692e3347f5f7a25d12255abdc243e9b2ebd41bc4de2805f1b24b6b95350d",
  name: "getSessionUserFn",
  filename: "src/server/functions/session.fns.ts"
}, (opts) => getSessionUserFn.__executeServer(opts));
const getSessionUserFn = createServerFn({
  method: "GET"
}).handler(getSessionUserFn_createServerFn_handler, async () => {
  const cookieHeader = getRequestHeader("cookie");
  const user = await getSessionUserFromCookieHeader(cookieHeader);
  return {
    user
  };
});
export {
  getSessionUserFn_createServerFn_handler
};
