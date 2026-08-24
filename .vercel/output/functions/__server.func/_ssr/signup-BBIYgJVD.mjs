import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useForm } from "../_libs/tanstack__react-form.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { G as GoogleIcon, s as signupSchema } from "./auth-BPCMgIq_.mjs";
import { u as useAuth, B as Button } from "./router-CvFqzVfm.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, e as CardFooter, a as CardContent } from "./card-jswmrxmG.mjs";
import { F as FieldGroup, a as Field, b as FieldLabel, c as FieldError } from "./field-BBmN2oLs.mjs";
import { I as Input } from "./input-DNKpjK_Q.mjs";
import { S as Separator } from "./separator-CPBfQijI.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
import "../_libs/sonner.mjs";
import "./index-CH6UTATS.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B9_AFGgo.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import "../_libs/tanstack__form-core.mjs";
import "../_libs/tanstack__store.mjs";
import "../_libs/tanstack__pacer-lite.mjs";
import "../_libs/@tanstack/devtools-event-client+[...].mjs";
import "../_libs/tanstack__react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
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
import "node:async_hooks";
import "net";
import "tls";
import "perf_hooks";
import "./label-DIypfdbq.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-separator.mjs";
function SignupPage() {
  const [serverError, setServerError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  const [googleLoading, setGoogleLoading] = reactExports.useState(false);
  const {
    signInWithGoogle
  } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({
      value
    }) => {
      setServerError(null);
      try {
        const res = await rpc.api.auth.signup.$post({
          json: {
            email: value.email,
            password: value.password
          }
        });
        const result = await unwrap(res);
        if (result.error) {
          setServerError(result.error);
          return;
        }
        if (result.needsEmailConfirmation) {
          setSuccess(true);
          setTimeout(() => {
            navigate({
              to: "/login"
            });
          }, 2e3);
        } else {
          navigate({
            to: "/dashboard"
          });
        }
      } catch (error) {
        setServerError(error instanceof Error ? error.message : "Something went wrong");
      }
    },
    validators: {
      onChange: signupSchema
    }
  });
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Check your email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "We've sent you a confirmation email. Please verify your email address to complete signup." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => navigate({
        to: "/login"
      }), children: "Go to Login" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Sign Up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Create an account to get started" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, { children: [
        serverError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/15 p-3 text-sm text-destructive", children: serverError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "email", children: (field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: field.name, name: field.name, type: "email", placeholder: "you@example.com", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), disabled: form.state.isSubmitting, "aria-invalid": isInvalid }),
            isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
          ] });
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "password", children: (field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: field.name, name: field.name, type: "password", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), disabled: form.state.isSubmitting, "aria-invalid": isInvalid }),
            isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
          ] });
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "confirmPassword", children: (field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Confirm Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: field.name, name: field.name, type: "password", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), disabled: form.state.isSubmitting, "aria-invalid": isInvalid }),
            isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
          ] });
        } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: form.state.isSubmitting, children: form.state.isSubmitting ? "Creating account..." : "Sign Up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "w-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "Or continue with" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full", disabled: googleLoading, onClick: async () => {
          setGoogleLoading(true);
          setServerError(null);
          const {
            error
          } = await signInWithGoogle();
          if (error) {
            setServerError(error.message);
            setGoogleLoading(false);
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, { className: "mr-2 h-4 w-4" }),
          googleLoading ? "Signing up..." : "Continue with Google"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline font-medium", children: "Sign in" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  SignupPage as component
};
