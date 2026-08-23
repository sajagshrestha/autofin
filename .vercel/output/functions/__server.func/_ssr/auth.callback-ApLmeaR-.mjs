import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-CsLX1gsd.mjs";
import { u as useAuth } from "./router-CdED92sw.mjs";
import { r as rpc } from "./api-client-CFEv0PPX.mjs";
import "../_libs/sonner.mjs";
import "../_libs/supabase__ssr.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B8Lju8xH.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/t3-oss__env-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/hono__zod-validator.mjs";
import "../_libs/ai.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
import "../_libs/vercel__oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
import "../_libs/unpdf.mjs";
import "../_libs/ai-sdk__anthropic.mjs";
import "../_libs/ai-sdk__google.mjs";
import "../_libs/ai-sdk__openai.mjs";
import "../_libs/inngest.mjs";
import "../_libs/inngest__ai.mjs";
import "../_libs/chalk.mjs";
import "../_libs/ansi-styles.mjs";
import "../_libs/color-convert.mjs";
import "../_libs/color-name.mjs";
import "../_libs/supports-color.mjs";
import "tty";
import "../_libs/has-flag.mjs";
import "../_libs/hash.js.mjs";
import "../_libs/minimalistic-assert.mjs";
import "../_libs/inherits.mjs";
import "../_libs/json-stringify-safe.mjs";
import "../_libs/ms.mjs";
import "../_libs/serialize-error-cjs.mjs";
import "../_libs/strip-ansi.mjs";
import "../_libs/ansi-regex.mjs";
import "../_libs/debug.mjs";
import "../_libs/canonicalize.mjs";
import "node:crypto";
import "../_libs/date-fns-tz.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/cookie.mjs";
import "node:async_hooks";
import "net";
import "tls";
import "perf_hooks";
function AuthCallbackPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (user) {
      rpc.api.auth["ensure-user"].$post().catch((error) => {
        console.error("Failed to sync user record:", error);
      }).finally(() => {
        navigate({
          to: "/dashboard"
        });
      });
    } else {
      navigate({
        to: "/login"
      });
    }
  }, [user, loading, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Completing sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Please wait while we finish signing you in..." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }) })
  ] }) });
}
export {
  AuthCallbackPage as component
};
