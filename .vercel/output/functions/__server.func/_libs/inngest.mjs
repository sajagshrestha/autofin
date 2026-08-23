import { q as objectType, v as stringType, w as enumType, x as literalType, y as strictObjectType, z as unionType, A as numberType, B as arrayType, C as recordType, D as unknownType, E as lazyType, F as anyType, G as booleanType, H as ZodError, I as dateType, J as instanceOfType } from "./zod.mjs";
import { d as distExports$1 } from "./inngest__ai.mjs";
import { c as chalk } from "./chalk.mjs";
import { h as hashjs } from "./hash.js.mjs";
import { s as stringify } from "./json-stringify-safe.mjs";
import { m as ms } from "./ms.mjs";
import { d as distExports } from "./serialize-error-cjs.mjs";
import { s as stripAnsi } from "./strip-ansi.mjs";
import { d as debug } from "./debug.mjs";
import { c as canonicalize } from "./canonicalize.mjs";
import { s as srcExports } from "./opentelemetry__api.mjs";
let queryKeys = /* @__PURE__ */ (function(queryKeys$1) {
  queryKeys$1["DeployId"] = "deployId";
  queryKeys$1["FnId"] = "fnId";
  queryKeys$1["Probe"] = "probe";
  queryKeys$1["StepId"] = "stepId";
  return queryKeys$1;
})({});
let probe = /* @__PURE__ */ (function(probe$1) {
  probe$1["Trust"] = "trust";
  return probe$1;
})({});
let envKeys = /* @__PURE__ */ (function(envKeys$1) {
  envKeys$1["InngestSigningKey"] = "INNGEST_SIGNING_KEY";
  envKeys$1["InngestSigningKeyFallback"] = "INNGEST_SIGNING_KEY_FALLBACK";
  envKeys$1["InngestEventKey"] = "INNGEST_EVENT_KEY";
  envKeys$1["InngestDevServerUrl"] = "INNGEST_DEVSERVER_URL";
  envKeys$1["InngestEnvironment"] = "INNGEST_ENV";
  envKeys$1["InngestBaseUrl"] = "INNGEST_BASE_URL";
  envKeys$1["InngestEventApiBaseUrl"] = "INNGEST_EVENT_API_BASE_URL";
  envKeys$1["InngestApiBaseUrl"] = "INNGEST_API_BASE_URL";
  envKeys$1["InngestServeHost"] = "INNGEST_SERVE_HOST";
  envKeys$1["InngestServePath"] = "INNGEST_SERVE_PATH";
  envKeys$1["InngestLogLevel"] = "INNGEST_LOG_LEVEL";
  envKeys$1["InngestStreaming"] = "INNGEST_STREAMING";
  envKeys$1["InngestDevMode"] = "INNGEST_DEV";
  envKeys$1["InngestAllowInBandSync"] = "INNGEST_ALLOW_IN_BAND_SYNC";
  envKeys$1["InngestConnectMaxWorkerConcurrency"] = "INNGEST_CONNECT_MAX_WORKER_CONCURRENCY";
  envKeys$1["InngestConnectIsolateExecution"] = "INNGEST_CONNECT_ISOLATE_EXECUTION";
  envKeys$1["BranchName"] = "BRANCH_NAME";
  envKeys$1["VercelBranch"] = "VERCEL_GIT_COMMIT_REF";
  envKeys$1["IsVercel"] = "VERCEL";
  envKeys$1["CloudflarePagesBranch"] = "CF_PAGES_BRANCH";
  envKeys$1["IsCloudflarePages"] = "CF_PAGES";
  envKeys$1["NetlifyBranch"] = "BRANCH";
  envKeys$1["IsNetlify"] = "NETLIFY";
  envKeys$1["RenderBranch"] = "RENDER_GIT_BRANCH";
  envKeys$1["IsRender"] = "RENDER";
  envKeys$1["RailwayBranch"] = "RAILWAY_GIT_BRANCH";
  envKeys$1["RailwayEnvironment"] = "RAILWAY_ENVIRONMENT";
  envKeys$1["VercelEnvKey"] = "VERCEL_ENV";
  envKeys$1["NodeEnv"] = "NODE_ENV";
  envKeys$1["Context"] = "CONTEXT";
  envKeys$1["Environment"] = "ENVIRONMENT";
  envKeys$1["DenoDeployment"] = "DENO_DEPLOYMENT_ID";
  envKeys$1["OpenAiApiKey"] = "OPENAI_API_KEY";
  envKeys$1["GeminiApiKey"] = "GEMINI_API_KEY";
  envKeys$1["AnthropicApiKey"] = "ANTHROPIC_API_KEY";
  envKeys$1["ReactAppInngestBaseUrl"] = "REACT_APP_INNGEST_BASE_URL";
  envKeys$1["ReactAppInngestDevMode"] = "REACT_APP_INNGEST_DEV";
  envKeys$1["NextPublicInngestBaseUrl"] = "NEXT_PUBLIC_INNGEST_BASE_URL";
  envKeys$1["NextPublicInngestDevMode"] = "NEXT_PUBLIC_INNGEST_DEV";
  return envKeys$1;
})({});
let headerKeys = /* @__PURE__ */ (function(headerKeys$1) {
  headerKeys$1["ContentType"] = "content-type";
  headerKeys$1["Host"] = "host";
  headerKeys$1["ForwardedFor"] = "x-forwarded-for";
  headerKeys$1["RealIp"] = "x-real-ip";
  headerKeys$1["Location"] = "location";
  headerKeys$1["ContentLength"] = "content-length";
  headerKeys$1["Signature"] = "x-inngest-signature";
  headerKeys$1["SdkVersion"] = "x-inngest-sdk";
  headerKeys$1["Environment"] = "x-inngest-env";
  headerKeys$1["Platform"] = "x-inngest-platform";
  headerKeys$1["Framework"] = "x-inngest-framework";
  headerKeys$1["NoRetry"] = "x-inngest-no-retry";
  headerKeys$1["RequestVersion"] = "x-inngest-req-version";
  headerKeys$1["RetryAfter"] = "retry-after";
  headerKeys$1["InngestServerKind"] = "x-inngest-server-kind";
  headerKeys$1["InngestExpectedServerKind"] = "x-inngest-expected-server-kind";
  headerKeys$1["InngestSyncKind"] = "x-inngest-sync-kind";
  headerKeys$1["EventIdSeed"] = "x-inngest-event-id-seed";
  headerKeys$1["TraceParent"] = "traceparent";
  headerKeys$1["TraceState"] = "tracestate";
  headerKeys$1["InngestRunId"] = "x-run-id";
  headerKeys$1["InngestStepId"] = "x-inngest-step-id";
  headerKeys$1["InngestForceStepPlan"] = "x-inngest-force-step-plan";
  headerKeys$1["SdkHandled"] = "x-inngest-sdk-handled";
  return headerKeys$1;
})({});
const forwardedHeaders = [headerKeys.TraceParent, headerKeys.TraceState];
const defaultInngestApiBaseUrl = "https://api.inngest.com/";
const defaultInngestEventBaseUrl = "https://inn.gs/";
const defaultDevServerHost = "http://localhost:8288/";
let internalEvents = /* @__PURE__ */ (function(internalEvents$1) {
  internalEvents$1["FunctionFailed"] = "inngest/function.failed";
  internalEvents$1["FunctionInvoked"] = "inngest/function.invoked";
  internalEvents$1["FunctionFinished"] = "inngest/function.finished";
  internalEvents$1["FunctionCancelled"] = "inngest/function.cancelled";
  internalEvents$1["ScheduledTimer"] = "inngest/scheduled.timer";
  internalEvents$1["HttpRequest"] = "inngest/http.request";
  return internalEvents$1;
})({});
const logPrefix = chalk.magenta.bold("[Inngest]");
const debugPrefix = "inngest";
const dummyEventKey = "NO_EVENT_KEY_SET";
let syncKind = /* @__PURE__ */ (function(syncKind$1) {
  syncKind$1["InBand"] = "in_band";
  syncKind$1["OutOfBand"] = "out_of_band";
  return syncKind$1;
})({});
let ExecutionVersion = /* @__PURE__ */ (function(ExecutionVersion$1) {
  ExecutionVersion$1[ExecutionVersion$1["V0"] = 0] = "V0";
  ExecutionVersion$1[ExecutionVersion$1["V1"] = 1] = "V1";
  ExecutionVersion$1[ExecutionVersion$1["V2"] = 2] = "V2";
  return ExecutionVersion$1;
})({});
const defaultMaxRetries = 3;
const version = "3.54.2";
const { sha256: sha256$1 } = hashjs;
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
const stringify$1 = (input) => {
  return stringify(input, (_key, value) => {
    if (typeof value !== "bigint") return value;
  });
};
const second = 1 * 1e3;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const periods = [
  ["w", day * 7],
  ["d", day],
  ["h", hour],
  ["m", minute],
  ["s", second]
];
const timeStr = (input) => {
  if (input instanceof Date) return input.toISOString();
  const milliseconds = typeof input === "string" ? ms(input) : input;
  const [, timeStr$1] = periods.reduce(([num, str], [suffix, period]) => {
    const numPeriods = Math.floor(num / period);
    if (numPeriods > 0) return [num % period, `${str}${numPeriods}${suffix}`];
    return [num, str];
  }, [milliseconds, ""]);
  return timeStr$1;
};
const stringifyUnknown = (input) => {
  if (typeof input === "boolean" || typeof input === "number" || typeof input === "string") return input.toString();
};
const hashEventKey = (eventKey) => {
  return sha256$1().update(eventKey).digest("hex");
};
const hashSigningKey = (signingKey) => {
  if (!signingKey) return "";
  const prefix = signingKey.match(/^signkey-[\w]+-/)?.shift() || "";
  const key = removeSigningKeyPrefix(signingKey);
  return `${prefix}${sha256$1().update(key, "hex").digest("hex")}`;
};
function removeSigningKeyPrefix(signingKey) {
  return signingKey.replace(/^signkey-[\w]+-/, "");
}
var NonRetriableError = class extends Error {
  /**
  * The underlying cause of the error, if any.
  *
  * This will be serialized and sent to Inngest.
  */
  cause;
  constructor(message, options) {
    super(message);
    this.cause = options?.cause;
    this.name = "NonRetriableError";
  }
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Calling `require` for "' + x + "\" in an environment that doesn't expose the `require` function.");
});
const SERIALIZED_KEY = "__serialized";
const SERIALIZED_VALUE = true;
distExports.errorConstructors.set("NonRetriableError", NonRetriableError);
const serializeError$1 = (subject, allowUnknown = false) => {
  try {
    const existingSerializedError = isSerializedError(subject);
    if (existingSerializedError) return existingSerializedError;
    if (typeof subject === "object" && subject !== null) {
      const serializedErr = distExports.serializeError(subject);
      if (!serializedErr.name && allowUnknown) return subject;
      const ret = {
        ...serializedErr,
        name: serializedErr.name || "Error",
        message: serializedErr.message || stringify(subject) || "Unknown error; error serialization could not find a message.",
        stack: serializedErr.stack || "",
        [SERIALIZED_KEY]: SERIALIZED_VALUE
      };
      let target = ret;
      const maxDepth = 5;
      for (let i = 0; i < maxDepth; i++) {
        if (typeof target === "object" && target !== null && "cause" in target && target.cause) {
          target = target.cause = serializeError$1(target.cause, true);
          continue;
        }
        break;
      }
      return ret;
    }
    throw new Error("Error is not an object; strange throw value.");
  } catch {
    if (allowUnknown) return subject;
    try {
      return {
        ...serializeError$1(new Error(typeof subject === "string" ? subject : stringify(subject)), false),
        stack: "",
        [SERIALIZED_KEY]: SERIALIZED_VALUE
      };
    } catch {
      return {
        name: "Could not serialize source error",
        message: "Serializing the source error failed.",
        stack: "",
        [SERIALIZED_KEY]: SERIALIZED_VALUE
      };
    }
  }
};
const isSerializedError = (value) => {
  try {
    if (typeof value === "string") {
      const parsed = objectType({
        [SERIALIZED_KEY]: literalType(SERIALIZED_VALUE),
        name: enumType([...Array.from(distExports.errorConstructors.keys())]),
        message: stringType(),
        stack: stringType()
      }).passthrough().safeParse(JSON.parse(value));
      if (parsed.success) return parsed.data;
    }
    if (typeof value === "object" && value !== null) {
      if (Object.hasOwn(value, SERIALIZED_KEY) && value[SERIALIZED_KEY] === SERIALIZED_VALUE) return value;
    }
  } catch {
  }
};
const deserializeError$1 = (subject, allowUnknown = false) => {
  const requiredFields = ["name", "message"];
  try {
    if (!requiredFields.every((field) => {
      return Object.hasOwn(subject, field);
    })) throw new Error();
    const deserializedErr = distExports.deserializeError(subject);
    if ("cause" in deserializedErr) deserializedErr.cause = deserializeError$1(deserializedErr.cause, true);
    return deserializedErr;
  } catch {
    if (allowUnknown) return subject;
    const err2 = /* @__PURE__ */ new Error("Unknown error; could not reserialize");
    err2.stack = void 0;
    return err2;
  }
};
let ErrCode = /* @__PURE__ */ (function(ErrCode$1) {
  ErrCode$1["NESTING_STEPS"] = "NESTING_STEPS";
  ErrCode$1["NON_DETERMINISTIC_FUNCTION"] = "NON_DETERMINISTIC_FUNCTION";
  ErrCode$1["ASYNC_DETECTED_AFTER_MEMOIZATION"] = "ASYNC_DETECTED_AFTER_MEMOIZATION";
  ErrCode$1["STEP_USED_AFTER_ASYNC"] = "STEP_USED_AFTER_ASYNC";
  ErrCode$1["AUTOMATIC_PARALLEL_INDEXING"] = "AUTOMATIC_PARALLEL_INDEXING";
  ErrCode$1["NONDETERMINISTIC_STEPS"] = "NONDETERMINISTIC_STEPS";
  return ErrCode$1;
})({});
const prettyErrorSplitter = "=================================================";
const minifyPrettyError = (err2) => {
  try {
    if (!isError(err2)) return err2;
    if (!err2.message.includes(prettyErrorSplitter)) return err2;
    const sanitizedMessage = stripAnsi(err2.message);
    const message = sanitizedMessage.split("  ")[1]?.split("\n")[0]?.trim() || err2.message;
    err2.message = [sanitizedMessage.split("\n\nCode: ")[1]?.split("\n\n")[0]?.trim() || void 0, message].filter(Boolean).join(" - ");
    if (err2.stack) {
      const stackRest = stripAnsi(err2.stack).split(`${prettyErrorSplitter}
`).slice(2).join("\n");
      err2.stack = `${err2.name}: ${err2.message}
${stackRest}`;
    }
    return err2;
  } catch (_noopErr) {
    return err2;
  }
};
const isError = (err2) => {
  try {
    if (err2 instanceof Error) return true;
    if (typeof err2 !== "object" || err2 === null) return false;
    return Object.hasOwn(err2, "name") && Object.hasOwn(err2, "message");
  } catch (_noopErr) {
    return false;
  }
};
const getErrorMessage = (err2, fallback) => {
  const { message } = objectType({ message: stringType().min(1) }).catch({ message: fallback }).parse(err2);
  return message;
};
const prettyError = ({ type = "error", whatHappened, otherwise, reassurance, toFixNow, why, consequences, stack, code }) => {
  const { icon, colorFn } = {
    error: {
      icon: "❌",
      colorFn: chalk.red
    },
    warn: {
      icon: "⚠️",
      colorFn: chalk.yellow
    }
  }[type];
  let header = `${icon}  ${chalk.bold.underline(whatHappened.trim())}`;
  if (stack) header += "\n" + [...(/* @__PURE__ */ new Error()).stack?.split("\n").slice(1).filter(Boolean) || []].join("\n");
  let toFixNowStr = (Array.isArray(toFixNow) ? toFixNow.map((s) => s.trim()).filter(Boolean).map((s, i) => `	${i + 1}. ${s}`).join("\n") : toFixNow?.trim()) ?? "";
  if (Array.isArray(toFixNow) && toFixNowStr) toFixNowStr = `To fix this, you can take one of the following courses of action:

${toFixNowStr}`;
  let body = [
    reassurance?.trim(),
    why?.trim(),
    consequences?.trim()
  ].filter(Boolean).join(" ");
  body += body ? `

${toFixNowStr}` : toFixNowStr;
  const trailer = [otherwise?.trim()].filter(Boolean).join(" ");
  return colorFn([
    prettyErrorSplitter,
    header,
    body,
    trailer,
    code ? `Code: ${code}` : "",
    prettyErrorSplitter
  ].filter(Boolean).join("\n\n"));
};
const fixEventKeyMissingSteps = [
  "Set the `INNGEST_EVENT_KEY` environment variable",
  `Pass a key to the \`new Inngest()\` constructor using the \`eventKey\` option`,
  `Use \`inngest.setEventKey()\` at runtime`
];
const rethrowError = (prefix) => {
  return (err2) => {
    try {
      err2.message &&= `${prefix}; ${err2.message}`;
    } catch (_noopErr) {
    } finally {
      throw err2;
    }
  };
};
const functionStoppedRunningErr = (code) => {
  return prettyError({
    whatHappened: "Your function was stopped from running",
    why: "We detected a mix of asynchronous logic, some using step tooling and some not.",
    consequences: "This can cause unexpected behaviour when a function is paused and resumed and is therefore strongly discouraged; we stopped your function to ensure nothing unexpected happened!",
    stack: true,
    toFixNow: "Ensure that your function is either entirely step-based or entirely non-step-based, by either wrapping all asynchronous logic in `step.run()` calls or by removing all `step.*()` calls.",
    otherwise: "For more information on why step functions work in this manner, see https://www.inngest.com/docs/functions/multi-step#gotchas",
    code
  });
};
const baseJsonErrorSchema = objectType({
  name: stringType().trim().optional(),
  error: stringType().trim().optional(),
  message: stringType().trim().optional(),
  stack: stringType().trim().optional()
});
const maybeJsonErrorSchema = lazyType(() => objectType({
  name: stringType().trim(),
  message: stringType().trim(),
  stack: stringType().trim().optional(),
  cause: unionType([maybeJsonErrorSchema, unknownType()]).optional()
}));
const jsonErrorSchema = baseJsonErrorSchema.extend({ cause: unionType([maybeJsonErrorSchema, unknownType()]).optional() }).passthrough().catch({}).transform((val) => {
  return {
    ...val,
    name: val.name || "Error",
    message: val.message || val.error || "Unknown error",
    stack: val.stack
  };
});
let StepOpCode = /* @__PURE__ */ (function(StepOpCode$1) {
  StepOpCode$1["WaitForSignal"] = "WaitForSignal";
  StepOpCode$1["WaitForEvent"] = "WaitForEvent";
  StepOpCode$1["Step"] = "Step";
  StepOpCode$1["StepRun"] = "StepRun";
  StepOpCode$1["StepError"] = "StepError";
  StepOpCode$1["StepFailed"] = "StepFailed";
  StepOpCode$1["StepPlanned"] = "StepPlanned";
  StepOpCode$1["Sleep"] = "Sleep";
  StepOpCode$1["StepNotFound"] = "StepNotFound";
  StepOpCode$1["InvokeFunction"] = "InvokeFunction";
  StepOpCode$1["AiGateway"] = "AIGateway";
  StepOpCode$1["Gateway"] = "Gateway";
  StepOpCode$1["RunComplete"] = "RunComplete";
  StepOpCode$1["DiscoveryRequest"] = "DiscoveryRequest";
  return StepOpCode$1;
})({});
let StepMode = /* @__PURE__ */ (function(StepMode$1) {
  StepMode$1["Sync"] = "sync";
  StepMode$1["Async"] = "async";
  StepMode$1["AsyncCheckpointing"] = "async_checkpointing";
  return StepMode$1;
})({});
let AsyncResponseType = /* @__PURE__ */ (function(AsyncResponseType$1) {
  AsyncResponseType$1["Redirect"] = "redirect";
  AsyncResponseType$1["Token"] = "token";
  return AsyncResponseType$1;
})({});
objectType({
  id: stringType().min(1),
  data: anyType().optional(),
  error: anyType().optional(),
  input: anyType().optional()
});
const sendEventResponseSchema = objectType({
  ids: arrayType(stringType()).default([]),
  status: numberType().default(0),
  error: stringType().optional()
});
const defaultCheckpointingOptions = {
  bufferedSteps: 1,
  maxRuntime: 0,
  maxInterval: 0
};
const logLevels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "silent"
];
const concurrencyOptionSchema = strictObjectType({
  limit: numberType(),
  key: stringType().optional(),
  scope: enumType([
    "fn",
    "env",
    "account"
  ]).optional()
});
const functionConfigSchema = strictObjectType({
  name: stringType().optional(),
  id: stringType(),
  triggers: arrayType(unionType([strictObjectType({
    event: stringType(),
    expression: stringType().optional()
  }), strictObjectType({ cron: stringType() })])),
  steps: recordType(strictObjectType({
    id: stringType(),
    name: stringType(),
    runtime: strictObjectType({
      type: unionType([literalType("http"), literalType("ws")]),
      url: stringType()
    }),
    retries: strictObjectType({ attempts: numberType().optional() }).optional()
  })),
  idempotency: stringType().optional(),
  batchEvents: strictObjectType({
    maxSize: numberType(),
    timeout: stringType(),
    key: stringType().optional(),
    if: stringType().optional()
  }).optional(),
  rateLimit: strictObjectType({
    key: stringType().optional(),
    limit: numberType(),
    period: stringType().transform((x) => x)
  }).optional(),
  throttle: strictObjectType({
    key: stringType().optional(),
    limit: numberType(),
    period: stringType().transform((x) => x),
    burst: numberType().optional()
  }).optional(),
  singleton: strictObjectType({
    key: stringType().optional(),
    mode: enumType(["skip", "cancel"])
  }).optional(),
  cancel: arrayType(strictObjectType({
    event: stringType(),
    if: stringType().optional(),
    timeout: stringType().optional()
  })).optional(),
  debounce: strictObjectType({
    key: stringType().optional(),
    period: stringType().transform((x) => x),
    timeout: stringType().transform((x) => x).optional()
  }).optional(),
  timeouts: strictObjectType({
    start: stringType().transform((x) => x).optional(),
    finish: stringType().transform((x) => x).optional()
  }).optional(),
  priority: strictObjectType({ run: stringType().optional() }).optional(),
  concurrency: unionType([
    numberType(),
    concurrencyOptionSchema.transform((x) => x),
    arrayType(concurrencyOptionSchema.transform((x) => x)).min(1).max(2)
  ]).optional()
});
const ok = (data) => {
  return {
    ok: true,
    value: data
  };
};
const err = (error) => {
  return {
    ok: false,
    error
  };
};
const inBandSyncRequestBodySchema = strictObjectType({ url: stringType() });
const errorSchema = objectType({
  error: stringType(),
  status: numberType()
});
const v0StepSchema = recordType(anyType().refine((v) => typeof v !== "undefined", { message: "Values in steps must be defined" })).optional().nullable();
const v1StepSchema = recordType(objectType({
  type: literalType("data").optional().default("data"),
  data: anyType().refine((v) => typeof v !== "undefined", { message: "Data in steps must be defined" })
}).strict().or(objectType({
  type: literalType("error").optional().default("error"),
  error: jsonErrorSchema
}).strict()).or(objectType({
  type: literalType("input").optional().default("input"),
  input: anyType().refine((v) => typeof v !== "undefined", { message: "If input is present it must not be `undefined`" })
}).strict()).or(anyType().transform((v) => ({
  type: "data",
  data: v
})))).default({});
const v2StepSchema = v1StepSchema;
const stepsSchemas = {
  [ExecutionVersion.V0]: v0StepSchema,
  [ExecutionVersion.V1]: v1StepSchema,
  [ExecutionVersion.V2]: v2StepSchema
};
const batchSchema = arrayType(recordType(anyType()).transform((v) => v));
const PREFERRED_ASYNC_EXECUTION_VERSION = ExecutionVersion.V1;
const PREFERRED_CHECKPOINTING_EXECUTION_VERSION = ExecutionVersion.V2;
var InngestExecution = class {
  debug;
  constructor(options) {
    this.options = options;
    this.debug = debug(`${debugPrefix}:${this.options.runId}`);
  }
};
const cacheFn = (fn) => {
  const key = "value";
  const cache = /* @__PURE__ */ new Map();
  return ((...args) => {
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  });
};
const waterfall = (fns, transform) => {
  return (...args) => {
    return fns.reduce(async (acc, fn) => {
      const prev = await acc;
      const output = await fn(prev);
      if (transform) return await transform(prev, output);
      if (typeof output === "undefined") return prev;
      return output;
    }, Promise.resolve(args[0]));
  };
};
const undefinedToNull = (v) => {
  return typeof v === "undefined" ? null : v;
};
const versionSchema = literalType(-1).or(literalType(0)).or(literalType(1)).or(literalType(2)).optional().transform((v) => {
  if (typeof v === "undefined") {
    console.debug(`No request version specified by executor; defaulting to v${PREFERRED_ASYNC_EXECUTION_VERSION}`);
    return {
      sdkDecided: true,
      version: PREFERRED_ASYNC_EXECUTION_VERSION
    };
  }
  if (v === -1) return {
    sdkDecided: true,
    version: PREFERRED_ASYNC_EXECUTION_VERSION
  };
  return {
    sdkDecided: false,
    version: v
  };
});
const fnDataVersionSchema = objectType({ version: versionSchema });
const parseFnData = (data, headerVersion) => {
  let version2;
  let sdkDecided;
  try {
    if (typeof headerVersion !== "undefined") try {
      const res = versionSchema.parse(headerVersion);
      version2 = res.version;
      sdkDecided = res.sdkDecided;
    } catch {
    }
    if (typeof version2 === "undefined") {
      const parsedVersionData = fnDataVersionSchema.parse(data);
      version2 = parsedVersionData.version.version;
      sdkDecided = parsedVersionData.version.sdkDecided;
    }
    return {
      [ExecutionVersion.V0]: () => ({
        version: ExecutionVersion.V0,
        sdkDecided,
        ...objectType({
          event: recordType(anyType()),
          events: arrayType(recordType(anyType())).default([]),
          steps: stepsSchemas[ExecutionVersion.V0],
          ctx: objectType({
            run_id: stringType(),
            attempt: numberType().default(0),
            stack: objectType({
              stack: arrayType(stringType()).nullable().transform((v) => Array.isArray(v) ? v : []),
              current: numberType()
            }).optional().nullable()
          }).optional().nullable(),
          use_api: booleanType().default(false)
        }).parse(data)
      }),
      [ExecutionVersion.V1]: () => ({
        version: ExecutionVersion.V1,
        sdkDecided,
        ...objectType({
          event: recordType(anyType()),
          events: arrayType(recordType(anyType())).default([]),
          steps: stepsSchemas[ExecutionVersion.V1],
          ctx: objectType({
            run_id: stringType(),
            fn_id: stringType().optional(),
            attempt: numberType().default(0),
            max_attempts: numberType().optional(),
            disable_immediate_execution: booleanType().default(false),
            use_api: booleanType().default(false),
            qi_id: stringType().optional(),
            stack: objectType({
              stack: arrayType(stringType()).nullable().transform((v) => Array.isArray(v) ? v : []),
              current: numberType()
            }).optional().nullable()
          }).optional().nullable()
        }).parse(data)
      }),
      [ExecutionVersion.V2]: () => ({
        version: ExecutionVersion.V2,
        sdkDecided,
        ...objectType({
          event: recordType(anyType()),
          events: arrayType(recordType(anyType())).default([]),
          steps: stepsSchemas[ExecutionVersion.V2],
          ctx: objectType({
            run_id: stringType(),
            fn_id: stringType().optional(),
            attempt: numberType().default(0),
            max_attempts: numberType().optional(),
            disable_immediate_execution: booleanType().default(false),
            use_api: booleanType().default(false),
            qi_id: stringType().optional(),
            stack: objectType({
              stack: arrayType(stringType()).nullable().transform((v) => Array.isArray(v) ? v : []),
              current: numberType()
            }).optional().nullable()
          }).optional().nullable()
        }).parse(data)
      })
    }[version2]();
  } catch (err$1) {
    throw new Error(parseFailureErr(err$1));
  }
};
const fetchAllFnData = async ({ data, api, version: version2 }) => {
  const result = { ...data };
  const shouldFetchData = {
    [ExecutionVersion.V0]: () => result.version === ExecutionVersion.V0 && result.use_api,
    [ExecutionVersion.V1]: () => result.version === ExecutionVersion.V1 && Boolean(result.ctx?.use_api),
    [ExecutionVersion.V2]: () => result.version === ExecutionVersion.V2 && Boolean(result.ctx?.use_api)
  };
  try {
    if (shouldFetchData[result.version]()) {
      if (!result.ctx?.run_id) return err(prettyError({
        whatHappened: "failed to attempt retrieving data from API",
        consequences: "function execution can't continue",
        why: "run_id is missing from context",
        stack: true
      }));
      const [evtResp, stepResp] = await Promise.all([api.getRunBatch(result.ctx.run_id), api.getRunSteps(result.ctx.run_id, version2)]);
      if (evtResp.ok) result.events = evtResp.value;
      else return err(prettyError({
        whatHappened: "failed to retrieve list of events",
        consequences: "function execution can't continue",
        why: evtResp.error?.error,
        stack: true
      }));
      if (stepResp.ok) result.steps = stepResp.value;
      else return err(prettyError({
        whatHappened: "failed to retrieve steps for function run",
        consequences: "function execution can't continue",
        why: stepResp.error?.error,
        stack: true
      }));
    }
    const stepIds = Object.keys(result.steps || {});
    if (stepIds.length && !result.ctx?.stack?.stack?.length) result.ctx = {
      ...result.ctx,
      stack: {
        stack: stepIds,
        current: stepIds.length - 1
      }
    };
    return ok(result);
  } catch (error) {
    console.error(error);
    return err(parseFailureErr(error));
  }
};
const parseFailureErr = (err$1) => {
  let why;
  if (err$1 instanceof ZodError) why = err$1.toString();
  return prettyError({
    whatHappened: "Failed to parse data from executor.",
    consequences: "Function execution can't continue.",
    toFixNow: "Make sure that your API is set up to parse incoming request bodies as JSON, like body-parser for Express (https://expressjs.com/en/resources/middleware/body-parser.html).",
    stack: true,
    why
  });
};
var InngestMiddleware = class InngestMiddleware2 {
  get [Symbol.toStringTag]() {
    return InngestMiddleware2.Tag;
  }
  /**
  * The name of this middleware. Used primarily for debugging and logging
  * purposes.
  */
  name;
  /**
  * This function is used to initialize your middleware and register any hooks
  * you want to use. It will be called once when the SDK is initialized, and
  * should be used to store any state you want to use in other parts of your
  * middleware.
  *
  * It can be synchronous or asynchronous, in which case the client will wait
  * for it to resolve before continuing to initialize the next middleware.
  *
  * Multiple clients could be used in the same application with differing
  * middleware, so do not store state in global variables or assume that your
  * middleware will only be used once.
  *
  * Must return an object detailing the hooks you want to register.
  */
  init;
  constructor({ name, init }) {
    this.name = name;
    this.init = init;
  }
};
(function(_InngestMiddleware) {
  _InngestMiddleware.Tag = "Inngest.Middleware";
})(InngestMiddleware || (InngestMiddleware = {}));
const getHookStack = async (middleware, key, arg, transforms) => {
  const hookDirs = hookDirections[key];
  if (!hookDirs) throw new Error(`No hook directions found for key "${String(key)}". This is likely a bug in the Inngest SDK.`);
  const hooksRegistered = await (await middleware).reduce((acc, mw) => {
    const fn = mw[key];
    if (fn) return [...acc, fn];
    return acc;
  }, []).reduce(async (acc, fn) => {
    return [...await acc, await fn(arg)];
  }, Promise.resolve([]));
  const ret = {};
  for (const hook of hooksRegistered) {
    const hookKeys = Object.keys(hook);
    for (const key$1 of hookKeys) {
      let fns = [hook[key$1]];
      const existingWaterfall = ret[key$1];
      if (existingWaterfall) if (hookDirs[key$1] === "forward") fns = [existingWaterfall, hook[key$1]];
      else fns = [hook[key$1], existingWaterfall];
      const transform = transforms[key$1];
      ret[key$1] = waterfall(fns, transform);
    }
  }
  for (const k of Object.keys(ret)) {
    const key$1 = k;
    if (key$1 === "transformOutput") continue;
    ret[key$1] = cacheFn(ret[key$1]);
  }
  return ret;
};
const hookDirections = {
  onFunctionRun: {
    transformInput: "forward",
    beforeMemoization: "forward",
    afterMemoization: "backward",
    beforeExecution: "forward",
    afterExecution: "backward",
    transformOutput: "backward",
    beforeResponse: "forward",
    finished: "forward"
  },
  onSendEvent: {
    transformInput: "forward",
    transformOutput: "backward"
  }
};
const alsSymbol = /* @__PURE__ */ Symbol.for("inngest:als");
const getAsyncCtx = async () => {
  return getAsyncLocalStorage().then((als) => als.getStore());
};
const getAsyncLocalStorage = async () => {
  globalThis[alsSymbol] ??= new Promise(async (resolve) => {
    try {
      const { AsyncLocalStorage } = await import("node:async_hooks");
      resolve(new AsyncLocalStorage());
    } catch (_err) {
      console.warn("node:async_hooks is not supported in this runtime. Experimental async context is disabled.");
      resolve({
        getStore: () => void 0,
        run: (_, fn) => fn()
      });
    }
  });
  return globalThis[alsSymbol];
};
const isTemporalDuration = (input) => {
  try {
    return input[Symbol.toStringTag] === "Temporal.Duration";
  } catch {
    return false;
  }
};
const isTemporalInstant = (input) => {
  try {
    return input[Symbol.toStringTag] === "Temporal.Instant";
  } catch {
    return false;
  }
};
const isTemporalZonedDateTime = (input) => {
  try {
    return input[Symbol.toStringTag] === "Temporal.ZonedDateTime";
  } catch {
    return false;
  }
};
const getISOString = (time) => {
  if (typeof time === "string") return new Date(time).toISOString();
  if (time instanceof Date) return time.toISOString();
  if (isTemporalZonedDateTime(time)) return time.toInstant().toString();
  if (isTemporalInstant(time)) return time.toString();
  throw new TypeError("Invalid date input");
};
var UnscopedMetadataBuilder = class UnscopedMetadataBuilder2 {
  constructor(client, config = {}) {
    this.client = client;
    this.config = config;
  }
  run(id) {
    return new UnscopedMetadataBuilder2(this.client, {
      ...this.config,
      runId: id ?? null
    });
  }
  step(id, index) {
    return new UnscopedMetadataBuilder2(this.client, {
      ...this.config,
      stepId: id ?? null,
      stepIndex: index ?? 0
    });
  }
  attempt(attempt) {
    return new UnscopedMetadataBuilder2(this.client, {
      ...this.config,
      attempt: attempt ?? null
    });
  }
  span(id) {
    return new UnscopedMetadataBuilder2(this.client, {
      ...this.config,
      spanId: id
    });
  }
  async update(values, kind = "default") {
    await performOp(this.client, this.config, values, `userland.${kind}`, "merge");
  }
  toJSON() {
    return this.config;
  }
};
function buildTarget(config, ctx) {
  const ctxExecution = ctx?.execution;
  const ctxRunId = ctxExecution?.ctx?.runId;
  const ctxStepId = ctxExecution?.executingStep?.id;
  const ctxAttempt = ctxExecution?.ctx?.attempt;
  const targetRunId = config.runId ?? ctxRunId;
  if (!targetRunId) throw new Error("No run context available");
  const isSameRunAsCtx = ctxRunId !== void 0 && targetRunId === ctxRunId;
  const stepCtxReason = !ctxExecution ? "no function execution context is available" : !ctxExecution.executingStep ? "you are not inside a step.run() callback" : "you are targeting a different run";
  if (config.attempt === null && (!isSameRunAsCtx || !ctxExecution?.executingStep)) throw new Error(`attempt() was called without a value, but ${stepCtxReason}`);
  if (config.stepId === null && (!isSameRunAsCtx || !ctxExecution?.executingStep)) throw new Error(`step() was called without a value, but ${stepCtxReason}`);
  if (config.spanId !== void 0) return {
    run_id: targetRunId,
    step_id: config.stepId ?? ctxStepId,
    step_index: config.stepIndex,
    step_attempt: config.attempt ?? ctxAttempt,
    span_id: config.spanId
  };
  else if (config.attempt !== void 0) return {
    run_id: targetRunId,
    step_id: config.stepId ?? ctxStepId,
    step_index: config.stepIndex,
    step_attempt: config.attempt ?? ctxAttempt
  };
  else if (config.stepId !== void 0) return {
    run_id: targetRunId,
    step_id: config.stepId ?? ctxStepId,
    step_index: config.stepIndex
  };
  else if (config.runId !== void 0) return { run_id: targetRunId };
  else if (ctxStepId && ctxAttempt !== void 0) return {
    run_id: targetRunId,
    step_id: ctxStepId,
    step_attempt: ctxAttempt
  };
  else return { run_id: targetRunId };
}
function createMetadataPayload(kind, op, metadata) {
  return [{
    kind,
    op,
    values: metadata
  }];
}
async function sendMetadataViaAPI(client, target, kind, op, metadata, headers) {
  const metadataArray = createMetadataPayload(kind, op, metadata);
  await client["updateMetadata"]({
    target,
    metadata: metadataArray,
    headers
  });
}
function getBatchScope(config) {
  if (config.spanId !== void 0) return "extended_trace";
  if (config.attempt !== void 0) return "step_attempt";
  if (config.stepId !== void 0) return "step";
  if (config.runId !== void 0) return "run";
  return "step_attempt";
}
async function performOp(client, config, values, kind, op) {
  const ctx = await getAsyncCtx();
  const target = buildTarget(config, ctx);
  const isInsideRun = !!ctx?.execution;
  const isInsideStep = !!ctx?.execution?.executingStep;
  if (isInsideRun && !isInsideStep) console.warn("inngest: metadata.update() called outside of a step. This metadata may be lost on retries. Wrap the call in step.run() for durable metadata.");
  const runId = config.runId ?? ctx?.execution?.ctx?.runId;
  const stepId = config.stepId ?? ctx?.execution?.executingStep?.id;
  const attempt = config.attempt ?? ctx?.execution?.ctx?.attempt;
  if (runId === ctx?.execution?.ctx?.runId && stepId === ctx?.execution?.executingStep?.id && attempt === ctx?.execution?.ctx?.attempt && !config.spanId) {
    const executingStep = ctx?.execution?.executingStep;
    const execInstance = ctx?.execution?.instance;
    const scope = getBatchScope(config);
    if (executingStep?.id && execInstance && execInstance.addMetadata(executingStep.id, kind, scope, op, values)) return;
  }
  await sendMetadataViaAPI(client, target, kind, op, values, ctx?.execution?.instance?.options?.headers ?? void 0);
}
const metadataSymbol = /* @__PURE__ */ Symbol.for("inngest.step.metadata");
const shimQueueMicrotask = (callback) => {
  Promise.resolve().then(callback);
};
const resolveAfterPending = (count = 100) => {
  return new Promise((resolve) => {
    let i = 0;
    const iterate = () => {
      shimQueueMicrotask(() => {
        if (i++ > count) return resolve();
        iterate();
      });
    };
    iterate();
  });
};
const createDeferredPromise = () => {
  let resolve;
  let reject;
  return {
    promise: new Promise((_resolve, _reject) => {
      resolve = (value) => {
        _resolve(value);
        return createDeferredPromise();
      };
      reject = (reason) => {
        _reject(reason);
        return createDeferredPromise();
      };
    }),
    resolve,
    reject
  };
};
const createDeferredPromiseWithStack = () => {
  const settledPromises = [];
  let rotateQueue = () => {
  };
  const results = (async function* () {
    while (true) {
      const next = settledPromises.shift();
      if (next) yield next;
      else await new Promise((resolve) => {
        rotateQueue = resolve;
      });
    }
  })();
  const shimDeferredPromise = (deferred) => {
    const originalResolve = deferred.resolve;
    const originalReject = deferred.reject;
    deferred.resolve = (value) => {
      settledPromises.push(deferred.promise);
      rotateQueue();
      return shimDeferredPromise(originalResolve(value));
    };
    deferred.reject = (reason) => {
      settledPromises.push(deferred.promise);
      rotateQueue();
      return shimDeferredPromise(originalReject(reason));
    };
    return deferred;
  };
  return {
    deferred: shimDeferredPromise(createDeferredPromise()),
    results
  };
};
const createTimeoutPromise = (duration) => {
  const { promise, resolve } = createDeferredPromise();
  let timeout;
  let ret;
  const start = () => {
    if (timeout) return ret;
    timeout = setTimeout(() => {
      resolve();
    }, duration);
    return ret;
  };
  const clear = () => {
    clearTimeout(timeout);
    timeout = void 0;
  };
  const reset = () => {
    clear();
    return start();
  };
  ret = Object.assign(promise, {
    start,
    clear,
    reset
  });
  return ret;
};
const runAsPromise = (fn) => {
  return Promise.resolve().then(fn);
};
const resolveNextTick = () => {
  return new Promise((resolve) => setTimeout(resolve));
};
const retryWithBackoff = async (fn, opts) => {
  const maxAttempts = opts?.maxAttempts || 5;
  const baseDelay = opts?.baseDelay ?? 100;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
    return await fn();
  } catch (err2) {
    if (attempt >= maxAttempts) throw err2;
    const jitter = Math.random() * baseDelay;
    const delay = baseDelay * Math.pow(2, attempt - 1) + jitter;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Max retries reached; this should be unreachable.");
};
const goIntervalTiming = async (fn) => {
  const start = Date.now();
  const resultPromise = runAsPromise(fn);
  try {
    await resultPromise;
  } catch {
  }
  const end = Date.now();
  return {
    resultPromise,
    interval: {
      a: start * 1e6,
      b: (end - start) * 1e6
    }
  };
};
var RetryAfterError = class extends Error {
  /**
  * The underlying cause of the error, if any.
  *
  * This will be serialized and sent to Inngest.
  */
  cause;
  /**
  * The time after which the function should be retried. Represents either a
  * number of milliseconds or a RFC3339 date.
  */
  retryAfter;
  constructor(message, retryAfter, options) {
    super(message);
    this.name = "RetryAfterError";
    if (retryAfter instanceof Date) this.retryAfter = retryAfter.toISOString();
    else {
      const seconds = `${Math.ceil((typeof retryAfter === "string" ? ms(retryAfter) : retryAfter) / 1e3)}`;
      if (!isFinite(Number(seconds))) throw new Error("retryAfter must be a number of milliseconds, a ms-compatible string, or a Date");
      this.retryAfter = seconds;
    }
    this.cause = options?.cause;
  }
};
const { sha1: sha1$2 } = hashjs;
const createV0InngestExecution = (options) => {
  return new V0InngestExecution(options);
};
var V0InngestExecution = class extends InngestExecution {
  version = ExecutionVersion.V0;
  state;
  execution;
  userFnToRun;
  fnArg;
  constructor(options) {
    super(options);
    this.userFnToRun = this.getUserFnToRun();
    this.state = this.createExecutionState();
    this.fnArg = this.createFnArg();
  }
  addMetadata(_stepId, _kind, _scope, _op, _values) {
    return false;
  }
  start() {
    this.debug("starting V0 execution");
    return this.execution ??= this._start().then((result) => {
      this.debug("result:", result);
      return result;
    });
  }
  async _start() {
    this.state.hooks = await this.initializeMiddleware();
    try {
      await this.transformInput();
      await this.state.hooks.beforeMemoization?.();
      if (this.state.opStack.length === 0 && !this.options.requestedRunStep) {
        await this.state.hooks.afterMemoization?.();
        await this.state.hooks.beforeExecution?.();
      }
      const userFnPromise = runAsPromise(() => this.userFnToRun(this.fnArg));
      let pos = -1;
      do {
        if (pos >= 0) {
          if (!this.options.requestedRunStep && pos === this.state.opStack.length - 1) {
            await this.state.hooks.afterMemoization?.();
            await this.state.hooks.beforeExecution?.();
          }
          this.state.tickOps = {};
          const incomingOp = this.state.opStack[pos];
          this.state.currentOp = this.state.allFoundOps[incomingOp.id];
          if (!this.state.currentOp)
            throw new NonRetriableError(prettyError({
              whatHappened: " Your function was stopped from running",
              why: "We couldn't resume your function's state because it may have changed since the run started or there are async actions in-between steps that we haven't noticed in previous executions.",
              consequences: "Continuing to run the function may result in unexpected behaviour, so we've stopped your function to ensure nothing unexpected happened!",
              toFixNow: "Ensure that your function is either entirely step-based or entirely non-step-based, by either wrapping all asynchronous logic in `step.run()` calls or by removing all `step.*()` calls.",
              otherwise: "For more information on why step functions work in this manner, see https://www.inngest.com/docs/functions/multi-step#gotchas",
              stack: true,
              code: ErrCode.NON_DETERMINISTIC_FUNCTION
            }));
          this.state.currentOp.fulfilled = true;
          if (typeof incomingOp.data !== "undefined") this.state.currentOp.resolve(incomingOp.data);
          else this.state.currentOp.reject(incomingOp.error);
        }
        await resolveAfterPending();
        this.state.reset();
        pos++;
      } while (pos < this.state.opStack.length);
      await this.state.hooks.afterMemoization?.();
      const discoveredOps = Object.values(this.state.tickOps).map(tickOpToOutgoing);
      const runStep = this.options.requestedRunStep || this.getEarlyExecRunStep(discoveredOps);
      if (runStep) {
        const userFnOp = this.state.allFoundOps[runStep];
        const stepToRun = userFnOp?.fn;
        if (!stepToRun) throw new Error(`Bad stack; executor requesting to run unknown step "${runStep}"`);
        const outgoingUserFnOp = {
          ...tickOpToOutgoing(userFnOp),
          op: StepOpCode.Step
        };
        await this.state.hooks.beforeExecution?.();
        this.state.executingStep = true;
        const { type: _type, ...rest } = await runAsPromise(stepToRun).finally(() => {
          this.state.executingStep = false;
        }).then(async (data) => {
          await this.state.hooks?.afterExecution?.();
          return await this.transformOutput({ data }, outgoingUserFnOp);
        }, async (error) => {
          await this.state.hooks?.afterExecution?.();
          return await this.transformOutput({ error }, outgoingUserFnOp);
        });
        return {
          type: "step-ran",
          ctx: this.fnArg,
          ops: this.ops,
          step: {
            ...outgoingUserFnOp,
            ...rest
          }
        };
      }
      if (!discoveredOps.length) {
        const fnRet = await Promise.race([userFnPromise.then((data) => ({
          type: "complete",
          data
        })), resolveNextTick().then(() => ({ type: "incomplete" }))]);
        if (fnRet.type === "complete") {
          await this.state.hooks.afterExecution?.();
          if (Object.values(this.state.allFoundOps).every((op) => {
            return op.fulfilled;
          })) return await this.transformOutput({ data: fnRet.data });
        } else if (!this.state.hasUsedTools) {
          this.state.nonStepFnDetected = true;
          const data = await userFnPromise;
          await this.state.hooks.afterExecution?.();
          return await this.transformOutput({ data });
        } else if (!Object.values(this.state.allFoundOps).some((op) => {
          return op.fulfilled === false;
        })) throw new NonRetriableError(functionStoppedRunningErr(ErrCode.ASYNC_DETECTED_AFTER_MEMOIZATION));
      }
      await this.state.hooks.afterExecution?.();
      return {
        type: "steps-found",
        ctx: this.fnArg,
        ops: this.ops,
        steps: discoveredOps
      };
    } catch (error) {
      return await this.transformOutput({ error });
    } finally {
      await this.state.hooks.beforeResponse?.();
    }
  }
  async initializeMiddleware() {
    const ctx = this.options.data;
    return await getHookStack(this.options.fn["middleware"], "onFunctionRun", {
      ctx,
      fn: this.options.fn,
      steps: Object.values(this.options.stepState),
      reqArgs: this.options.reqArgs
    }, {
      transformInput: (prev, output) => {
        return {
          ctx: {
            ...prev.ctx,
            ...output?.ctx
          },
          fn: this.options.fn,
          steps: prev.steps.map((step2, i) => ({
            ...step2,
            ...output?.steps?.[i]
          })),
          reqArgs: prev.reqArgs
        };
      },
      transformOutput: (prev, output) => {
        return {
          result: {
            ...prev.result,
            ...output?.result
          },
          step: prev.step
        };
      }
    });
  }
  createExecutionState() {
    const state = {
      allFoundOps: {},
      tickOps: {},
      tickOpHashes: {},
      currentOp: void 0,
      hasUsedTools: false,
      reset: () => {
        state.tickOpHashes = {};
        state.allFoundOps = {
          ...state.allFoundOps,
          ...state.tickOps
        };
      },
      nonStepFnDetected: false,
      executingStep: false,
      opStack: this.options.stepCompletionOrder.reduce((acc, stepId) => {
        const stepState = this.options.stepState[stepId];
        if (!stepState) return acc;
        return [...acc, stepState];
      }, [])
    };
    return state;
  }
  get ops() {
    return Object.fromEntries(Object.entries(this.state.allFoundOps).map(([id, op]) => [id, {
      id: op.id,
      rawArgs: op.rawArgs,
      data: op.data,
      error: op.error,
      fulfilled: op.fulfilled,
      seen: true
    }]));
  }
  getUserFnToRun() {
    if (!this.options.isFailureHandler) return this.options.fn["fn"];
    if (!this.options.fn["onFailureFn"])
      throw new Error("Cannot find function `onFailure` handler");
    return this.options.fn["onFailureFn"];
  }
  createFnArg() {
    this.state.tickOps = this.state.allFoundOps;
    const hashOp2 = (op) => {
      const obj = {
        parent: this.state.currentOp?.id ?? null,
        op: op.op,
        name: op.name,
        opts: op.op === StepOpCode.StepPlanned ? null : op.opts ?? null
      };
      const collisionHash = _internals$2.hashData(obj);
      const pos = this.state.tickOpHashes[collisionHash] = (this.state.tickOpHashes[collisionHash] ?? -1) + 1;
      return {
        ...op,
        id: _internals$2.hashData({
          pos,
          ...obj
        })
      };
    };
    const stepHandler = ({ args, matchOp, opts }) => {
      if (this.state.nonStepFnDetected) throw new NonRetriableError(functionStoppedRunningErr(ErrCode.STEP_USED_AFTER_ASYNC));
      if (this.state.executingStep) throw new NonRetriableError(prettyError({
        whatHappened: "Your function was stopped from running",
        why: "We detected that you have nested `step.*` tooling.",
        consequences: "Nesting `step.*` tooling is not supported.",
        stack: true,
        toFixNow: "Make sure you're not using `step.*` tooling inside of other `step.*` tooling. If you need to compose steps together, you can create a new async function and call it from within your step function, or use promise chaining.",
        otherwise: "For more information on step functions with Inngest, see https://www.inngest.com/docs/functions/multi-step",
        code: ErrCode.NESTING_STEPS
      }));
      this.state.hasUsedTools = true;
      const opId = hashOp2(matchOp(getStepOptions(args[0]), ...args.slice(1)));
      return new Promise((resolve, reject) => {
        this.state.tickOps[opId.id] = {
          ...opId,
          ...opts?.fn ? { fn: () => opts.fn?.(this.fnArg, ...args) } : {},
          rawArgs: args,
          resolve,
          reject,
          fulfilled: false
        };
      });
    };
    const step2 = createStepTools(this.options.client, this, stepHandler);
    let fnArg = {
      ...this.options.data,
      step: step2
    };
    if (this.options.isFailureHandler) {
      const eventData = objectType({ error: jsonErrorSchema }).parse(fnArg.event?.data);
      fnArg = {
        ...fnArg,
        error: deserializeError$1(eventData.error)
      };
    }
    return this.options.transformCtx?.(fnArg) ?? fnArg;
  }
  /**
  * Using middleware, transform input before running.
  */
  async transformInput() {
    const inputMutations = await this.state.hooks?.transformInput?.({
      ctx: { ...this.fnArg },
      steps: Object.values(this.options.stepState),
      fn: this.options.fn,
      reqArgs: this.options.reqArgs
    });
    if (inputMutations?.ctx) this.fnArg = inputMutations.ctx;
    if (inputMutations?.steps) this.state.opStack = [...inputMutations.steps];
  }
  getEarlyExecRunStep(ops) {
    if (ops.length !== 1) return;
    const op = ops[0];
    if (op && op.op === StepOpCode.StepPlanned) return op.id;
  }
  /**
  * Using middleware, transform output before returning.
  */
  async transformOutput(dataOrError, step2) {
    const output = { ...dataOrError };
    if (typeof output.error !== "undefined") output.data = serializeError$1(output.error);
    const transformedOutput = await this.state.hooks?.transformOutput?.({
      result: { ...output },
      step: step2
    });
    const { data, error } = {
      ...output,
      ...transformedOutput?.result
    };
    if (!step2) await this.state.hooks?.finished?.({ result: { ...typeof error !== "undefined" ? { error } : { data } } });
    if (typeof error !== "undefined") {
      let retriable = !(error instanceof NonRetriableError || error?.name === "NonRetriableError");
      if (retriable && (error instanceof RetryAfterError || error?.name === "RetryAfterError")) retriable = error.retryAfter;
      const serializedError = serializeError$1(error);
      return {
        type: "function-rejected",
        ctx: this.fnArg,
        ops: this.ops,
        error: serializedError,
        retriable
      };
    }
    return {
      type: "function-resolved",
      ctx: this.fnArg,
      ops: this.ops,
      data: undefinedToNull(data)
    };
  }
};
const tickOpToOutgoing = (op) => {
  return {
    op: op.op,
    id: op.id,
    name: op.name,
    opts: op.opts
  };
};
const hashData = (op) => {
  return sha1$2().update(canonicalize(op)).digest("hex");
};
const _internals$2 = { hashData };
const clientProcessorMap = /* @__PURE__ */ new WeakMap();
var StepError = class extends Error {
  cause;
  constructor(stepId, err2) {
    const parsedErr = jsonErrorSchema.parse(err2);
    super(parsedErr.message);
    this.stepId = stepId;
    this.name = parsedErr.name;
    this.stepId = stepId;
    this.stack = parsedErr.stack ?? void 0;
    this.cause = parsedErr.cause ? deserializeError$1(parsedErr.cause, true) : void 0;
  }
};
const { sha1: sha1$1 } = hashjs;
const CHECKPOINT_RETRY_OPTIONS$1 = {
  maxAttempts: 5,
  baseDelay: 100
};
const STEP_NOT_FOUND_MAX_FOUND_STEPS$1 = 25;
const createV2InngestExecution = (options) => {
  return new V2InngestExecution(options);
};
var V2InngestExecution = class extends InngestExecution {
  version = ExecutionVersion.V2;
  state;
  fnArg;
  checkpointHandlers;
  timeoutDuration = 1e3 * 10;
  execution;
  userFnToRun;
  /**
  * If we're supposed to run a particular step via `requestedRunStep`, this
  * will be a `Promise` that resolves after no steps have been found for
  * `timeoutDuration` milliseconds.
  *
  * If we're not supposed to run a particular step, this will be `undefined`.
  */
  timeout;
  rootSpanId;
  /**
  * If we're checkpointing and have been given a maximum runtime, this will be
  * a `Promise` that resolves after that duration has elapsed, allowing us to
  * ensure that we end the execution in good time, especially in serverless
  * environments.
  */
  checkpointingMaxRuntimeTimer;
  /**
  * If we're checkpointing and have been given a maximum buffer interval, this
  * will be a `Promise` that resolves after that duration has elapsed, allowing
  * us to periodically checkpoint even if the step buffer hasn't filled.
  */
  checkpointingMaxBufferIntervalTimer;
  constructor(rawOptions) {
    const options = {
      ...rawOptions,
      stepMode: rawOptions.stepMode ?? StepMode.Async
    };
    super(options);
    if (this.options.stepMode === StepMode.Sync) {
      if (!this.options.createResponse) throw new Error("createResponse is required for sync step mode");
    }
    this.userFnToRun = this.getUserFnToRun();
    this.state = this.createExecutionState();
    this.fnArg = this.createFnArg();
    this.checkpointHandlers = this.createCheckpointHandlers();
    this.initializeTimer(this.state);
    this.initializeCheckpointRuntimeTimer(this.state);
    this.debug("created new V2 execution for run;", this.options.requestedRunStep ? `wanting to run step "${this.options.requestedRunStep}"` : "discovering steps");
    this.debug("existing state keys:", Object.keys(this.state.stepState));
  }
  /**
  * Idempotently start the execution of the user's function.
  */
  start() {
    if (!this.execution) {
      this.debug("starting V2 execution");
      const tracer = srcExports.trace.getTracer("inngest", version);
      this.execution = getAsyncLocalStorage().then((als) => {
        return als.run({
          app: this.options.client,
          execution: {
            ctx: this.fnArg,
            instance: this
          }
        }, async () => {
          return tracer.startActiveSpan("inngest.execution", (span) => {
            this.rootSpanId = span.spanContext().spanId;
            clientProcessorMap.get(this.options.client)?.declareStartingSpan({
              span,
              runId: this.options.runId,
              traceparent: this.options.headers[headerKeys.TraceParent],
              tracestate: this.options.headers[headerKeys.TraceState]
            });
            return this._start().then((result) => {
              this.debug("result:", result);
              return result;
            }).finally(() => {
              span.end();
            });
          });
        });
      });
    }
    return this.execution;
  }
  addMetadata(stepId, kind, scope, op, values) {
    if (!this.state.metadata) this.state.metadata = /* @__PURE__ */ new Map();
    const updates = this.state.metadata.get(stepId) ?? [];
    updates.push({
      kind,
      scope,
      op,
      values
    });
    this.state.metadata.set(stepId, updates);
    return true;
  }
  /**
  * Starts execution of the user's function and the core loop.
  */
  async _start() {
    try {
      const allCheckpointHandler = this.getCheckpointHandler("");
      this.state.hooks = await this.initializeMiddleware();
      await this.startExecution();
      let i = 0;
      for await (const checkpoint of this.state.loop) {
        await allCheckpointHandler(checkpoint, i);
        const result = await this.getCheckpointHandler(checkpoint.type)(checkpoint, i++);
        if (result) return result;
      }
    } catch (error) {
      return await this.transformOutput({ error });
    } finally {
      this.state.loop.return();
      await this.state.hooks?.beforeResponse?.();
    }
    throw new Error("Core loop finished without returning a value");
  }
  async checkpoint(steps) {
    if (this.options.stepMode === StepMode.Sync) if (!this.state.checkpointedRun) {
      const res = await retryWithBackoff(() => this.options.client["inngestApi"].checkpointNewRun({
        runId: this.fnArg.runId,
        event: this.fnArg.event,
        steps,
        executionVersion: this.version,
        retries: this.fnArg.maxAttempts ?? defaultMaxRetries
      }), CHECKPOINT_RETRY_OPTIONS$1);
      this.state.checkpointedRun = {
        appId: res.data.app_id,
        fnId: res.data.fn_id,
        token: res.data.token
      };
    } else await retryWithBackoff(() => this.options.client["inngestApi"].checkpointSteps({
      appId: this.state.checkpointedRun.appId,
      fnId: this.state.checkpointedRun.fnId,
      runId: this.fnArg.runId,
      steps
    }), CHECKPOINT_RETRY_OPTIONS$1);
    else if (this.options.stepMode === StepMode.AsyncCheckpointing) {
      if (!this.options.queueItemId) throw new Error("Missing queueItemId for async checkpointing. This is a bug in the Inngest SDK.");
      if (!this.options.internalFnId) throw new Error("Missing internalFnId for async checkpointing. This is a bug in the Inngest SDK.");
      await retryWithBackoff(() => this.options.client["inngestApi"].checkpointStepsAsync({
        runId: this.fnArg.runId,
        fnId: this.options.internalFnId,
        queueItemId: this.options.queueItemId,
        steps
      }), CHECKPOINT_RETRY_OPTIONS$1);
    } else throw new Error("Checkpointing is only supported in Sync and AsyncCheckpointing step modes. This is a bug in the Inngest SDK.");
  }
  async checkpointAndSwitchToAsync(steps) {
    await this.checkpoint(steps);
    if (!this.state.checkpointedRun?.token) throw new Error("Failed to checkpoint and switch to async mode");
    return {
      type: "change-mode",
      ctx: this.fnArg,
      ops: this.ops,
      to: StepMode.Async,
      token: this.state.checkpointedRun?.token
    };
  }
  /**
  * Returns whether we're in the final attempt of execution, or `null` if we
  * can't determine this in the SDK.
  */
  inFinalAttempt() {
    if (typeof this.fnArg.maxAttempts !== "number") return null;
    return this.fnArg.attempt + 1 >= this.fnArg.maxAttempts;
  }
  /**
  * Creates a handler for every checkpoint type, defining what to do when we
  * reach that checkpoint in the core loop.
  */
  createCheckpointHandlers() {
    const commonCheckpointHandler = (checkpoint) => {
      this.debug(`${this.options.stepMode} checkpoint:`, checkpoint);
    };
    const stepRanHandler = async (stepResult) => {
      const transformResult = await this.transformOutput(stepResult);
      if (transformResult.type === "function-resolved") return {
        type: "step-ran",
        ctx: transformResult.ctx,
        ops: transformResult.ops,
        step: {
          ...stepResult,
          data: transformResult.data
        }
      };
      else if (transformResult.type === "function-rejected") {
        const stepForResponse = {
          ...stepResult,
          error: transformResult.error
        };
        if (stepResult.op === StepOpCode.StepFailed) {
          const ser = serializeError$1(transformResult.error);
          stepForResponse.data = {
            __serialized: true,
            name: ser.name,
            message: ser.message,
            stack: ""
          };
        }
        return {
          type: "step-ran",
          ctx: transformResult.ctx,
          ops: transformResult.ops,
          retriable: transformResult.retriable,
          step: stepForResponse
        };
      }
      return transformResult;
    };
    const maybeReturnNewSteps = async (steps) => {
      const newSteps = await this.filterNewSteps(Array.from(steps.values()));
      if (newSteps) return {
        type: "steps-found",
        ctx: this.fnArg,
        ops: this.ops,
        steps: newSteps
      };
    };
    const attemptCheckpointAndResume = async (stepResult, resume = true, force = false) => {
      if (stepResult) {
        const stepToResume = this.resumeStepWithResult(stepResult, resume);
        delete this.state.executingStep;
        const transformedData = (await this.state.hooks?.transformOutput?.({
          result: { data: stepResult.data },
          step: stepResult
        }))?.result?.data ?? stepResult.data;
        this.state.checkpointingStepBuffer.push({
          ...stepToResume,
          data: transformedData
        });
      }
      if (force || !this.options.checkpointingConfig?.bufferedSteps || this.state.checkpointingStepBuffer.length >= this.options.checkpointingConfig.bufferedSteps) {
        this.debug("checkpointing and resuming execution after step run");
        try {
          this.debug(`checkpointing all buffered steps:`, this.state.checkpointingStepBuffer.map((op) => op.displayName || op.id).join(", "));
          await this.checkpoint(this.state.checkpointingStepBuffer);
          return;
        } catch (err2) {
          this.debug("error checkpointing after step run, so falling back to async", err2);
          const buffered = this.state.checkpointingStepBuffer;
          if (buffered.length) return {
            type: "steps-found",
            ctx: this.fnArg,
            ops: this.ops,
            steps: buffered
          };
          return;
        } finally {
          this.state.checkpointingStepBuffer = [];
        }
      } else this.debug(`not checkpointing yet, continuing execution as we haven't reached buffered step limit of ${this.options.checkpointingConfig?.bufferedSteps}`);
    };
    const syncHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async (checkpoint, i) => {
        const transformedData = (await this.state.hooks?.transformOutput?.({
          result: { data: checkpoint.data },
          step: this.state.executingStep
        }))?.result?.data ?? checkpoint.data;
        await this.checkpoint([{
          op: StepOpCode.RunComplete,
          id: _internals$1.hashId("complete"),
          data: await this.options.createResponse(transformedData)
        }]);
        return await this.transformOutput({ data: checkpoint.data });
      },
      "function-rejected": async (checkpoint) => {
        if (this.inFinalAttempt()) return await this.transformOutput({ error: checkpoint.error });
        return this.checkpointAndSwitchToAsync([{
          id: _internals$1.hashId("complete"),
          op: StepOpCode.StepError,
          error: checkpoint.error
        }]);
      },
      "step-not-found": () => {
        return {
          type: "function-rejected",
          ctx: this.fnArg,
          error: /* @__PURE__ */ new Error("Step not found when checkpointing; this should never happen"),
          ops: this.ops,
          retriable: false
        };
      },
      "steps-found": async ({ steps }) => {
        if (steps.length !== 1 || steps[0].mode !== StepMode.Sync) return this.checkpointAndSwitchToAsync(steps.map((step2) => ({
          ...step2,
          id: step2.hashedId
        })));
        const result = await this.executeStep(steps[0]);
        const transformed = await stepRanHandler(result);
        if (transformed.type !== "step-ran") throw new Error("Unexpected checkpoint handler result type after running step in sync mode");
        if (result.error) return this.checkpointAndSwitchToAsync([transformed.step]);
        const stepForCheckpoint = {
          ...this.resumeStepWithResult(result),
          data: transformed.step.data
        };
        await this.checkpoint([stepForCheckpoint]);
      },
      "checkpointing-runtime-reached": () => {
        return this.checkpointAndSwitchToAsync([{
          op: StepOpCode.DiscoveryRequest,
          id: _internals$1.hashId("discovery-request")
        }]);
      },
      "checkpointing-buffer-interval-reached": () => {
        return attemptCheckpointAndResume(void 0, false, true);
      }
    };
    const asyncHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async ({ data }) => {
        if (this.options.createResponse) data = await this.options.createResponse(data);
        return await this.transformOutput({ data });
      },
      "function-rejected": async (checkpoint) => {
        return await this.transformOutput({ error: checkpoint.error });
      },
      "steps-found": async ({ steps }) => {
        const stepResult = await this.tryExecuteStep(steps);
        if (stepResult) return stepRanHandler(stepResult);
        return maybeReturnNewSteps(steps);
      },
      "step-not-found": ({ step: step2, foundSteps, totalFoundSteps }) => {
        return {
          type: "step-not-found",
          ctx: this.fnArg,
          ops: this.ops,
          step: step2,
          foundSteps,
          totalFoundSteps
        };
      },
      "checkpointing-runtime-reached": () => {
        throw new Error("Checkpointing maximum runtime reached, but this is not in a checkpointing step mode. This is a bug in the Inngest SDK.");
      },
      "checkpointing-buffer-interval-reached": () => {
        throw new Error("Checkpointing maximum buffer interval reached, but this is not in a checkpointing step mode. This is a bug in the Inngest SDK.");
      }
    };
    const asyncCheckpointingHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async (checkpoint, i) => {
        const output = await asyncHandlers["function-resolved"](checkpoint, i);
        if (output?.type === "function-resolved") {
          const steps = this.state.checkpointingStepBuffer.concat({
            op: StepOpCode.RunComplete,
            id: _internals$1.hashId("complete"),
            data: output.data
          });
          return {
            type: "steps-found",
            ctx: output.ctx,
            ops: output.ops,
            steps
          };
        }
      },
      "function-rejected": async (checkpoint) => {
        if (this.state.checkpointingStepBuffer.length) {
          const fallback = await attemptCheckpointAndResume(void 0, false, true);
          if (fallback) return fallback;
        }
        return await this.transformOutput({ error: checkpoint.error });
      },
      "step-not-found": asyncHandlers["step-not-found"],
      "steps-found": async ({ steps }) => {
        const { stepsToResume, newSteps } = steps.reduce((acc, step2) => {
          if (!step2.hasStepState) acc.newSteps.push(step2);
          else if (!step2.fulfilled) acc.stepsToResume.push(step2);
          return acc;
        }, {
          stepsToResume: [],
          newSteps: []
        });
        this.debug("split found steps in to:", {
          stepsToResume: stepsToResume.length,
          newSteps: newSteps.length
        });
        if (!this.options.requestedRunStep && newSteps.length) {
          if (this.state.checkpointingRuntimeExceeded) {
            if (this.state.checkpointingStepBuffer.length) {
              const fallback = await attemptCheckpointAndResume(void 0, false, true);
              if (fallback) return fallback;
            }
            return maybeReturnNewSteps(steps);
          }
          const stepResult = await this.tryExecuteStep(newSteps);
          if (stepResult) {
            this.debug(`executed step "${stepResult.id}" successfully`);
            if (stepResult.error) {
              if (this.state.checkpointingStepBuffer.length) {
                const fallback = await attemptCheckpointAndResume(void 0, false, true);
                if (fallback) return fallback;
              }
              return stepRanHandler(stepResult);
            }
            return await attemptCheckpointAndResume(stepResult);
          }
          if (this.state.checkpointingStepBuffer.length) {
            const fallback = await attemptCheckpointAndResume(void 0, false, true);
            if (fallback) return fallback;
          }
          return maybeReturnNewSteps(steps);
        }
        if (stepsToResume.length) {
          this.debug(`resuming ${stepsToResume.length} steps`);
          for (const st of stepsToResume) this.resumeStepWithResult({
            ...st,
            id: st.hashedId
          });
        }
      },
      "checkpointing-runtime-reached": async () => {
        this.state.checkpointingRuntimeExceeded = true;
      },
      "checkpointing-buffer-interval-reached": () => {
        return attemptCheckpointAndResume(void 0, false, true);
      }
    };
    return {
      [StepMode.Async]: asyncHandlers,
      [StepMode.Sync]: syncHandlers,
      [StepMode.AsyncCheckpointing]: asyncCheckpointingHandlers
    };
  }
  getCheckpointHandler(type) {
    return this.checkpointHandlers[this.options.stepMode][type];
  }
  async tryExecuteStep(steps) {
    const hashedStepIdToRun = this.options.requestedRunStep || this.getEarlyExecRunStep(steps);
    if (!hashedStepIdToRun) return;
    const step2 = steps.find((step$1) => step$1.hashedId === hashedStepIdToRun && step$1.fn);
    if (step2) return await this.executeStep(step2);
    this.timeout?.reset();
  }
  /**
  * Given a list of outgoing ops, decide if we can execute an op early and
  * return the ID of the step to execute if we can.
  */
  getEarlyExecRunStep(steps) {
    if (this.options.disableImmediateExecution) return;
    const unfulfilledSteps = steps.filter((step2) => !step2.fulfilled);
    if (unfulfilledSteps.length !== 1) return;
    const op = unfulfilledSteps[0];
    if (op && op.op === StepOpCode.StepPlanned) return op.hashedId;
  }
  async filterNewSteps(foundSteps) {
    if (this.options.requestedRunStep) return;
    const newSteps = foundSteps.reduce((acc, step2) => {
      if (!step2.hasStepState) acc.push(step2);
      return acc;
    }, []);
    if (!newSteps.length) return;
    await this.state.hooks?.afterMemoization?.();
    await this.state.hooks?.beforeExecution?.();
    await this.state.hooks?.afterExecution?.();
    const stepList = newSteps.map((step2) => ({
      displayName: step2.displayName,
      op: step2.op,
      id: step2.hashedId,
      name: step2.name,
      opts: step2.opts,
      userland: step2.userland
    }));
    return await this.transformNewSteps(stepList);
  }
  /**
  * Using middleware, transform any newly-found steps before returning them to
  * an Inngest Server.
  */
  async transformNewSteps(steps) {
    return Promise.all(steps.map(async (step2) => {
      if (step2.op !== StepOpCode.InvokeFunction) return step2;
      const transformedPayload = await (await getHookStack(this.options.fn["middleware"], "onSendEvent", void 0, {
        transformInput: (prev, output) => {
          return {
            ...prev,
            ...output
          };
        },
        transformOutput: (prev, output) => {
          return { result: {
            ...prev.result,
            ...output?.result
          } };
        }
      })).transformInput?.({ payloads: [{
        ...step2.opts?.payload ?? {},
        name: internalEvents.FunctionInvoked
      }] });
      const newPayload = invokePayloadSchema.parse(transformedPayload?.payloads?.[0] ?? {});
      return {
        ...step2,
        opts: {
          ...step2.opts,
          payload: {
            ...step2.opts?.payload ?? {},
            ...newPayload
          }
        }
      };
    }));
  }
  async executeStep({ id, name, opts, fn, displayName, userland, hashedId }) {
    this.debug(`preparing to execute step "${id}"`);
    this.timeout?.clear();
    await this.state.hooks?.afterMemoization?.();
    await this.state.hooks?.beforeExecution?.();
    const outgoingOp = {
      id: hashedId,
      op: StepOpCode.StepRun,
      name,
      opts,
      displayName,
      userland
    };
    this.state.executingStep = outgoingOp;
    const store = await getAsyncCtx();
    if (store?.execution) store.execution.executingStep = {
      id,
      name: displayName
    };
    this.debug(`executing step "${id}"`);
    if (this.rootSpanId && this.options.checkpointingConfig) clientProcessorMap.get(this.options.client)?.declareStepExecution(this.rootSpanId, hashedId, this.options.data?.attempt ?? 0);
    let interval;
    return goIntervalTiming(() => runAsPromise(fn)).finally(async () => {
      this.debug(`finished executing step "${id}"`);
      if (this.rootSpanId && this.options.checkpointingConfig) clientProcessorMap.get(this.options.client)?.clearStepExecution(this.rootSpanId);
      if (store?.execution) delete store.execution.executingStep;
      await this.state.hooks?.afterExecution?.();
    }).then(async ({ resultPromise, interval: _interval }) => {
      interval = _interval;
      const metadata = this.state.metadata?.get(id);
      return {
        ...outgoingOp,
        data: await resultPromise,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
    }).catch((error) => {
      let errorIsRetriable = true;
      if (error instanceof NonRetriableError || error?.name === "NonRetriableError") errorIsRetriable = false;
      else if (this.fnArg.maxAttempts && this.fnArg?.maxAttempts - 1 === this.fnArg.attempt) errorIsRetriable = false;
      const metadata = this.state.metadata?.get(id);
      const serialized = serializeError$1(error);
      if (errorIsRetriable) return {
        ...outgoingOp,
        op: StepOpCode.StepError,
        error: serialized,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
      else return {
        ...outgoingOp,
        op: StepOpCode.StepFailed,
        error: serialized,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
    }).then((op) => ({
      ...op,
      timing: interval
    }));
  }
  /**
  * Starts execution of the user's function, including triggering checkpoints
  * and middleware hooks where appropriate.
  */
  async startExecution() {
    await this.transformInput();
    this.timeout?.start();
    this.checkpointingMaxRuntimeTimer?.start();
    this.checkpointingMaxBufferIntervalTimer?.start();
    await this.state.hooks?.beforeMemoization?.();
    if (this.state.allStateUsed()) {
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
    }
    runAsPromise(() => this.userFnToRun(this.fnArg)).finally(async () => {
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
      await this.state.hooks?.afterExecution?.();
    }).then((data) => {
      this.state.setCheckpoint({
        type: "function-resolved",
        data
      });
    }).catch((error) => {
      this.state.setCheckpoint({
        type: "function-rejected",
        error
      });
    });
  }
  /**
  * Using middleware, transform input before running.
  */
  async transformInput() {
    const inputMutations = await this.state.hooks?.transformInput?.({
      ctx: { ...this.fnArg },
      steps: Object.values(this.state.stepState),
      fn: this.options.fn,
      reqArgs: this.options.reqArgs
    });
    if (inputMutations?.ctx) this.fnArg = inputMutations.ctx;
    if (inputMutations?.steps) this.state.stepState = Object.fromEntries(inputMutations.steps.map((step2) => [step2.id, step2]));
  }
  /**
  * Using middleware, transform output before returning.
  */
  async transformOutput(dataOrError) {
    const output = { ...dataOrError };
    const step2 = this.state.executingStep;
    delete this.state.executingStep;
    const isStepExecution = Boolean(step2);
    const transformedOutput = await this.state.hooks?.transformOutput?.({
      result: { ...output },
      step: step2
    });
    const { data, error } = {
      ...output,
      ...transformedOutput?.result
    };
    if (!isStepExecution) await this.state.hooks?.finished?.({ result: { ...typeof error !== "undefined" ? { error } : { data } } });
    if (typeof error !== "undefined") {
      let retriable = !(error instanceof NonRetriableError || error?.name === "NonRetriableError" || error instanceof StepError && error === this.state.recentlyRejectedStepError);
      if (retriable && (error instanceof RetryAfterError || error?.name === "RetryAfterError")) retriable = error.retryAfter;
      const serializedError = minifyPrettyError(serializeError$1(error));
      return {
        type: "function-rejected",
        ctx: this.fnArg,
        ops: this.ops,
        error: serializedError,
        retriable
      };
    }
    return {
      type: "function-resolved",
      ctx: this.fnArg,
      ops: this.ops,
      data: undefinedToNull(data)
    };
  }
  createExecutionState() {
    const d = createDeferredPromiseWithStack();
    let checkpointResolve = d.deferred.resolve;
    const checkpointResults = d.results;
    const loop = (async function* (cleanUp) {
      try {
        while (true) {
          const res = (await checkpointResults.next()).value;
          if (res) yield res;
        }
      } finally {
        cleanUp?.();
      }
    })(() => {
      this.timeout?.clear();
      this.checkpointingMaxRuntimeTimer?.clear();
      this.checkpointingMaxBufferIntervalTimer?.clear();
      checkpointResults.return();
    });
    const stepsToFulfill = Object.keys(this.options.stepState).length;
    return {
      stepState: this.options.stepState,
      stepsToFulfill,
      steps: /* @__PURE__ */ new Map(),
      loop,
      hasSteps: Boolean(stepsToFulfill),
      stepCompletionOrder: [...this.options.stepCompletionOrder],
      remainingStepsToBeSeen: new Set(this.options.stepCompletionOrder),
      setCheckpoint: (checkpoint) => {
        this.debug("setting checkpoint:", checkpoint.type);
        ({ resolve: checkpointResolve } = checkpointResolve(checkpoint));
      },
      allStateUsed: () => {
        return this.state.remainingStepsToBeSeen.size === 0;
      },
      checkpointingStepBuffer: [],
      metadata: /* @__PURE__ */ new Map()
    };
  }
  get ops() {
    return Object.fromEntries(this.state.steps);
  }
  createFnArg() {
    const step2 = this.createStepTools();
    let fnArg = {
      ...this.options.data,
      step: step2
    };
    if (this.options.isFailureHandler) {
      const eventData = objectType({ error: jsonErrorSchema }).parse(fnArg.event?.data);
      fnArg = {
        ...fnArg,
        error: deserializeError$1(eventData.error)
      };
    }
    return this.options.transformCtx?.(fnArg) ?? fnArg;
  }
  createStepTools() {
    const foundStepsToReport = /* @__PURE__ */ new Map();
    const unhandledFoundStepsToReport = /* @__PURE__ */ new Map();
    const expectedNextStepIndexes = /* @__PURE__ */ new Map();
    let foundStepsReportPromise;
    let beforeExecHooksPromise;
    const reportNextTick = () => {
      if (foundStepsReportPromise) return;
      foundStepsReportPromise = resolveAfterPending().then(() => beforeExecHooksPromise).then(() => {
        foundStepsReportPromise = void 0;
        for (const [hashedId, step2] of unhandledFoundStepsToReport) if ((this.options.stepMode === StepMode.Async || step2.hasStepState) && step2.handle()) {
          unhandledFoundStepsToReport.delete(hashedId);
          if (step2.fulfilled) foundStepsToReport.delete(step2.id);
        }
        if (foundStepsToReport.size) {
          const steps = [...foundStepsToReport.values()];
          foundStepsToReport.clear();
          unhandledFoundStepsToReport.clear();
          this.state.setCheckpoint({
            type: "steps-found",
            steps
          });
          return;
        }
      });
    };
    const pushStepToReport = (step2) => {
      foundStepsToReport.set(step2.hashedId, step2);
      unhandledFoundStepsToReport.set(step2.hashedId, step2);
      reportNextTick();
    };
    const stepHandler = async ({ args, matchOp, opts }) => {
      await beforeExecHooksPromise;
      const opId = matchOp(getStepOptions(args[0]), ...args.slice(1));
      if (this.state.executingStep)
        this.options.client["warnMetadata"]({ run_id: this.fnArg.runId }, ErrCode.NESTING_STEPS, prettyError({
          whatHappened: `We detected that you have nested \`step.*\` tooling in \`${opId.displayName ?? opId.id}\``,
          consequences: "Nesting `step.*` tooling is not supported.",
          type: "warn",
          reassurance: "It's possible to see this warning if steps are separated by regular asynchronous calls, which is fine.",
          stack: true,
          toFixNow: "Make sure you're not using `step.*` tooling inside of other `step.*` tooling. If you need to compose steps together, you can create a new async function and call it from within your step function, or use promise chaining.",
          code: ErrCode.NESTING_STEPS
        }));
      if (this.state.steps.has(_internals$1.hashId(opId.id))) {
        const originalId = opId.id;
        const expectedNextIndex = expectedNextStepIndexes.get(originalId) ?? 1;
        for (let i = expectedNextIndex; ; i++) {
          const newId = originalId + STEP_INDEXING_SUFFIX + i;
          if (!this.state.steps.has(_internals$1.hashId(newId))) {
            expectedNextStepIndexes.set(originalId, i + 1);
            opId.id = newId;
            opId.userland.index = i;
            break;
          }
        }
      }
      const { promise, resolve, reject } = createDeferredPromise();
      const hashedId = _internals$1.hashId(opId.id);
      const stepState = this.state.stepState[hashedId];
      let isFulfilled = false;
      if (stepState) {
        stepState.seen = true;
        this.state.remainingStepsToBeSeen.delete(hashedId);
        if (typeof stepState.input === "undefined") isFulfilled = true;
      }
      let extraOpts;
      let fnArgs = [...args];
      if (typeof stepState?.input !== "undefined" && Array.isArray(stepState.input)) switch (opId.op) {
        case StepOpCode.StepPlanned:
          fnArgs = [...args.slice(0, 2), ...stepState.input];
          extraOpts = { input: [...stepState.input] };
          break;
        case StepOpCode.AiGateway:
          extraOpts = { body: {
            ...typeof opId.opts?.body === "object" ? { ...opId.opts.body } : {},
            ...stepState.input[0]
          } };
          break;
      }
      const step2 = {
        ...opId,
        opts: {
          ...opId.opts,
          ...extraOpts
        },
        rawArgs: fnArgs,
        hashedId,
        input: stepState?.input,
        fn: opts?.fn ? () => opts.fn?.(this.fnArg, ...fnArgs) : void 0,
        promise,
        fulfilled: isFulfilled,
        hasStepState: Boolean(stepState),
        displayName: opId.displayName ?? opId.id,
        handled: false,
        handle: () => {
          if (step2.handled) return false;
          this.debug(`handling step "${hashedId}"`);
          step2.handled = true;
          const result = this.state.stepState[hashedId];
          if (step2.fulfilled && result) {
            result.fulfilled = true;
            Promise.all([
              result.data,
              result.error,
              result.input
            ]).then(() => {
              if (typeof result.data !== "undefined") resolve(result.data);
              else {
                this.state.recentlyRejectedStepError = new StepError(opId.id, result.error);
                reject(this.state.recentlyRejectedStepError);
              }
            });
          }
          return true;
        }
      };
      this.state.steps.set(hashedId, step2);
      this.state.hasSteps = true;
      pushStepToReport(step2);
      if (!beforeExecHooksPromise && this.state.allStateUsed()) await (beforeExecHooksPromise = (async () => {
        await this.state.hooks?.afterMemoization?.();
        await this.state.hooks?.beforeExecution?.();
      })());
      return promise;
    };
    return createStepTools(this.options.client, this, stepHandler);
  }
  resumeStepWithResult(resultOp, resume = true) {
    const userlandStep = this.state.steps.get(resultOp.id);
    if (!userlandStep) throw new Error("Step not found in memoization state during async checkpointing; this should never happen and is a bug in the Inngest SDK");
    userlandStep.data = undefinedToNull(resultOp.data);
    userlandStep.timing = resultOp.timing;
    userlandStep.op = resultOp.op;
    userlandStep.id = resultOp.id;
    userlandStep.hasStepState = true;
    if (resume) {
      userlandStep.fulfilled = true;
      this.state.stepState[resultOp.id] = userlandStep;
      userlandStep.handle();
    }
    return userlandStep;
  }
  getUserFnToRun() {
    if (!this.options.isFailureHandler) return this.options.fn["fn"];
    if (!this.options.fn["onFailureFn"])
      throw new Error("Cannot find function `onFailure` handler");
    return this.options.fn["onFailureFn"];
  }
  initializeTimer(state) {
    if (!this.options.requestedRunStep) return;
    this.timeout = createTimeoutPromise(this.timeoutDuration);
    this.timeout.then(async () => {
      const { foundSteps, totalFoundSteps } = this.getStepNotFoundDetails();
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
      await this.state.hooks?.afterExecution?.();
      state.setCheckpoint({
        type: "step-not-found",
        step: {
          id: this.options.requestedRunStep,
          op: StepOpCode.StepNotFound
        },
        foundSteps,
        totalFoundSteps
      });
    });
  }
  getStepNotFoundDetails() {
    const foundSteps = [...this.state.steps.values()].filter((step2) => !step2.hasStepState).map((step2) => ({
      id: step2.hashedId,
      name: step2.name,
      displayName: step2.displayName
    })).sort((a, b) => a.id.localeCompare(b.id));
    return {
      foundSteps: foundSteps.slice(0, STEP_NOT_FOUND_MAX_FOUND_STEPS$1),
      totalFoundSteps: foundSteps.length
    };
  }
  initializeCheckpointRuntimeTimer(state) {
    this.debug("initializing checkpointing runtime timers", this.options.checkpointingConfig);
    if (this.options.checkpointingConfig?.maxRuntime) {
      const maxRuntimeMs = isTemporalDuration(this.options.checkpointingConfig.maxRuntime) ? this.options.checkpointingConfig.maxRuntime.total({ unit: "milliseconds" }) : typeof this.options.checkpointingConfig.maxRuntime === "string" ? ms(this.options.checkpointingConfig.maxRuntime) : this.options.checkpointingConfig.maxRuntime;
      if (Number.isFinite(maxRuntimeMs) && maxRuntimeMs > 0) {
        this.checkpointingMaxRuntimeTimer = createTimeoutPromise(maxRuntimeMs);
        this.checkpointingMaxRuntimeTimer.then(async () => {
          await this.state.hooks?.afterMemoization?.();
          await this.state.hooks?.beforeExecution?.();
          await this.state.hooks?.afterExecution?.();
          state.setCheckpoint({ type: "checkpointing-runtime-reached" });
        });
      }
    }
    if (this.options.checkpointingConfig?.maxInterval) {
      const maxIntervalMs = isTemporalDuration(this.options.checkpointingConfig.maxInterval) ? this.options.checkpointingConfig.maxInterval.total({ unit: "milliseconds" }) : typeof this.options.checkpointingConfig.maxInterval === "string" ? ms(this.options.checkpointingConfig.maxInterval) : this.options.checkpointingConfig.maxInterval;
      if (Number.isFinite(maxIntervalMs) && maxIntervalMs > 0) {
        this.checkpointingMaxBufferIntervalTimer = createTimeoutPromise(maxIntervalMs);
        this.checkpointingMaxBufferIntervalTimer.then(async () => {
          state.setCheckpoint({ type: "checkpointing-buffer-interval-reached" });
          this.checkpointingMaxBufferIntervalTimer?.reset();
        });
      }
    }
  }
  async initializeMiddleware() {
    const ctx = this.options.data;
    return await getHookStack(this.options.fn["middleware"], "onFunctionRun", {
      ctx,
      fn: this.options.fn,
      steps: Object.values(this.options.stepState),
      reqArgs: this.options.reqArgs
    }, {
      transformInput: (prev, output) => {
        return {
          ctx: {
            ...prev.ctx,
            ...output?.ctx
          },
          fn: this.options.fn,
          steps: prev.steps.map((step2, i) => ({
            ...step2,
            ...output?.steps?.[i]
          })),
          reqArgs: prev.reqArgs
        };
      },
      transformOutput: (prev, output) => {
        return {
          result: {
            ...prev.result,
            ...output?.result
          },
          step: prev.step
        };
      }
    });
  }
};
const hashId$1 = (id) => {
  return sha1$1().update(id).digest("hex");
};
const hashOp$1 = (op) => {
  return {
    ...op,
    id: hashId$1(op.id)
  };
};
const _internals$1 = {
  hashOp: hashOp$1,
  hashId: hashId$1
};
const { sha1 } = hashjs;
const CHECKPOINT_RETRY_OPTIONS = {
  maxAttempts: 5,
  baseDelay: 100
};
const STEP_NOT_FOUND_MAX_FOUND_STEPS = 25;
const createV1InngestExecution = (options) => {
  return new V1InngestExecution(options);
};
var V1InngestExecution = class extends InngestExecution {
  version = ExecutionVersion.V1;
  state;
  fnArg;
  checkpointHandlers;
  timeoutDuration = 1e3 * 10;
  execution;
  userFnToRun;
  /**
  * If we're supposed to run a particular step via `requestedRunStep`, this
  * will be a `Promise` that resolves after no steps have been found for
  * `timeoutDuration` milliseconds.
  *
  * If we're not supposed to run a particular step, this will be `undefined`.
  */
  timeout;
  rootSpanId;
  /**
  * If we're checkpointing and have been given a maximum runtime, this will be
  * a `Promise` that resolves after that duration has elapsed, allowing us to
  * ensure that we end the execution in good time, especially in serverless
  * environments.
  */
  checkpointingMaxRuntimeTimer;
  /**
  * If we're checkpointing and have been given a maximum buffer interval, this
  * will be a `Promise` that resolves after that duration has elapsed, allowing
  * us to periodically checkpoint even if the step buffer hasn't filled.
  */
  checkpointingMaxBufferIntervalTimer;
  constructor(rawOptions) {
    const options = {
      ...rawOptions,
      stepMode: rawOptions.stepMode ?? StepMode.Async
    };
    super(options);
    if (this.options.stepMode === StepMode.Sync) {
      if (!this.options.createResponse) throw new Error("createResponse is required for sync step mode");
    }
    this.userFnToRun = this.getUserFnToRun();
    this.state = this.createExecutionState();
    this.fnArg = this.createFnArg();
    this.checkpointHandlers = this.createCheckpointHandlers();
    this.initializeTimer(this.state);
    this.initializeCheckpointRuntimeTimer(this.state);
    this.debug("created new V1 execution for run;", this.options.requestedRunStep ? `wanting to run step "${this.options.requestedRunStep}"` : "discovering steps");
    this.debug("existing state keys:", Object.keys(this.state.stepState));
  }
  /**
  * Idempotently start the execution of the user's function.
  */
  start() {
    if (!this.execution) {
      this.debug("starting V1 execution");
      const tracer = srcExports.trace.getTracer("inngest", version);
      this.execution = getAsyncLocalStorage().then((als) => {
        return als.run({
          app: this.options.client,
          execution: {
            ctx: this.fnArg,
            instance: this
          }
        }, async () => {
          return tracer.startActiveSpan("inngest.execution", (span) => {
            this.rootSpanId = span.spanContext().spanId;
            clientProcessorMap.get(this.options.client)?.declareStartingSpan({
              span,
              runId: this.options.runId,
              traceparent: this.options.headers[headerKeys.TraceParent],
              tracestate: this.options.headers[headerKeys.TraceState]
            });
            return this._start().then((result) => {
              this.debug("result:", result);
              return result;
            }).finally(() => {
              span.end();
            });
          });
        });
      });
    }
    return this.execution;
  }
  addMetadata(stepId, kind, scope, op, values) {
    if (!this.state.metadata) this.state.metadata = /* @__PURE__ */ new Map();
    const updates = this.state.metadata.get(stepId) ?? [];
    updates.push({
      kind,
      scope,
      op,
      values
    });
    this.state.metadata.set(stepId, updates);
    return true;
  }
  /**
  * Starts execution of the user's function and the core loop.
  */
  async _start() {
    try {
      const allCheckpointHandler = this.getCheckpointHandler("");
      this.state.hooks = await this.initializeMiddleware();
      await this.startExecution();
      let i = 0;
      for await (const checkpoint of this.state.loop) {
        await allCheckpointHandler(checkpoint, i);
        const result = await this.getCheckpointHandler(checkpoint.type)(checkpoint, i++);
        if (result) return result;
      }
    } catch (error) {
      return await this.transformOutput({ error });
    } finally {
      this.state.loop.return();
      await this.state.hooks?.beforeResponse?.();
    }
    throw new Error("Core loop finished without returning a value");
  }
  async checkpoint(steps) {
    if (this.options.stepMode === StepMode.Sync) if (!this.state.checkpointedRun) {
      const res = await retryWithBackoff(() => this.options.client["inngestApi"].checkpointNewRun({
        runId: this.fnArg.runId,
        event: this.fnArg.event,
        steps,
        executionVersion: this.version,
        retries: this.fnArg.maxAttempts ?? defaultMaxRetries
      }), CHECKPOINT_RETRY_OPTIONS);
      this.state.checkpointedRun = {
        appId: res.data.app_id,
        fnId: res.data.fn_id,
        token: res.data.token
      };
    } else await retryWithBackoff(() => this.options.client["inngestApi"].checkpointSteps({
      appId: this.state.checkpointedRun.appId,
      fnId: this.state.checkpointedRun.fnId,
      runId: this.fnArg.runId,
      steps
    }), CHECKPOINT_RETRY_OPTIONS);
    else if (this.options.stepMode === StepMode.AsyncCheckpointing) {
      if (!this.options.queueItemId) throw new Error("Missing queueItemId for async checkpointing. This is a bug in the Inngest SDK.");
      if (!this.options.internalFnId) throw new Error("Missing internalFnId for async checkpointing. This is a bug in the Inngest SDK.");
      await retryWithBackoff(() => this.options.client["inngestApi"].checkpointStepsAsync({
        runId: this.fnArg.runId,
        fnId: this.options.internalFnId,
        queueItemId: this.options.queueItemId,
        steps
      }), CHECKPOINT_RETRY_OPTIONS);
    } else throw new Error("Checkpointing is only supported in Sync and AsyncCheckpointing step modes. This is a bug in the Inngest SDK.");
  }
  async checkpointAndSwitchToAsync(steps) {
    await this.checkpoint(steps);
    if (!this.state.checkpointedRun?.token) throw new Error("Failed to checkpoint and switch to async mode");
    return {
      type: "change-mode",
      ctx: this.fnArg,
      ops: this.ops,
      to: StepMode.Async,
      token: this.state.checkpointedRun?.token
    };
  }
  /**
  * Returns whether we're in the final attempt of execution, or `null` if we
  * can't determine this in the SDK.
  */
  inFinalAttempt() {
    if (typeof this.fnArg.maxAttempts !== "number") return null;
    return this.fnArg.attempt + 1 >= this.fnArg.maxAttempts;
  }
  /**
  * Creates a handler for every checkpoint type, defining what to do when we
  * reach that checkpoint in the core loop.
  */
  createCheckpointHandlers() {
    const commonCheckpointHandler = (checkpoint) => {
      this.debug(`${this.options.stepMode} checkpoint:`, checkpoint);
    };
    const stepRanHandler = async (stepResult) => {
      const transformResult = await this.transformOutput(stepResult);
      if (transformResult.type === "function-resolved") return {
        type: "step-ran",
        ctx: transformResult.ctx,
        ops: transformResult.ops,
        step: {
          ...stepResult,
          data: transformResult.data
        }
      };
      else if (transformResult.type === "function-rejected") {
        const stepForResponse = {
          ...stepResult,
          error: transformResult.error
        };
        if (stepResult.op === StepOpCode.StepFailed) {
          const ser = serializeError$1(transformResult.error);
          stepForResponse.data = {
            __serialized: true,
            name: ser.name,
            message: ser.message,
            stack: ""
          };
        }
        return {
          type: "step-ran",
          ctx: transformResult.ctx,
          ops: transformResult.ops,
          retriable: transformResult.retriable,
          step: stepForResponse
        };
      }
      return transformResult;
    };
    const maybeReturnNewSteps = async () => {
      const newSteps = await this.filterNewSteps(Array.from(this.state.steps.values()));
      if (newSteps) return {
        type: "steps-found",
        ctx: this.fnArg,
        ops: this.ops,
        steps: newSteps
      };
    };
    const attemptCheckpointAndResume = async (stepResult, resume = true, force = false) => {
      if (stepResult) {
        const stepToResume = this.resumeStepWithResult(stepResult, resume);
        delete this.state.executingStep;
        const transformedData = (await this.state.hooks?.transformOutput?.({
          result: { data: stepResult.data },
          step: void 0
        }))?.result?.data ?? stepResult.data;
        this.state.checkpointingStepBuffer.push({
          ...stepToResume,
          data: transformedData
        });
      }
      if (force || !this.options.checkpointingConfig?.bufferedSteps || this.state.checkpointingStepBuffer.length >= this.options.checkpointingConfig.bufferedSteps) {
        this.debug("checkpointing and resuming execution after step run");
        try {
          this.debug(`checkpointing all buffered steps:`, this.state.checkpointingStepBuffer.map((op) => op.displayName || op.id).join(", "));
          await this.checkpoint(this.state.checkpointingStepBuffer);
          return;
        } catch (err2) {
          this.debug("error checkpointing after step run, so falling back to async", err2);
          if (stepResult) return stepRanHandler(stepResult);
        } finally {
          this.state.checkpointingStepBuffer = [];
        }
      } else this.debug(`not checkpointing yet, continuing execution as we haven't reached buffered step limit of ${this.options.checkpointingConfig?.bufferedSteps}`);
    };
    const syncHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async (checkpoint, i) => {
        const transformedData = (await this.state.hooks?.transformOutput?.({
          result: { data: checkpoint.data },
          step: void 0
        }))?.result?.data ?? checkpoint.data;
        await this.checkpoint([{
          op: StepOpCode.RunComplete,
          id: _internals.hashId("complete"),
          data: await this.options.createResponse(transformedData)
        }]);
        return await this.transformOutput({ data: checkpoint.data });
      },
      "function-rejected": async (checkpoint) => {
        if (this.inFinalAttempt()) return await this.transformOutput({ error: checkpoint.error });
        return this.checkpointAndSwitchToAsync([{
          id: _internals.hashId("complete"),
          op: StepOpCode.StepError,
          error: checkpoint.error
        }]);
      },
      "step-not-found": () => {
        return {
          type: "function-rejected",
          ctx: this.fnArg,
          error: /* @__PURE__ */ new Error("Step not found when checkpointing; this should never happen"),
          ops: this.ops,
          retriable: false
        };
      },
      "steps-found": async ({ steps }) => {
        if (steps.length !== 1 || steps[0].mode !== StepMode.Sync) return this.checkpointAndSwitchToAsync(steps.map((step2) => ({
          ...step2,
          id: step2.hashedId
        })));
        const result = await this.executeStep(steps[0]);
        if (result.error) return this.checkpointAndSwitchToAsync([result]);
        const stepToResume = this.resumeStepWithResult(result);
        delete this.state.executingStep;
        const transformedData = (await this.state.hooks?.transformOutput?.({
          result: { data: result.data },
          step: void 0
        }))?.result?.data ?? result.data;
        const stepForCheckpoint = {
          ...stepToResume,
          data: transformedData
        };
        await this.checkpoint([stepForCheckpoint]);
      },
      "checkpointing-runtime-reached": () => {
        return this.checkpointAndSwitchToAsync([{
          op: StepOpCode.DiscoveryRequest,
          id: _internals.hashId("discovery-request")
        }]);
      },
      "checkpointing-buffer-interval-reached": () => {
        return attemptCheckpointAndResume(void 0, false, true);
      }
    };
    const asyncHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async ({ data }) => {
        if (this.options.createResponse) data = await this.options.createResponse(data);
        return await this.transformOutput({ data });
      },
      "function-rejected": async (checkpoint) => {
        return await this.transformOutput({ error: checkpoint.error });
      },
      "steps-found": async ({ steps }) => {
        const stepResult = await this.tryExecuteStep(steps);
        if (stepResult) return stepRanHandler(stepResult);
        return maybeReturnNewSteps();
      },
      "step-not-found": ({ step: step2, foundSteps, totalFoundSteps }) => {
        return {
          type: "step-not-found",
          ctx: this.fnArg,
          ops: this.ops,
          step: step2,
          foundSteps,
          totalFoundSteps
        };
      },
      "checkpointing-runtime-reached": () => {
        throw new Error("Checkpointing maximum runtime reached, but this is not in a checkpointing step mode. This is a bug in the Inngest SDK.");
      },
      "checkpointing-buffer-interval-reached": () => {
        throw new Error("Checkpointing maximum buffer interval reached, but this is not in a checkpointing step mode. This is a bug in the Inngest SDK.");
      }
    };
    const asyncCheckpointingHandlers = {
      "": commonCheckpointHandler,
      "function-resolved": async (checkpoint, i) => {
        const output = await asyncHandlers["function-resolved"](checkpoint, i);
        if (output?.type === "function-resolved") {
          const steps = this.state.checkpointingStepBuffer.concat({
            op: StepOpCode.RunComplete,
            id: _internals.hashId("complete"),
            data: output.data
          });
          return {
            type: "steps-found",
            ctx: output.ctx,
            ops: output.ops,
            steps
          };
        }
      },
      "function-rejected": async (checkpoint) => {
        if (this.state.checkpointingStepBuffer.length) await attemptCheckpointAndResume(void 0, false);
        return await this.transformOutput({ error: checkpoint.error });
      },
      "step-not-found": asyncHandlers["step-not-found"],
      "steps-found": async ({ steps }) => {
        const { stepsToResume, newSteps } = steps.reduce((acc, step2) => {
          if (!step2.hasStepState) acc.newSteps.push(step2);
          else if (!step2.fulfilled) acc.stepsToResume.push(step2);
          return acc;
        }, {
          stepsToResume: [],
          newSteps: []
        });
        this.debug("split found steps in to:", {
          stepsToResume: stepsToResume.length,
          newSteps: newSteps.length
        });
        if (!this.options.requestedRunStep && newSteps.length) {
          if (this.state.checkpointingRuntimeExceeded) {
            if (this.state.checkpointingStepBuffer.length) {
              const fallback = await attemptCheckpointAndResume(void 0, false, true);
              if (fallback) return fallback;
            }
            return maybeReturnNewSteps();
          }
          const stepResult = await this.tryExecuteStep(newSteps);
          if (stepResult) {
            this.debug(`executed step "${stepResult.id}" successfully`);
            if (stepResult.error) return stepRanHandler(stepResult);
            return await attemptCheckpointAndResume(stepResult);
          }
          return maybeReturnNewSteps();
        }
        if (stepsToResume.length) {
          this.debug(`resuming ${stepsToResume.length} steps`);
          for (const st of stepsToResume) this.resumeStepWithResult({
            ...st,
            id: st.hashedId
          });
        }
      },
      "checkpointing-runtime-reached": async () => {
        this.state.checkpointingRuntimeExceeded = true;
      },
      "checkpointing-buffer-interval-reached": () => {
        return attemptCheckpointAndResume(void 0, false, true);
      }
    };
    return {
      [StepMode.Async]: asyncHandlers,
      [StepMode.Sync]: syncHandlers,
      [StepMode.AsyncCheckpointing]: asyncCheckpointingHandlers
    };
  }
  getCheckpointHandler(type) {
    return this.checkpointHandlers[this.options.stepMode][type];
  }
  async tryExecuteStep(steps) {
    const hashedStepIdToRun = this.options.requestedRunStep || this.getEarlyExecRunStep(steps);
    if (!hashedStepIdToRun) return;
    const step2 = steps.find((step$1) => step$1.hashedId === hashedStepIdToRun && step$1.fn);
    if (step2) return await this.executeStep(step2);
    this.timeout?.reset();
  }
  /**
  * Given a list of outgoing ops, decide if we can execute an op early and
  * return the ID of the step to execute if we can.
  */
  getEarlyExecRunStep(steps) {
    if (this.options.disableImmediateExecution) return;
    const unfulfilledSteps = steps.filter((step2) => !step2.fulfilled);
    if (unfulfilledSteps.length !== 1) return;
    const op = unfulfilledSteps[0];
    if (op && op.op === StepOpCode.StepPlanned) return op.hashedId;
  }
  async filterNewSteps(foundSteps) {
    if (this.options.requestedRunStep) return;
    const newSteps = foundSteps.reduce((acc, step2) => {
      if (!step2.hasStepState) acc.push(step2);
      return acc;
    }, []);
    if (!newSteps.length) return;
    await this.state.hooks?.afterMemoization?.();
    await this.state.hooks?.beforeExecution?.();
    await this.state.hooks?.afterExecution?.();
    const stepList = newSteps.map((step2) => ({
      displayName: step2.displayName,
      op: step2.op,
      id: step2.hashedId,
      name: step2.name,
      opts: step2.opts,
      userland: step2.userland
    }));
    return await this.transformNewSteps(stepList);
  }
  /**
  * Using middleware, transform any newly-found steps before returning them to
  * an Inngest Server.
  */
  async transformNewSteps(steps) {
    return Promise.all(steps.map(async (step2) => {
      if (step2.op !== StepOpCode.InvokeFunction) return step2;
      const transformedPayload = await (await getHookStack(this.options.fn["middleware"], "onSendEvent", void 0, {
        transformInput: (prev, output) => {
          return {
            ...prev,
            ...output
          };
        },
        transformOutput: (prev, output) => {
          return { result: {
            ...prev.result,
            ...output?.result
          } };
        }
      })).transformInput?.({ payloads: [{
        ...step2.opts?.payload ?? {},
        name: internalEvents.FunctionInvoked
      }] });
      const newPayload = invokePayloadSchema.parse(transformedPayload?.payloads?.[0] ?? {});
      return {
        ...step2,
        opts: {
          ...step2.opts,
          payload: {
            ...step2.opts?.payload ?? {},
            ...newPayload
          }
        }
      };
    }));
  }
  async executeStep({ id, name, opts, fn, displayName, userland, hashedId }) {
    this.debug(`preparing to execute step "${id}"`);
    this.timeout?.clear();
    await this.state.hooks?.afterMemoization?.();
    await this.state.hooks?.beforeExecution?.();
    const outgoingOp = {
      id: hashedId,
      op: StepOpCode.StepRun,
      name,
      opts,
      displayName,
      userland
    };
    this.state.executingStep = outgoingOp;
    const store = await getAsyncCtx();
    if (store?.execution) store.execution.executingStep = {
      id,
      name: displayName
    };
    this.debug(`executing step "${id}"`);
    if (this.rootSpanId && this.options.checkpointingConfig) clientProcessorMap.get(this.options.client)?.declareStepExecution(this.rootSpanId, hashedId, this.options.data?.attempt ?? 0);
    let interval;
    return goIntervalTiming(() => runAsPromise(fn)).finally(async () => {
      this.debug(`finished executing step "${id}"`);
      if (this.rootSpanId && this.options.checkpointingConfig) clientProcessorMap.get(this.options.client)?.clearStepExecution(this.rootSpanId);
      if (store?.execution) delete store.execution.executingStep;
      await this.state.hooks?.afterExecution?.();
    }).then(async ({ resultPromise, interval: _interval }) => {
      interval = _interval;
      const metadata = this.state.metadata?.get(id);
      return {
        ...outgoingOp,
        data: await resultPromise,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
    }).catch((error) => {
      let errorIsRetriable = true;
      if (error instanceof NonRetriableError || error?.name === "NonRetriableError") errorIsRetriable = false;
      else if (this.fnArg.maxAttempts && this.fnArg?.maxAttempts - 1 === this.fnArg.attempt) errorIsRetriable = false;
      const metadata = this.state.metadata?.get(id);
      if (errorIsRetriable) return {
        ...outgoingOp,
        op: StepOpCode.StepError,
        error,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
      else return {
        ...outgoingOp,
        op: StepOpCode.StepFailed,
        error,
        ...metadata && metadata.length > 0 ? { metadata } : {}
      };
    }).then((op) => ({
      ...op,
      timing: interval
    }));
  }
  /**
  * Starts execution of the user's function, including triggering checkpoints
  * and middleware hooks where appropriate.
  */
  async startExecution() {
    await this.transformInput();
    this.timeout?.start();
    this.checkpointingMaxRuntimeTimer?.start();
    this.checkpointingMaxBufferIntervalTimer?.start();
    await this.state.hooks?.beforeMemoization?.();
    if (this.state.allStateUsed()) {
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
    }
    runAsPromise(() => this.userFnToRun(this.fnArg)).finally(async () => {
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
      await this.state.hooks?.afterExecution?.();
    }).then((data) => {
      this.state.setCheckpoint({
        type: "function-resolved",
        data
      });
    }).catch((error) => {
      this.state.setCheckpoint({
        type: "function-rejected",
        error
      });
    });
  }
  /**
  * Using middleware, transform input before running.
  */
  async transformInput() {
    const inputMutations = await this.state.hooks?.transformInput?.({
      ctx: { ...this.fnArg },
      steps: Object.values(this.state.stepState),
      fn: this.options.fn,
      reqArgs: this.options.reqArgs
    });
    if (inputMutations?.ctx) this.fnArg = inputMutations.ctx;
    if (inputMutations?.steps) this.state.stepState = Object.fromEntries(inputMutations.steps.map((step2) => [step2.id, step2]));
  }
  /**
  * Using middleware, transform output before returning.
  */
  async transformOutput(dataOrError) {
    const output = { ...dataOrError };
    const step2 = this.state.executingStep;
    delete this.state.executingStep;
    const isStepExecution = Boolean(step2);
    const transformedOutput = await this.state.hooks?.transformOutput?.({
      result: { ...output },
      step: step2
    });
    const { data, error } = {
      ...output,
      ...transformedOutput?.result
    };
    if (!isStepExecution) await this.state.hooks?.finished?.({ result: { ...typeof error !== "undefined" ? { error } : { data } } });
    if (typeof error !== "undefined") {
      let retriable = !(error instanceof NonRetriableError || error?.name === "NonRetriableError" || error instanceof StepError && error === this.state.recentlyRejectedStepError);
      if (retriable && (error instanceof RetryAfterError || error?.name === "RetryAfterError")) retriable = error.retryAfter;
      const serializedError = minifyPrettyError(serializeError$1(error));
      return {
        type: "function-rejected",
        ctx: this.fnArg,
        ops: this.ops,
        error: serializedError,
        retriable
      };
    }
    return {
      type: "function-resolved",
      ctx: this.fnArg,
      ops: this.ops,
      data: undefinedToNull(data)
    };
  }
  createExecutionState() {
    const d = createDeferredPromiseWithStack();
    let checkpointResolve = d.deferred.resolve;
    const checkpointResults = d.results;
    const loop = (async function* (cleanUp) {
      try {
        while (true) {
          const res = (await checkpointResults.next()).value;
          if (res) yield res;
        }
      } finally {
        cleanUp?.();
      }
    })(() => {
      this.timeout?.clear();
      this.checkpointingMaxRuntimeTimer?.clear();
      this.checkpointingMaxBufferIntervalTimer?.clear();
      checkpointResults.return();
    });
    const stepsToFulfill = Object.keys(this.options.stepState).length;
    return {
      stepState: this.options.stepState,
      stepsToFulfill,
      steps: /* @__PURE__ */ new Map(),
      loop,
      hasSteps: Boolean(stepsToFulfill),
      stepCompletionOrder: [...this.options.stepCompletionOrder],
      remainingStepsToBeSeen: new Set(this.options.stepCompletionOrder),
      setCheckpoint: (checkpoint) => {
        this.debug("setting checkpoint:", checkpoint.type);
        ({ resolve: checkpointResolve } = checkpointResolve(checkpoint));
      },
      allStateUsed: () => {
        return this.state.remainingStepsToBeSeen.size === 0;
      },
      checkpointingStepBuffer: [],
      metadata: /* @__PURE__ */ new Map()
    };
  }
  get ops() {
    return Object.fromEntries(this.state.steps);
  }
  createFnArg() {
    const step2 = this.createStepTools();
    let fnArg = {
      ...this.options.data,
      step: step2
    };
    if (this.options.isFailureHandler) {
      const eventData = objectType({ error: jsonErrorSchema }).parse(fnArg.event?.data);
      fnArg = {
        ...fnArg,
        error: deserializeError$1(eventData.error)
      };
    }
    return this.options.transformCtx?.(fnArg) ?? fnArg;
  }
  createStepTools() {
    const foundStepsToReport = /* @__PURE__ */ new Map();
    const unhandledFoundStepsToReport = /* @__PURE__ */ new Map();
    const expectedNextStepIndexes = /* @__PURE__ */ new Map();
    const remainingStepCompletionOrder = this.state.stepCompletionOrder.slice();
    let foundStepsReportPromise;
    let beforeExecHooksPromise;
    let warnOfParallelIndexing = false;
    let tickExtensionCount = 0;
    const maybeWarnOfParallelIndexing = (userlandCollisionId) => {
      if (warnOfParallelIndexing) return;
      const hashedCollisionId = _internals.hashId(userlandCollisionId);
      if (this.state.steps.has(hashedCollisionId)) {
        if (!foundStepsToReport.has(hashedCollisionId)) {
          warnOfParallelIndexing = true;
          this.options.client["warnMetadata"]({ run_id: this.fnArg.runId }, ErrCode.AUTOMATIC_PARALLEL_INDEXING, prettyError({
            type: "warn",
            whatHappened: "We detected that you have multiple steps with the same ID.",
            code: ErrCode.AUTOMATIC_PARALLEL_INDEXING,
            why: `This can happen if you're using the same ID for multiple steps across different chains of parallel work. We found the issue with step "${userlandCollisionId}".`,
            reassurance: "Your function is still running, though it may exhibit unexpected behaviour.",
            consequences: "Using the same IDs across parallel chains of work can cause unexpected behaviour.",
            toFixNow: "We recommend using a unique ID for each step, especially those happening in parallel."
          }));
        }
      }
    };
    const reportNextTick = () => {
      if (foundStepsReportPromise) return;
      let extensionPromise;
      if (++tickExtensionCount >= 10) {
        tickExtensionCount = 0;
        extensionPromise = resolveNextTick();
      } else extensionPromise = resolveAfterPending();
      foundStepsReportPromise = extensionPromise.then(() => beforeExecHooksPromise).then(() => {
        foundStepsReportPromise = void 0;
        for (let i = 0; i < remainingStepCompletionOrder.length; i++) {
          const nextStepId = remainingStepCompletionOrder[i];
          if (!nextStepId) continue;
          if (unhandledFoundStepsToReport.get(nextStepId)?.handle()) {
            remainingStepCompletionOrder.splice(i, 1);
            unhandledFoundStepsToReport.delete(nextStepId);
            reportNextTick();
            return;
          }
        }
        const steps = [...foundStepsToReport.values()];
        foundStepsToReport.clear();
        unhandledFoundStepsToReport.clear();
        this.state.setCheckpoint({
          type: "steps-found",
          steps
        });
      });
    };
    const pushStepToReport = (step2) => {
      foundStepsToReport.set(step2.hashedId, step2);
      unhandledFoundStepsToReport.set(step2.hashedId, step2);
      reportNextTick();
    };
    const stepHandler = async ({ args, matchOp, opts }) => {
      await beforeExecHooksPromise;
      const opId = matchOp(getStepOptions(args[0]), ...args.slice(1));
      if (this.state.executingStep)
        this.options.client["warnMetadata"]({ run_id: this.fnArg.runId }, ErrCode.NESTING_STEPS, prettyError({
          whatHappened: `We detected that you have nested \`step.*\` tooling in \`${opId.displayName ?? opId.id}\``,
          consequences: "Nesting `step.*` tooling is not supported.",
          type: "warn",
          reassurance: "It's possible to see this warning if steps are separated by regular asynchronous calls, which is fine.",
          stack: true,
          toFixNow: "Make sure you're not using `step.*` tooling inside of other `step.*` tooling. If you need to compose steps together, you can create a new async function and call it from within your step function, or use promise chaining.",
          code: ErrCode.NESTING_STEPS
        }));
      if (this.state.steps.has(_internals.hashId(opId.id))) {
        const originalId = opId.id;
        maybeWarnOfParallelIndexing(originalId);
        const expectedNextIndex = expectedNextStepIndexes.get(originalId) ?? 1;
        for (let i = expectedNextIndex; ; i++) {
          const newId = originalId + STEP_INDEXING_SUFFIX + i;
          if (!this.state.steps.has(_internals.hashId(newId))) {
            expectedNextStepIndexes.set(originalId, i + 1);
            opId.id = newId;
            opId.userland.index = i;
            break;
          }
        }
      }
      const { promise, resolve, reject } = createDeferredPromise();
      const hashedId = _internals.hashId(opId.id);
      const stepState = this.state.stepState[hashedId];
      let isFulfilled = false;
      if (stepState) {
        stepState.seen = true;
        this.state.remainingStepsToBeSeen.delete(hashedId);
        if (typeof stepState.input === "undefined") isFulfilled = true;
      }
      let extraOpts;
      let fnArgs = [...args];
      if (typeof stepState?.input !== "undefined" && Array.isArray(stepState.input)) switch (opId.op) {
        case StepOpCode.StepPlanned:
          fnArgs = [...args.slice(0, 2), ...stepState.input];
          extraOpts = { input: [...stepState.input] };
          break;
        case StepOpCode.AiGateway:
          extraOpts = { body: {
            ...typeof opId.opts?.body === "object" ? { ...opId.opts.body } : {},
            ...stepState.input[0]
          } };
          break;
      }
      const step2 = {
        ...opId,
        opts: {
          ...opId.opts,
          ...extraOpts
        },
        rawArgs: fnArgs,
        hashedId,
        input: stepState?.input,
        fn: opts?.fn ? () => opts.fn?.(this.fnArg, ...fnArgs) : void 0,
        promise,
        fulfilled: isFulfilled,
        hasStepState: Boolean(stepState),
        displayName: opId.displayName ?? opId.id,
        handled: false,
        handle: () => {
          if (step2.handled) return false;
          this.debug(`handling step "${hashedId}"`);
          step2.handled = true;
          const result = this.state.stepState[hashedId];
          if (step2.fulfilled && result) {
            result.fulfilled = true;
            Promise.all([
              result.data,
              result.error,
              result.input
            ]).then(() => {
              if (typeof result.data !== "undefined") resolve(result.data);
              else {
                this.state.recentlyRejectedStepError = new StepError(opId.id, result.error);
                reject(this.state.recentlyRejectedStepError);
              }
            });
          }
          return true;
        }
      };
      this.state.steps.set(hashedId, step2);
      this.state.hasSteps = true;
      pushStepToReport(step2);
      if (!beforeExecHooksPromise && this.state.allStateUsed()) await (beforeExecHooksPromise = (async () => {
        await this.state.hooks?.afterMemoization?.();
        await this.state.hooks?.beforeExecution?.();
      })());
      return promise;
    };
    return createStepTools(this.options.client, this, stepHandler);
  }
  resumeStepWithResult(resultOp, resume = true) {
    const userlandStep = this.state.steps.get(resultOp.id);
    if (!userlandStep) throw new Error("Step not found in memoization state during async checkpointing; this should never happen and is a bug in the Inngest SDK");
    userlandStep.data = undefinedToNull(resultOp.data);
    userlandStep.timing = resultOp.timing;
    userlandStep.op = resultOp.op;
    userlandStep.id = resultOp.id;
    if (resume) {
      userlandStep.fulfilled = true;
      userlandStep.hasStepState = true;
      this.state.stepState[resultOp.id] = userlandStep;
      userlandStep.handle();
    }
    return userlandStep;
  }
  getUserFnToRun() {
    if (!this.options.isFailureHandler) return this.options.fn["fn"];
    if (!this.options.fn["onFailureFn"])
      throw new Error("Cannot find function `onFailure` handler");
    return this.options.fn["onFailureFn"];
  }
  initializeTimer(state) {
    if (!this.options.requestedRunStep) return;
    this.timeout = createTimeoutPromise(this.timeoutDuration);
    this.timeout.then(async () => {
      const { foundSteps, totalFoundSteps } = this.getStepNotFoundDetails();
      await this.state.hooks?.afterMemoization?.();
      await this.state.hooks?.beforeExecution?.();
      await this.state.hooks?.afterExecution?.();
      state.setCheckpoint({
        type: "step-not-found",
        step: {
          id: this.options.requestedRunStep,
          op: StepOpCode.StepNotFound
        },
        foundSteps,
        totalFoundSteps
      });
    });
  }
  getStepNotFoundDetails() {
    const foundSteps = [...this.state.steps.values()].filter((step2) => !step2.hasStepState).map((step2) => ({
      id: step2.hashedId,
      name: step2.name,
      displayName: step2.displayName
    })).sort((a, b) => a.id.localeCompare(b.id));
    return {
      foundSteps: foundSteps.slice(0, STEP_NOT_FOUND_MAX_FOUND_STEPS),
      totalFoundSteps: foundSteps.length
    };
  }
  initializeCheckpointRuntimeTimer(state) {
    this.debug("initializing checkpointing runtime timers", this.options.checkpointingConfig);
    if (this.options.checkpointingConfig?.maxRuntime) {
      const maxRuntimeMs = isTemporalDuration(this.options.checkpointingConfig.maxRuntime) ? this.options.checkpointingConfig.maxRuntime.total({ unit: "milliseconds" }) : typeof this.options.checkpointingConfig.maxRuntime === "string" ? ms(this.options.checkpointingConfig.maxRuntime) : this.options.checkpointingConfig.maxRuntime;
      if (Number.isFinite(maxRuntimeMs) && maxRuntimeMs > 0) {
        this.checkpointingMaxRuntimeTimer = createTimeoutPromise(maxRuntimeMs);
        this.checkpointingMaxRuntimeTimer.then(async () => {
          await this.state.hooks?.afterMemoization?.();
          await this.state.hooks?.beforeExecution?.();
          await this.state.hooks?.afterExecution?.();
          state.setCheckpoint({ type: "checkpointing-runtime-reached" });
        });
      }
    }
    if (this.options.checkpointingConfig?.maxInterval) {
      const maxIntervalMs = isTemporalDuration(this.options.checkpointingConfig.maxInterval) ? this.options.checkpointingConfig.maxInterval.total({ unit: "milliseconds" }) : typeof this.options.checkpointingConfig.maxInterval === "string" ? ms(this.options.checkpointingConfig.maxInterval) : this.options.checkpointingConfig.maxInterval;
      if (Number.isFinite(maxIntervalMs) && maxIntervalMs > 0) {
        this.checkpointingMaxBufferIntervalTimer = createTimeoutPromise(maxIntervalMs);
        this.checkpointingMaxBufferIntervalTimer.then(async () => {
          state.setCheckpoint({ type: "checkpointing-buffer-interval-reached" });
          this.checkpointingMaxBufferIntervalTimer?.reset();
        });
      }
    }
  }
  async initializeMiddleware() {
    const ctx = this.options.data;
    return await getHookStack(this.options.fn["middleware"], "onFunctionRun", {
      ctx,
      fn: this.options.fn,
      steps: Object.values(this.options.stepState),
      reqArgs: this.options.reqArgs
    }, {
      transformInput: (prev, output) => {
        return {
          ctx: {
            ...prev.ctx,
            ...output?.ctx
          },
          fn: this.options.fn,
          steps: prev.steps.map((step2, i) => ({
            ...step2,
            ...output?.steps?.[i]
          })),
          reqArgs: prev.reqArgs
        };
      },
      transformOutput: (prev, output) => {
        return {
          result: {
            ...prev.result,
            ...output?.result
          },
          step: prev.step
        };
      }
    });
  }
};
const hashId = (id) => {
  return sha1().update(id).digest("hex");
};
const hashOp = (op) => {
  return {
    ...op,
    id: hashId(op.id)
  };
};
const _internals = {
  hashOp,
  hashId
};
var InngestFunction = class InngestFunction2 {
  static stepId = "step";
  static failureSuffix = "-failure";
  get [Symbol.toStringTag]() {
    return InngestFunction2.Tag;
  }
  opts;
  fn;
  onFailureFn;
  client;
  middleware;
  /**
  * A stateless Inngest function, wrapping up function configuration and any
  * in-memory steps to run when triggered.
  *
  * This function can be "registered" to create a handler that Inngest can
  * trigger remotely.
  */
  constructor(client, opts, fn) {
    this.client = client;
    this.opts = opts;
    this.fn = fn;
    this.onFailureFn = this.opts.onFailure;
    this.middleware = this.client["initializeMiddleware"](this.opts.middleware, {
      registerInput: { fn: this },
      prefixStack: this.client["middleware"]
    });
  }
  /**
  * The generated or given ID for this function.
  */
  id(prefix) {
    return [prefix, this.opts.id].filter(Boolean).join("-");
  }
  /**
  * The generated or given ID for this function, prefixed with the app ID. This
  * is used for routing invokes and identifying the function across apps.
  */
  get absoluteId() {
    return this.id(this.client.id);
  }
  /**
  * The name of this function as it will appear in the Inngest Cloud UI.
  */
  get name() {
    return this.opts.name || this.id();
  }
  /**
  * The description of this function.
  */
  get description() {
    return this.opts.description;
  }
  /**
  * Retrieve the Inngest config for this function.
  */
  getConfig({ baseUrl, appPrefix, isConnect }) {
    const fnId = this.id(appPrefix);
    const stepUrl = new URL(baseUrl.href);
    stepUrl.searchParams.set(queryKeys.FnId, fnId);
    stepUrl.searchParams.set(queryKeys.StepId, InngestFunction2.stepId);
    const { retries: attempts, cancelOn, idempotency, batchEvents, rateLimit, throttle, concurrency, debounce, timeouts, priority, singleton } = this.opts;
    const retries = typeof attempts === "undefined" ? void 0 : { attempts };
    const fn = {
      id: fnId,
      name: this.name,
      triggers: (this.opts.triggers ?? []).map((trigger) => {
        if ("event" in trigger) return {
          event: trigger.event,
          expression: trigger.if
        };
        return { cron: trigger.cron };
      }),
      steps: { [InngestFunction2.stepId]: {
        id: InngestFunction2.stepId,
        name: InngestFunction2.stepId,
        runtime: {
          type: isConnect ? "ws" : "http",
          url: stepUrl.href
        },
        retries
      } },
      idempotency,
      batchEvents,
      rateLimit,
      throttle,
      concurrency,
      debounce,
      priority,
      timeouts,
      singleton
    };
    if (cancelOn) fn.cancel = cancelOn.map(({ event, timeout, if: ifStr, match }) => {
      const ret = { event };
      if (timeout) ret.timeout = timeStr(timeout);
      if (match) ret.if = `event.${match} == async.${match}`;
      else if (ifStr) ret.if = ifStr;
      return ret;
    }, []);
    const config = [fn];
    if (this.onFailureFn) {
      const id = `${fn.id}${InngestFunction2.failureSuffix}`;
      const name = `${fn.name ?? fn.id} (failure)`;
      const failureStepUrl = new URL(stepUrl.href);
      failureStepUrl.searchParams.set(queryKeys.FnId, id);
      config.push({
        id,
        name,
        triggers: [{
          event: internalEvents.FunctionFailed,
          expression: `event.data.function_id == '${fnId}'`
        }],
        steps: { [InngestFunction2.stepId]: {
          id: InngestFunction2.stepId,
          name: InngestFunction2.stepId,
          runtime: {
            type: "http",
            url: failureStepUrl.href
          },
          retries: { attempts: 1 }
        } }
      });
    }
    return config;
  }
  createExecution(opts) {
    const options = {
      fn: this,
      ...opts.partialOptions
    };
    return {
      [ExecutionVersion.V2]: () => createV2InngestExecution(options),
      [ExecutionVersion.V1]: () => createV1InngestExecution(options),
      [ExecutionVersion.V0]: () => createV0InngestExecution(options)
    }[opts.version]();
  }
  shouldOptimizeParallelism() {
    return this.opts.optimizeParallelism ?? this.client["options"].optimizeParallelism ?? false;
  }
  shouldAsyncCheckpoint(requestedRunStep, internalFnId, disableImmediateExecution) {
    if (requestedRunStep || !internalFnId || disableImmediateExecution) return;
    const userCfg = this.opts.checkpointing ?? this.client["options"].checkpointing ?? this.opts.experimentalCheckpointing ?? this.client["options"].experimentalCheckpointing;
    if (!userCfg) return;
    if (userCfg === true) return defaultCheckpointingOptions;
    return {
      bufferedSteps: userCfg.bufferedSteps ?? defaultCheckpointingOptions.bufferedSteps,
      maxRuntime: userCfg.maxRuntime ?? defaultCheckpointingOptions.maxRuntime,
      maxInterval: userCfg.maxInterval ?? defaultCheckpointingOptions.maxInterval
    };
  }
};
(function(_InngestFunction) {
  _InngestFunction.Tag = "Inngest.Function";
})(InngestFunction || (InngestFunction = {}));
var InngestFunctionReference = class InngestFunctionReference2 {
  get [Symbol.toStringTag]() {
    return InngestFunctionReference2.Tag;
  }
  constructor(opts) {
    this.opts = opts;
  }
};
(function(_InngestFunctionReference) {
  _InngestFunctionReference.Tag = "Inngest.FunctionReference";
})(InngestFunctionReference || (InngestFunctionReference = {}));
const getStepOptions = (options) => {
  if (typeof options === "string") return { id: options };
  return options;
};
const STEP_INDEXING_SUFFIX = ":";
const createStepTools = (client, execution, stepHandler) => {
  const createTool = (matchOp, opts) => {
    return (async (...args) => {
      return stepHandler({
        args,
        matchOp,
        opts
      });
    });
  };
  const createStepRun = (type) => {
    return createTool(({ id, name }, _fn, ...input) => {
      const opts = {
        ...input.length ? { input } : {},
        ...type ? { type } : {}
      };
      return {
        id,
        mode: StepMode.Sync,
        op: StepOpCode.StepPlanned,
        name: id,
        displayName: name ?? id,
        ...Object.keys(opts).length ? { opts } : {},
        userland: { id }
      };
    }, { fn: (_, __, fn, ...input) => fn(...input) });
  };
  const createStepMetadataWrapper = (memoizationId, builder) => {
    if (!client["experimentalMetadataEnabled"]) throw new Error('step.metadata() is experimental. Enable it by adding metadataMiddleware() from "inngest/experimental" to your client middleware.');
    const withBuilder = (next) => createStepMetadataWrapper(memoizationId, next);
    if (!builder) builder = new UnscopedMetadataBuilder(client).run();
    return {
      run: (runId) => withBuilder(builder.run(runId)),
      step: (stepId, index) => withBuilder(builder.step(stepId, index)),
      attempt: (attemptIndex) => withBuilder(builder.attempt(attemptIndex)),
      span: (spanId) => withBuilder(builder.span(spanId)),
      update: async (values, kind = "default") => {
        await tools.run(memoizationId, async () => {
          await builder.update(values, kind);
        });
      },
      do: async (fn) => {
        await tools.run(memoizationId, async () => {
          await fn(builder);
        });
      }
    };
  };
  const tools = {
    sendEvent: createTool(({ id, name }) => {
      return {
        id,
        mode: StepMode.Sync,
        op: StepOpCode.StepPlanned,
        name: "sendEvent",
        displayName: name ?? id,
        opts: { type: "step.sendEvent" },
        userland: { id }
      };
    }, { fn: (_ctx, _idOrOptions, payload) => {
      return client["_send"]({
        payload,
        headers: execution["options"]["headers"]
      });
    } }),
    waitForSignal: createTool(({ id, name }, opts) => {
      return {
        id,
        mode: StepMode.Async,
        op: StepOpCode.WaitForSignal,
        name: opts.signal,
        displayName: name ?? id,
        opts: {
          signal: opts.signal,
          timeout: timeStr(opts.timeout),
          conflict: opts.onConflict
        },
        userland: { id }
      };
    }),
    realtime: { publish: createTool(({ id, name }) => {
      return {
        id,
        mode: StepMode.Sync,
        op: StepOpCode.StepPlanned,
        displayName: name ?? id,
        opts: { type: "step.realtime.publish" },
        userland: { id }
      };
    }, { fn: (ctx, _idOrOptions, opts) => {
      return client["inngestApi"].publish({
        topics: [opts.topic],
        channel: opts.channel,
        runId: ctx.runId
      }, opts.data);
    } }) },
    sendSignal: createTool(({ id, name }, opts) => {
      return {
        id,
        mode: StepMode.Sync,
        op: StepOpCode.StepPlanned,
        name: "sendSignal",
        displayName: name ?? id,
        opts: {
          type: "step.sendSignal",
          signal: opts.signal
        },
        userland: { id }
      };
    }, { fn: (_ctx, _idOrOptions, opts) => {
      return client["_sendSignal"]({
        signal: opts.signal,
        data: opts.data,
        headers: execution["options"]["headers"]
      });
    } }),
    waitForEvent: createTool(({ id, name }, opts) => {
      const matchOpts = { timeout: timeStr(typeof opts === "string" ? opts : opts.timeout) };
      if (typeof opts !== "string") {
        if (opts?.match) matchOpts.if = `event.${opts.match} == async.${opts.match}`;
        else if (opts?.if) matchOpts.if = opts.if;
      }
      return {
        id,
        mode: StepMode.Async,
        op: StepOpCode.WaitForEvent,
        name: opts.event,
        opts: matchOpts,
        displayName: name ?? id,
        userland: { id }
      };
    }),
    run: createStepRun(),
    ai: {
      infer: createTool(({ id, name }, options) => {
        const { model, body, ...rest } = options;
        const modelCopy = { ...model };
        options.model.onCall?.(modelCopy, options.body);
        return {
          id,
          mode: StepMode.Async,
          op: StepOpCode.AiGateway,
          displayName: name ?? id,
          opts: {
            type: "step.ai.infer",
            url: modelCopy.url,
            headers: modelCopy.headers,
            auth_key: modelCopy.authKey,
            format: modelCopy.format,
            body,
            ...rest
          },
          userland: { id }
        };
      }),
      wrap: createStepRun("step.ai.wrap"),
      models: { ...distExports$1.models }
    },
    sleep: createTool(({ id, name }, time) => {
      const msTimeStr = timeStr(isTemporalDuration(time) ? time.total({ unit: "milliseconds" }) : time);
      return {
        id,
        mode: StepMode.Async,
        op: StepOpCode.Sleep,
        name: msTimeStr,
        displayName: name ?? id,
        userland: { id }
      };
    }),
    sleepUntil: createTool(({ id, name }, time) => {
      try {
        const iso = getISOString(time);
        return {
          id,
          mode: StepMode.Async,
          op: StepOpCode.Sleep,
          name: iso,
          displayName: name ?? id,
          userland: { id }
        };
      } catch (err2) {
        console.warn("Invalid `Date`, date string, `Temporal.Instant`, or `Temporal.ZonedDateTime` passed to sleepUntil;", err2);
        throw new Error(`Invalid \`Date\`, date string, \`Temporal.Instant\`, or \`Temporal.ZonedDateTime\` passed to sleepUntil: ${time}`);
      }
    }),
    invoke: createTool(({ id, name }, invokeOpts) => {
      const optsSchema = invokePayloadSchema.extend({ timeout: unionType([
        numberType(),
        stringType(),
        dateType()
      ]).optional() });
      const parsedFnOpts = optsSchema.extend({
        _type: literalType("fullId").optional().default("fullId"),
        function: stringType().min(1)
      }).or(optsSchema.extend({
        _type: literalType("fnInstance").optional().default("fnInstance"),
        function: instanceOfType(InngestFunction)
      })).or(optsSchema.extend({
        _type: literalType("refInstance").optional().default("refInstance"),
        function: instanceOfType(InngestFunctionReference)
      })).safeParse(invokeOpts);
      if (!parsedFnOpts.success) throw new Error(`Invalid invocation options passed to invoke; must include either a function or functionId.`);
      const { _type, function: fn, data, user, v, timeout } = parsedFnOpts.data;
      const opts = {
        payload: {
          data,
          user,
          v
        },
        function_id: "",
        timeout: typeof timeout === "undefined" ? void 0 : timeStr(timeout)
      };
      switch (_type) {
        case "fnInstance":
          opts.function_id = fn.id(fn["client"].id);
          break;
        case "fullId":
          console.warn(`${logPrefix} Invoking function with \`function: string\` is deprecated and will be removed in v4.0.0; use an imported function or \`referenceFunction()\` instead. See https://innge.st/ts-referencing-functions`);
          opts.function_id = fn;
          break;
        case "refInstance":
          opts.function_id = [fn.opts.appId || client.id, fn.opts.functionId].filter(Boolean).join("-");
          break;
      }
      return {
        id,
        mode: StepMode.Async,
        op: StepOpCode.InvokeFunction,
        displayName: name ?? id,
        opts,
        userland: { id }
      };
    }),
    fetch: fetch$1
  };
  tools[metadataSymbol] = (memoizationId) => createStepMetadataWrapper(memoizationId);
  tools[gatewaySymbol] = createTool(({ id, name }, input, init) => {
    const url = input instanceof Request ? input.url : input.toString();
    const headers = {};
    if (input instanceof Request) input.headers.forEach((value, key) => {
      headers[key] = value;
    });
    else if (init?.headers) new Headers(init.headers).forEach((value, key) => {
      headers[key] = value;
    });
    return {
      id,
      mode: StepMode.Async,
      op: StepOpCode.Gateway,
      displayName: name ?? id,
      opts: {
        url,
        method: init?.method ?? "GET",
        headers,
        body: init?.body
      },
      userland: { id }
    };
  });
  return tools;
};
const gatewaySymbol = /* @__PURE__ */ Symbol.for("inngest.step.gateway");
const step = {
  fetch: null,
  ai: {
    infer: (...args) => getDeferredStepTooling().then((tools) => tools.ai.infer(...args)),
    wrap: (...args) => getDeferredStepTooling().then((tools) => tools.ai.wrap(...args)),
    models: { ...distExports$1.models }
  },
  invoke: (...args) => getDeferredStepTooling().then((tools) => tools.invoke(...args)),
  run: (...args) => getDeferredStepTooling().then((tools) => tools.run(...args)),
  sendEvent: (...args) => getDeferredStepTooling().then((tools) => tools.sendEvent(...args)),
  sendSignal: (...args) => getDeferredStepTooling().then((tools) => tools.sendSignal(...args)),
  sleep: (...args) => getDeferredStepTooling().then((tools) => tools.sleep(...args)),
  sleepUntil: (...args) => getDeferredStepTooling().then((tools) => tools.sleepUntil(...args)),
  waitForEvent: (...args) => getDeferredStepTooling().then((tools) => tools.waitForEvent(...args)),
  waitForSignal: (...args) => getDeferredStepTooling().then((tools) => tools.waitForSignal(...args)),
  realtime: { publish: (...args) => getDeferredStepTooling().then((tools) => tools.realtime.publish(...args)) }
};
const getDeferredStepTooling = async () => {
  const ctx = await getAsyncCtx();
  if (!ctx) throw new Error("`step` tools can only be used within Inngest function executions; no context was found");
  if (!ctx.app) throw new Error("`step` tools can only be used within Inngest function executions; no Inngest client was found in the execution context");
  if (!ctx.execution) throw new Error("`step` tools can only be used within Inngest function executions; no execution context was found");
  return ctx.execution.ctx.step;
};
const invokePayloadSchema = objectType({
  data: recordType(anyType()).optional(),
  user: recordType(anyType()).optional(),
  v: stringType().optional()
});
const globalFetch = globalThis.fetch;
const debug$1 = debug("inngest:fetch");
const createFetchShim = () => {
  let stepFetch;
  const fetch$12 = async (input, init) => {
    const ctx = await getAsyncCtx();
    if (!ctx?.execution) {
      if (!stepFetch.fallback) throw new Error("step.fetch() called outside of a function and had no fallback set");
      debug$1("step.fetch() called outside of a function; falling back to global fetch");
      return stepFetch.fallback(input, init);
    }
    if (ctx.execution.executingStep) {
      if (!stepFetch.fallback) throw new Error(`step.fetch() called inside step "${ctx.execution.executingStep.id}" and had no fallback set`);
      debug$1(`step.fetch() called inside step "${ctx.execution.executingStep.id}"; falling back to global fetch`);
      return stepFetch.fallback(input, init);
    }
    const targetUrl = new URL(input instanceof Request ? input.url : input.toString());
    debug$1("step.fetch() shimming request to", targetUrl.hostname);
    const jsonRes = await ctx.execution.ctx.step[gatewaySymbol](`step.fetch: ${targetUrl.hostname}`, input, init);
    return new Response(jsonRes.body, {
      headers: jsonRes.headers,
      status: jsonRes.status_code
    });
  };
  const optionsRef = { fallback: globalFetch };
  const extras = {
    config: (options) => {
      Object.assign(optionsRef, options);
      Object.assign(stepFetch, optionsRef);
      return stepFetch;
    },
    ...optionsRef
  };
  stepFetch = Object.assign(fetch$12, extras);
  return stepFetch;
};
const fetch$1 = createFetchShim();
const devServerHost = (env = getProcessEnv()) => {
  return [
    envKeys.ReactAppInngestBaseUrl,
    envKeys.NextPublicInngestBaseUrl,
    envKeys.ReactAppInngestDevMode,
    envKeys.NextPublicInngestDevMode
  ].map((key) => {
    return env[key];
  }).find((v) => {
    if (!v) return;
    try {
      return Boolean(new URL(v));
    } catch {
    }
  });
};
const checkFns = /* @__PURE__ */ ((checks) => checks)({
  equals: (actual, expected) => actual === expected,
  "starts with": (actual, expected) => expected ? actual?.startsWith(expected) ?? false : false,
  "is truthy": (actual) => Boolean(actual),
  "is truthy but not": (actual, expected) => Boolean(actual) && actual !== expected
});
const prodChecks = [
  [
    envKeys.IsCloudflarePages,
    "equals",
    "1"
  ],
  [
    envKeys.Context,
    "starts with",
    "prod"
  ],
  [
    envKeys.Environment,
    "starts with",
    "prod"
  ],
  [
    envKeys.NodeEnv,
    "starts with",
    "prod"
  ],
  [
    envKeys.VercelEnvKey,
    "starts with",
    "prod"
  ],
  [envKeys.DenoDeployment, "is truthy"],
  [
    envKeys.VercelEnvKey,
    "is truthy but not",
    "development"
  ],
  [envKeys.IsNetlify, "is truthy"],
  [envKeys.IsRender, "is truthy"],
  [envKeys.RailwayBranch, "is truthy"],
  [envKeys.IsCloudflarePages, "is truthy"]
];
var Mode = class {
  type;
  /**
  * Whether the mode was explicitly set, or inferred from other sources.
  */
  isExplicit;
  explicitDevUrl;
  env;
  constructor({ type, isExplicit, explicitDevUrl, env = getProcessEnv() }) {
    this.env = protectEnv(env);
    this.type = type;
    this.isExplicit = isExplicit || Boolean(explicitDevUrl);
    this.explicitDevUrl = explicitDevUrl;
  }
  get isDev() {
    return this.type === "dev";
  }
  get isCloud() {
    return this.type === "cloud";
  }
  get isInferred() {
    return !this.isExplicit;
  }
  toJSON() {
    return {};
  }
  /**
  * If we are explicitly in a particular mode, retrieve the URL that we are
  * sure we should be using, not considering any environment variables or other
  * influences.
  */
  getExplicitUrl(defaultCloudUrl) {
    if (!this.isExplicit) return;
    if (this.explicitDevUrl) return this.explicitDevUrl.href;
    if (this.isCloud) return defaultCloudUrl;
    if (this.isDev) return defaultDevServerHost;
  }
};
const getMode = ({ env = getProcessEnv(), client, explicitMode } = {}) => {
  if (explicitMode) return new Mode({
    type: explicitMode,
    isExplicit: true,
    env
  });
  if (client?.["mode"].isExplicit) return client["mode"];
  if (envKeys.InngestDevMode in env) {
    if (typeof env[envKeys.InngestDevMode] === "string") try {
      return new Mode({
        type: "dev",
        isExplicit: true,
        explicitDevUrl: new URL(env[envKeys.InngestDevMode]),
        env
      });
    } catch {
    }
    const envIsDev = parseAsBoolean(env[envKeys.InngestDevMode]);
    if (typeof envIsDev === "boolean") return new Mode({
      type: envIsDev ? "dev" : "cloud",
      isExplicit: true,
      env
    });
  }
  return new Mode({
    type: prodChecks.some(([key, checkKey, expected]) => {
      return checkFns[checkKey](stringifyUnknown(env[key]), expected);
    }) ? "cloud" : "dev",
    isExplicit: false,
    env
  });
};
const getEnvironmentName = (env = getProcessEnv()) => {
  return env[envKeys.InngestEnvironment] || env[envKeys.BranchName] || env[envKeys.VercelBranch] || env[envKeys.NetlifyBranch] || env[envKeys.CloudflarePagesBranch] || env[envKeys.RenderBranch] || env[envKeys.RailwayBranch];
};
const processEnv = (key) => {
  if (!Object.values(envKeys).includes(key)) throw new Error(`Env var "${key}" is not in the whitelist`);
  return getProcessEnv()[key];
};
function getProcessEnv() {
  const env = {};
  const whitelist = Object.values(envKeys);
  for (const [k, v] of Object.entries(allProcessEnv())) {
    if (!whitelist.includes(k)) continue;
    env[k] = v;
  }
  return protectEnv(env);
}
function protectEnv(env) {
  return {
    ...env,
    toJSON: () => {
      return {};
    }
  };
}
const allProcessEnv = () => {
  try {
    if (process.env) return process.env;
  } catch (_err) {
  }
  try {
    const env = Deno.env.toObject();
    if (env) return env;
  } catch (_err) {
  }
  try {
    const env = Netlify.env.toObject();
    if (env) return env;
  } catch (_err) {
  }
  return {};
};
const inngestHeaders = (opts) => {
  const sdkVersion = `inngest-js:v${version}`;
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": sdkVersion,
    [headerKeys.SdkVersion]: sdkVersion,
    [headerKeys.SdkHandled]: "true"
  };
  if (opts?.framework) headers[headerKeys.Framework] = opts.framework;
  if (opts?.expectedServerKind) headers[headerKeys.InngestExpectedServerKind] = opts.expectedServerKind;
  const env = {
    ...getProcessEnv(),
    ...opts?.env
  };
  const inngestEnv = opts?.inngestEnv || getEnvironmentName(env);
  if (inngestEnv) headers[headerKeys.Environment] = inngestEnv;
  const platform = getPlatformName(env);
  if (platform) headers[headerKeys.Platform] = platform;
  return {
    ...headers,
    ...opts?.client?.["headers"],
    ...opts?.extras
  };
};
const platformChecks = {
  vercel: (env) => env[envKeys.IsVercel] === "1" || typeof EdgeRuntime === "string",
  netlify: (env) => env[envKeys.IsNetlify] === "true",
  "cloudflare-pages": (env) => env[envKeys.IsCloudflarePages] === "1",
  render: (env) => env[envKeys.IsRender] === "true",
  railway: (env) => Boolean(env[envKeys.RailwayEnvironment])
};
const streamingChecks = {
  vercel: (_framework, _env) => typeof EdgeRuntime === "string",
  "cloudflare-pages": () => true
};
const getPlatformName = (env) => {
  return Object.keys(platformChecks).find((key) => {
    return platformChecks[key](env);
  });
};
const platformSupportsStreaming = (framework, env = getProcessEnv()) => {
  return streamingChecks[getPlatformName(env)]?.(framework, env) ?? false;
};
const CUSTOM_FETCH_MARKER = /* @__PURE__ */ Symbol("Custom fetch implementation");
const getFetch = (givenFetch) => {
  if (givenFetch) {
    if (CUSTOM_FETCH_MARKER in givenFetch) return givenFetch;
    const customFetch = async (...args) => {
      try {
        return await givenFetch(...args);
      } catch (err2) {
        if (!(err2 instanceof Error) || !err2.message?.startsWith("fetch failed")) {
          console.warn("A request failed when using a custom fetch implementation; this may be a misconfiguration. Make sure that your fetch client is correctly bound to the global scope.");
          console.error(err2);
        }
        throw err2;
      }
    };
    Object.defineProperties(customFetch, {
      [CUSTOM_FETCH_MARKER]: {},
      name: { value: givenFetch.name },
      length: { value: givenFetch.length }
    });
    return customFetch;
  }
  try {
    if (typeof globalThis !== "undefined" && "fetch" in globalThis) return fetch.bind(globalThis);
  } catch (_err) {
  }
  if (typeof fetch !== "undefined") return fetch;
  return __require("cross-fetch");
};
const parseAsBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Boolean(value);
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "undefined") return;
    if (["true", "1"].includes(trimmed)) return true;
    return false;
  }
};
const devServerAvailable = async (host = defaultDevServerHost, fetch2) => {
  try {
    await (await fetch2(devServerUrl(host, "/dev").toString())).json();
    return true;
  } catch (_e) {
    return false;
  }
};
const devServerUrl = (host = devServerHost$1(), pathname = "") => {
  return new URL(pathname, host.includes("://") ? host : `http://${host}`);
};
const devServerHost$1 = () => devServerHost() || defaultDevServerHost;
const enumFromValue = (enumType2, value) => {
  if (Object.values(enumType2).includes(value)) return value;
};
const { hmac, sha256 } = hashjs;
let hasLoggedCryptoImplementation = false;
async function fetchWithAuthFallback({ authToken, authTokenFallback, fetch: fetch2, options, url }) {
  let res = await fetch2(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${authToken}`
    }
  });
  if ([401, 403].includes(res.status) && authTokenFallback) res = await fetch2(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${authTokenFallback}`
    }
  });
  return res;
}
function signWithHashJs(data, signingKey, ts) {
  const encoded = typeof data === "string" ? data : canonicalize(data);
  return hmac(sha256, removeSigningKeyPrefix(signingKey)).update(encoded).update(ts).digest("hex");
}
const cryptoKeyCache = /* @__PURE__ */ new Map();
async function signWithNative(subtle, data, signingKey, ts) {
  const encoded = typeof data === "string" ? data : canonicalize(data);
  const key = removeSigningKeyPrefix(signingKey);
  let cryptoKey = cryptoKeyCache.get(key);
  if (!cryptoKey) {
    cryptoKey = await subtle.importKey("raw", new TextEncoder().encode(key), {
      name: "HMAC",
      hash: "SHA-256"
    }, false, ["sign"]);
    cryptoKeyCache.set(key, cryptoKey);
  }
  const signature = await subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(encoded + ts));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function signDataWithKey(data, signingKey, ts) {
  const subtle = globalThis.crypto?.subtle;
  if (!hasLoggedCryptoImplementation) {
    hasLoggedCryptoImplementation = true;
    if (subtle) console.debug("[inngest] Using native Web Crypto for request signing");
    else console.debug("[inngest] Using hash.js fallback for request signing (native crypto unavailable)");
  }
  if (subtle) try {
    return await signWithNative(subtle, data, signingKey, ts);
  } catch (error) {
    console.debug("[inngest] Native crypto failed, falling back to hash.js:", error);
  }
  return signWithHashJs(data, signingKey, ts);
}
var ServerTiming = class {
  timings = {};
  /**
  * Start a timing. Returns a function that, when called, will stop the timing
  * and add it to the header.
  */
  start(name, description) {
    if (!this.timings[name]) this.timings[name] = {
      description: description ?? "",
      timers: []
    };
    const index = this.timings[name].timers.push({ start: Date.now() }) - 1;
    return () => {
      const target = this.timings[name];
      if (!target) return console.warn(`Timing "${name}" does not exist`);
      const timer = target.timers[index];
      if (!timer) return console.warn(`Timer ${index} for timing "${name}" does not exist`);
      timer.end = Date.now();
    };
  }
  /**
  * Add a piece of arbitrary, untimed information to the header. Common use
  * cases would be cache misses.
  *
  * @example
  * ```
  * timer.append("cache", "miss");
  * ```
  */
  append(key, value) {
    this.timings[key] = {
      description: value,
      timers: []
    };
  }
  /**
  * Wrap a function in a timing. The timing will be stopped and added to the
  * header when the function resolves or rejects.
  *
  * The return value of the function will be returned from this function.
  */
  async wrap(name, fn, description) {
    const stop = this.start(name, description);
    try {
      return await runAsPromise(fn);
    } finally {
      stop();
    }
  }
  /**
  * Generate the `Server-Timing` header.
  */
  getHeader() {
    return Object.entries(this.timings).reduce((acc, [name, { description, timers }]) => {
      if (!timers.some((timer) => timer.end)) return acc;
      const dur = timers.reduce((acc$1, { start, end }) => {
        if (!start || !end) return acc$1;
        return acc$1 + (end - start);
      }, 0);
      const entry = [
        name,
        description ? `desc="${description}"` : "",
        dur ? `dur=${dur}` : ""
      ].filter(Boolean).join(";");
      return [...acc, entry];
    }, []).join(", ");
  }
};
const createStream = (opts) => {
  let passFinalize;
  const finalizeP = new Promise((resolve) => {
    passFinalize = resolve;
  });
  const interval = 3e3;
  const value = " ";
  return new Promise(async (resolve, reject) => {
    try {
      resolve({
        stream: new ReadableStream({ start(controller) {
          const encoder = new TextEncoder();
          const heartbeat = setInterval(() => {
            controller.enqueue(encoder.encode(value));
          }, interval);
          const finalize = (data) => {
            clearInterval(heartbeat);
            Promise.resolve(data).then((resolvedData) => {
              controller.enqueue(encoder.encode(stringify$1(resolvedData)));
              controller.close();
            });
          };
          passFinalize(finalize);
        } }),
        finalize: await finalizeP
      });
    } catch (err2) {
      reject(err2);
    }
  });
};
const registerResSchema = objectType({
  status: numberType().default(200),
  skipped: booleanType().optional().default(false),
  modified: booleanType().optional().default(false),
  error: stringType().default("Successfully registered")
});
var InngestCommHandler = class {
  /**
  * The ID of this serve handler, e.g. `"my-app"`. It's recommended that this
  * value represents the overarching app/service that this set of functions is
  * being served from.
  */
  id;
  /**
  * The handler specified during instantiation of the class.
  */
  handler;
  /**
  * The URL of the Inngest function registration endpoint.
  */
  inngestRegisterUrl;
  /**
  * The name of the framework this handler is designed for. Should be
  * lowercase, alphanumeric characters inclusive of `-` and `/`.
  */
  frameworkName;
  /**
  * The signing key used to validate requests from Inngest. This is
  * intentionally mutable so that we can pick up the signing key from the
  * environment during execution if needed.
  */
  signingKey;
  /**
  * The same as signingKey, except used as a fallback when auth fails using the
  * primary signing key.
  */
  signingKeyFallback;
  /**
  * A property that can be set to indicate whether we believe we are in
  * production mode.
  *
  * Should be set every time a request is received.
  */
  _mode;
  /**
  * The localized `fetch` implementation used by this handler.
  */
  fetch;
  /**
  * The host used to access the Inngest serve endpoint, e.g.:
  *
  *     "https://myapp.com"
  *
  * By default, the library will try to infer this using request details such
  * as the "Host" header and request path, but sometimes this isn't possible
  * (e.g. when running in a more controlled environments such as AWS Lambda or
  * when dealing with proxies/redirects).
  *
  * Provide the custom hostname here to ensure that the path is reported
  * correctly when registering functions with Inngest.
  *
  * To also provide a custom path, use `servePath`.
  */
  _serveHost;
  /**
  * The path to the Inngest serve endpoint. e.g.:
  *
  *     "/some/long/path/to/inngest/endpoint"
  *
  * By default, the library will try to infer this using request details such
  * as the "Host" header and request path, but sometimes this isn't possible
  * (e.g. when running in a more controlled environments such as AWS Lambda or
  * when dealing with proxies/redirects).
  *
  * Provide the custom path (excluding the hostname) here to ensure that the
  * path is reported correctly when registering functions with Inngest.
  *
  * To also provide a custom hostname, use `serveHost`.
  */
  _servePath;
  /**
  * The minimum level to log from the Inngest serve handler.
  */
  logLevel;
  streaming;
  /**
  * A private collection of just Inngest functions, as they have been passed
  * when instantiating the class.
  */
  rawFns;
  client;
  /**
  * A private collection of functions that are being served. This map is used
  * to find and register functions when interacting with Inngest Cloud.
  */
  fns = {};
  env = getProcessEnv();
  allowExpiredSignatures;
  _options;
  skipSignatureValidation;
  constructor(options) {
    this._options = options;
    if (Object.hasOwn(options, "eventKey")) throw new Error(`${logPrefix} You've passed an Inngest client as the first argument to your serve handler. This is no longer supported in v3; please pass the Inngest client as the \`client\` property of an options object instead. See https://www.inngest.com/docs/sdk/migration`);
    this.frameworkName = options.frameworkName;
    this.client = options.client;
    if (options.id) console.warn(`${logPrefix} The \`id\` serve option is deprecated and will be removed in v4`);
    this.id = options.id || this.client.id;
    this.handler = options.handler;
    this.allowExpiredSignatures = Boolean(arguments["0"]?.__testingAllowExpiredSignatures);
    this.rawFns = options.functions?.filter(Boolean) ?? [];
    if (this.rawFns.length !== (options.functions ?? []).length) console.warn(`Some functions passed to serve() are undefined and misconfigured.  Please check your imports.`);
    this.fns = this.rawFns.reduce((acc, fn) => {
      const configs = fn["getConfig"]({
        baseUrl: new URL("https://example.com"),
        appPrefix: this.id
      });
      const fns = configs.reduce((acc$1, { id }, index) => {
        return {
          ...acc$1,
          [id]: {
            fn,
            onFailure: Boolean(index)
          }
        };
      }, {});
      configs.forEach(({ id }) => {
        if (acc[id]) throw new Error(`Duplicate function ID "${id}"; please change a function's name or provide an explicit ID to avoid conflicts.`);
      });
      return {
        ...acc,
        ...fns
      };
    }, {});
    this.inngestRegisterUrl = new URL("/fn/register", this.apiBaseUrl);
    this.signingKey = options.signingKey;
    this.signingKeyFallback = options.signingKeyFallback;
    this._serveHost = options.serveHost || this.env[envKeys.InngestServeHost];
    this._servePath = options.servePath || this.env[envKeys.InngestServePath];
    this.skipSignatureValidation = options.skipSignatureValidation || false;
    const defaultLogLevel = "info";
    this.logLevel = enumType(logLevels).default(defaultLogLevel).catch((ctx) => {
      this.log("warn", `Unknown log level passed: ${String(ctx.input)}; defaulting to ${defaultLogLevel}`);
      return defaultLogLevel;
    }).parse(options.logLevel || this.env[envKeys.InngestLogLevel]);
    if (this.logLevel === "debug") {
      if (debug.enable && typeof debug.enable === "function") debug.enable(`${debugPrefix}:*`);
    }
    const defaultStreamingOption = false;
    this.streaming = unionType([enumType(["allow", "force"]), literalType(false)]).default(defaultStreamingOption).catch((ctx) => {
      this.log("warn", `Unknown streaming option passed: ${String(ctx.input)}; defaulting to ${String(defaultStreamingOption)}`);
      return defaultStreamingOption;
    }).parse(options.streaming || this.env[envKeys.InngestStreaming]);
    this.fetch = options.fetch ? getFetch(options.fetch) : this.client["fetch"];
  }
  /**
  * Get the API base URL for the Inngest API.
  *
  * This is a getter to encourage checking the environment for the API base URL
  * each time it's accessed, as it may change during execution.
  */
  get apiBaseUrl() {
    return this._options.baseUrl || this.env[envKeys.InngestApiBaseUrl] || this.env[envKeys.InngestBaseUrl] || this.client.apiBaseUrl || defaultInngestApiBaseUrl;
  }
  /**
  * Get the event API base URL for the Inngest API.
  *
  * This is a getter to encourage checking the environment for the event API
  * base URL each time it's accessed, as it may change during execution.
  */
  get eventApiBaseUrl() {
    return this._options.baseUrl || this.env[envKeys.InngestEventApiBaseUrl] || this.env[envKeys.InngestBaseUrl] || this.client.eventBaseUrl || defaultInngestEventBaseUrl;
  }
  /**
  * The host used to access the Inngest serve endpoint, e.g.:
  *
  *     "https://myapp.com"
  *
  * By default, the library will try to infer this using request details such
  * as the "Host" header and request path, but sometimes this isn't possible
  * (e.g. when running in a more controlled environments such as AWS Lambda or
  * when dealing with proxies/redirects).
  *
  * Provide the custom hostname here to ensure that the path is reported
  * correctly when registering functions with Inngest.
  *
  * To also provide a custom path, use `servePath`.
  */
  get serveHost() {
    return this._serveHost || this.env[envKeys.InngestServeHost];
  }
  /**
  * The path to the Inngest serve endpoint. e.g.:
  *
  *     "/some/long/path/to/inngest/endpoint"
  *
  * By default, the library will try to infer this using request details such
  * as the "Host" header and request path, but sometimes this isn't possible
  * (e.g. when running in a more controlled environments such as AWS Lambda or
  * when dealing with proxies/redirects).
  *
  * Provide the custom path (excluding the hostname) here to ensure that the
  * path is reported correctly when registering functions with Inngest.
  *
  * To also provide a custom hostname, use `serveHost`.
  *
  * This is a getter to encourage checking the environment for the serve path
  * each time it's accessed, as it may change during execution.
  */
  get servePath() {
    return this._servePath || this.env[envKeys.InngestServePath];
  }
  get hashedEventKey() {
    if (!this.client["eventKey"] || this.client["eventKey"] === dummyEventKey) return;
    return hashEventKey(this.client["eventKey"]);
  }
  get hashedSigningKey() {
    if (!this.signingKey) return;
    return hashSigningKey(this.signingKey);
  }
  get hashedSigningKeyFallback() {
    if (!this.signingKeyFallback) return;
    return hashSigningKey(this.signingKeyFallback);
  }
  /**
  * Returns a `boolean` representing whether this handler will stream responses
  * or not. Takes into account the user's preference and the platform's
  * capabilities.
  */
  async shouldStream(actions) {
    if (await actions.queryStringWithDefaults("testing for probe", queryKeys.Probe) !== void 0) return false;
    if (!actions.transformStreamingResponse) return false;
    if (this.streaming === "force") return true;
    return this.streaming === "allow" && platformSupportsStreaming(this.frameworkName, this.env);
  }
  async isInngestReq(actions) {
    const reqMessage = `checking if this is an Inngest request`;
    const [runId, signature] = await Promise.all([actions.headers(reqMessage, headerKeys.InngestRunId), actions.headers(reqMessage, headerKeys.Signature)]);
    return Boolean(runId && typeof signature === "string");
  }
  /**
  * Start handling a request, setting up environments, modes, and returning
  * some helpers.
  */
  async initRequest(...args) {
    const timer = new ServerTiming();
    const actions = await this.getActions(timer, ...args);
    const [env, expectedServerKind] = await Promise.all([actions.env?.("starting to handle request"), actions.headers("checking expected server kind", headerKeys.InngestServerKind)]);
    this.env = protectEnv({
      ...getProcessEnv(),
      ...env
    });
    const headerPromises = forwardedHeaders.map(async (header) => {
      return {
        header,
        value: await actions.headers(`fetching ${header} for forwarding`, header)
      };
    });
    const headersToForwardP = Promise.all(headerPromises).then((fetchedHeaders) => {
      return fetchedHeaders.reduce((acc, { header, value }) => {
        if (value) acc[header] = value;
        return acc;
      }, {});
    });
    const getHeaders = async () => ({
      ...inngestHeaders({
        env: this.env,
        framework: this.frameworkName,
        client: this.client,
        expectedServerKind: expectedServerKind || void 0,
        extras: { "Server-Timing": timer.getHeader() }
      }),
      ...await headersToForwardP
    });
    const assumedMode = getMode({
      env: this.env,
      client: this.client
    });
    if (assumedMode.isExplicit) this._mode = assumedMode;
    else {
      const serveIsProd = await actions.isProduction?.("starting to handle request");
      if (typeof serveIsProd === "boolean") this._mode = new Mode({
        type: serveIsProd ? "cloud" : "dev",
        isExplicit: false
      });
      else this._mode = assumedMode;
    }
    this.upsertKeysFromEnv();
    return {
      timer,
      actions,
      getHeaders
    };
  }
  /**
  * `createSyncHandler` should be used to return a type-equivalent version of
  * the `handler` specified during instantiation.
  */
  createSyncHandler() {
    return (handler) => {
      return this.wrapHandler((async (...args) => {
        const reqInit = await this.initRequest(...args);
        const fn = new InngestFunction(this.client, {
          id: this._options.syncOptions?.functionId ?? "",
          retries: this._options.syncOptions?.retries ?? defaultMaxRetries
        }, () => handler(...args));
        if (await this.isInngestReq(reqInit.actions)) return this.handleAsyncRequest({
          ...reqInit,
          forceExecution: true,
          args,
          fns: [fn]
        });
        return this.handleSyncRequest({
          ...reqInit,
          args,
          asyncMode: this._options.syncOptions?.asyncResponse ?? AsyncResponseType.Redirect,
          asyncRedirectUrl: this._options.syncOptions?.asyncRedirectUrl,
          fn
        });
      }));
    };
  }
  /**
  * `createHandler` should be used to return a type-equivalent version of the
  * `handler` specified during instantiation.
  *
  * @example
  * ```
  * // my-custom-handler.ts
  * import {
  *   InngestCommHandler,
  *   type ServeHandlerOptions,
  * } from "./components/InngestCommHandler";
  *
  * export const serve = (options: ServeHandlerOptions) => {
  *   const handler = new InngestCommHandler({
  *     frameworkName: "my-custom-handler",
  *     ...options,
  *     handler: (req: Request) => {
  *       return {
  *         body: () => req.json(),
  *         headers: (key) => req.headers.get(key),
  *         method: () => req.method,
  *         url: () => new URL(req.url, `https://${req.headers.get("host") || ""}`),
  *         transformResponse: ({ body, status, headers }) => {
  *           return new Response(body, { status, headers });
  *         },
  *       };
  *     },
  *   });
  *
  *   return handler.createHandler();
  * };
  * ```
  */
  createHandler() {
    return this.wrapHandler((async (...args) => {
      return this.handleAsyncRequest({
        ...await this.initRequest(...args),
        args
      });
    }));
  }
  /**
  * Given a set of actions that let us access the incoming request, create an
  * event that repesents a run starting from an HTTP request.
  */
  async createHttpEvent(actions, fn) {
    const reason = "creating sync event";
    const contentTypePromise = actions.headers(reason, headerKeys.ContentType).then((v) => v ?? "");
    const ipPromise = actions.headers(reason, headerKeys.ForwardedFor).then((v) => {
      if (v) return v;
      return actions.headers(reason, headerKeys.RealIp).then((v$1) => v$1 ?? "");
    });
    const methodPromise = actions.method(reason);
    const urlPromise = actions.url(reason).then((v) => this.reqUrl(v));
    const domainPromise = urlPromise.then((url) => `${url.protocol}//${url.host}`);
    const pathPromise = urlPromise.then((url) => url.pathname);
    const queryParamsPromise = urlPromise.then((url) => url.searchParams.toString());
    const bodyPromise = actions.body(reason).then((body$1) => {
      return typeof body$1 === "string" ? body$1 : stringify$1(body$1);
    });
    const [contentType, domain, ip, method, path, queryParams, body] = await Promise.all([
      contentTypePromise,
      domainPromise,
      ipPromise,
      methodPromise,
      pathPromise,
      queryParamsPromise,
      bodyPromise
    ]);
    return {
      name: internalEvents.HttpRequest,
      data: {
        content_type: contentType,
        domain,
        ip,
        method,
        path,
        query_params: queryParams,
        body,
        fn: fn.id()
      }
    };
  }
  async handleSyncRequest({ timer, actions, fn, asyncMode, asyncRedirectUrl, args }) {
    if (!actions.experimentalTransformSyncResponse) throw new Error("This platform does not support synchronous Inngest function executions.");
    if (await getAsyncCtx()) throw new Error("We already seem to be in the context of an Inngest execution, but didn't expect to be. Did you already wrap this handler?");
    const { ulid } = await import("./ulid.mjs");
    const runId = ulid();
    const event = await this.createHttpEvent(actions, fn);
    const exeVersion = PREFERRED_CHECKPOINTING_EXECUTION_VERSION;
    const result = await fn["createExecution"]({
      version: exeVersion,
      partialOptions: {
        client: this.client,
        data: {
          runId,
          event,
          attempt: 0,
          events: [event],
          maxAttempts: fn.opts.retries ?? defaultMaxRetries
        },
        runId,
        headers: {},
        reqArgs: args,
        stepCompletionOrder: [],
        stepState: {},
        disableImmediateExecution: false,
        isFailureHandler: false,
        timer,
        createResponse: (data) => actions.experimentalTransformSyncResponse("creating sync execution", data).then((res) => ({
          ...res,
          version: exeVersion
        })),
        stepMode: StepMode.Sync
      }
    }).start();
    const resultHandler = {
      "step-not-found": () => {
        throw new Error("We should not get the result 'step-not-found' when checkpointing. This is a bug in the `inngest` SDK");
      },
      "steps-found": () => {
        throw new Error("We should not get the result 'steps-found' when checkpointing. This is a bug in the `inngest` SDK");
      },
      "step-ran": () => {
        throw new Error("We should not get the result 'step-ran' when checkpointing. This is a bug in the `inngest` SDK");
      },
      "function-rejected": (result$1) => {
        return actions.transformResponse("creating sync error response", {
          status: result$1.retriable ? 500 : 400,
          headers: {
            "Content-Type": "application/json",
            [headerKeys.NoRetry]: result$1.retriable ? "false" : "true",
            ...typeof result$1.retriable === "string" ? { [headerKeys.RetryAfter]: result$1.retriable } : {}
          },
          version: exeVersion,
          body: stringify$1(undefinedToNull(result$1.error))
        });
      },
      "function-resolved": ({ data }) => {
        return data;
      },
      "change-mode": async ({ token }) => {
        switch (asyncMode) {
          case AsyncResponseType.Redirect: {
            let redirectUrl;
            if (asyncRedirectUrl) if (typeof asyncRedirectUrl === "function") redirectUrl = await asyncRedirectUrl({
              runId,
              token
            });
            else {
              const baseUrl = await actions.url("getting request origin");
              const url = new URL(asyncRedirectUrl, baseUrl.origin);
              url.searchParams.set("runId", runId);
              url.searchParams.set("token", token);
              redirectUrl = url.toString();
            }
            else redirectUrl = await this.client["inngestApi"]["getTargetUrl"](`/v1/http/runs/${runId}/output?token=${token}`).then((url) => url.toString());
            return actions.transformResponse("creating sync->async redirect response", {
              status: 302,
              headers: { [headerKeys.Location]: redirectUrl },
              version: exeVersion,
              body: ""
            });
          }
          case AsyncResponseType.Token:
            return actions.transformResponse("creating sync->async token response", {
              status: 200,
              headers: {},
              version: exeVersion,
              body: stringify$1({
                run_id: runId,
                token
              })
            });
        }
        throw new Error("Not implemented: change-mode");
      }
    }[result.type];
    if (!resultHandler) throw new Error(`No handler for execution result type: ${result.type}. This is a bug in the \`inngest\` SDK`);
    return resultHandler(result);
  }
  async handleAsyncRequest({ timer, actions, args, getHeaders, forceExecution, fns }) {
    if (forceExecution && !actions.experimentalTransformSyncResponse) throw new Error("This platform does not support async executions in Inngest for APIs.");
    const methodP = actions.method("starting to handle request");
    const [signature, method, body] = await Promise.all([
      actions.headers("checking signature for request", headerKeys.Signature).then((headerSignature) => {
        return headerSignature ?? void 0;
      }),
      methodP,
      methodP.then(async (method$1) => {
        if (method$1 === "POST" || method$1 === "PUT") {
          const body$1 = await actions.body(`checking body for request signing as method is ${method$1}`);
          if (!body$1) return "";
          if (typeof body$1 === "string") return JSON.parse(body$1);
          return body$1;
        }
        return "";
      })
    ]);
    const signatureValidation = this.validateSignature(signature, body);
    const actionRes = timer.wrap("action", () => this.handleAction({
      actions,
      timer,
      getHeaders,
      reqArgs: args,
      signatureValidation,
      body,
      method,
      forceExecution: Boolean(forceExecution),
      fns
    }));
    const prepareActionRes = async (res) => {
      const headers = {
        ...await getHeaders(),
        ...res.headers,
        ...res.version === null ? {} : { [headerKeys.RequestVersion]: (res.version ?? PREFERRED_ASYNC_EXECUTION_VERSION).toString() }
      };
      let signature$1;
      try {
        signature$1 = await signatureValidation.then(async (result) => {
          if (!result.success || !result.keyUsed) return;
          return await this.getResponseSignature(result.keyUsed, res.body);
        });
      } catch (err2) {
        return {
          ...res,
          headers,
          body: stringify$1(serializeError$1(err2)),
          status: 500
        };
      }
      if (signature$1) headers[headerKeys.Signature] = signature$1;
      if (!(await signatureValidation).success) {
        const filteredHeaders = {};
        for (const [k, v] of Object.entries(headers)) {
          const lower = k.toLowerCase();
          if (lower === "user-agent" || lower.startsWith("x-inngest-") && lower !== headerKeys.SdkHandled.toLowerCase()) continue;
          filteredHeaders[k] = v;
        }
        return {
          ...res,
          headers: filteredHeaders
        };
      }
      return {
        ...res,
        headers
      };
    };
    if (await this.shouldStream(actions)) {
      if (await actions.method("starting streaming response") === "POST") {
        const { stream, finalize } = await createStream();
        actionRes.then((res) => {
          return finalize(prepareActionRes(res));
        });
        return timer.wrap("res", async () => {
          return actions.transformStreamingResponse?.("starting streaming response", {
            status: 201,
            headers: await getHeaders(),
            body: stream,
            version: null
          });
        });
      }
    }
    return timer.wrap("res", async () => {
      return actionRes.then(prepareActionRes).then((actionRes$1) => {
        return actions.transformResponse("sending back response", actionRes$1);
      });
    });
  }
  async getActions(timer, ...args) {
    const lastArg = args[args.length - 1];
    const actionOverrides = typeof lastArg === "object" && lastArg !== null && "actionOverrides" in lastArg && typeof lastArg["actionOverrides"] === "object" && lastArg["actionOverrides"] !== null ? lastArg["actionOverrides"] : {};
    const rawActions = {
      ...await timer.wrap("handler", () => this.handler(...args)).catch(rethrowError("Serve handler failed to run")),
      ...actionOverrides
    };
    const actions = {
      ...Object.entries(rawActions).reduce((acc, [key, value]) => {
        if (typeof value !== "function") return acc;
        return {
          ...acc,
          [key]: (reason, ...args$1) => {
            const errMessage = [`Failed calling \`${key}\` from serve handler`, reason].filter(Boolean).join(" when ");
            const fn = () => value(...args$1);
            return runAsPromise(fn).catch(rethrowError(errMessage)).catch((err2) => {
              this.log("error", err2);
              throw err2;
            });
          }
        };
      }, {}),
      queryStringWithDefaults: async (reason, key) => {
        const url = await actions.url(reason);
        return await actions.queryString?.(reason, key, url) || url.searchParams.get(key) || void 0;
      },
      ...actionOverrides
    };
    return actions;
  }
  wrapHandler(handler) {
    Object.defineProperties(handler, {
      name: { value: "InngestHandler" },
      length: { value: this.handler.length }
    });
    return handler;
  }
  get mode() {
    return this._mode;
  }
  set mode(m) {
    this._mode = m;
    if (m) this.client["mode"] = m;
  }
  /**
  * Given a set of functions to check if an action is available from the
  * instance's handler, enact any action that is found.
  *
  * This method can fetch varying payloads of data, but ultimately is the place
  * where _decisions_ are made regarding functionality.
  *
  * For example, if we find that we should be viewing the UI, this function
  * will decide whether the UI should be visible based on the payload it has
  * found (e.g. env vars, options, etc).
  */
  async handleAction({ actions, timer, getHeaders, reqArgs, signatureValidation, body: rawBody, method, forceExecution, fns }) {
    const isMissingBody = !rawBody;
    let body = rawBody;
    try {
      let url = await actions.url("starting to handle request");
      if (method === "POST" || forceExecution) {
        if (!forceExecution && isMissingBody) {
          this.log("error", "Missing body when executing, possibly due to missing request body middleware");
          return {
            status: 401,
            headers: { "Content-Type": "application/json" },
            body: stringify$1({ message: "Unauthorized" }),
            version: void 0
          };
        }
        const validationResult = await signatureValidation;
        if (!validationResult.success) {
          this.log("error", "Signature validation failed", validationResult.err);
          return {
            status: 401,
            headers: { "Content-Type": "application/json" },
            body: stringify$1({ message: "Unauthorized" }),
            version: void 0
          };
        }
        let fn;
        let fnId;
        if (forceExecution) {
          fn = fns?.length && fns[0] ? {
            fn: fns[0],
            onFailure: false
          } : Object.values(this.fns)[0];
          fnId = fn?.fn.id();
          let die = false;
          const dieHeader = await actions.headers("getting step plan force control for forced execution", headerKeys.InngestForceStepPlan);
          if (dieHeader) {
            const parsed = parseAsBoolean(dieHeader);
            if (typeof parsed === "boolean") die = parsed;
            else this.log("warn", `Received invalid value for ${headerKeys.InngestForceStepPlan} header: ${dieHeader}. Expected a boolean value. Defaulting to "false".`);
          }
          body = {
            event: {},
            events: [],
            steps: {},
            version: PREFERRED_ASYNC_EXECUTION_VERSION,
            sdkDecided: true,
            ctx: {
              attempt: 0,
              disable_immediate_execution: die,
              use_api: true,
              max_attempts: Infinity,
              run_id: await actions.headers("getting run ID for forced execution", headerKeys.InngestRunId),
              stack: {
                stack: [],
                current: 0
              }
            }
          };
        } else {
          const rawProbe = await actions.queryStringWithDefaults("testing for probe", queryKeys.Probe);
          if (rawProbe) {
            const probe$1 = enumFromValue(probe, rawProbe);
            if (!probe$1) return {
              status: 400,
              headers: { "Content-Type": "application/json" },
              body: stringify$1(serializeError$1(/* @__PURE__ */ new Error(`Unknown probe "${rawProbe}"`))),
              version: void 0
            };
            return { [probe.Trust]: () => ({
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: "",
              version: void 0
            }) }[probe$1]();
          }
          fnId = await actions.queryStringWithDefaults("processing run request", queryKeys.FnId);
          if (!fnId) throw new Error("No function ID found in async request");
          fn = this.fns[fnId];
        }
        if (typeof fnId === "undefined" || !fn) throw new Error("No function ID found in request");
        const stepId = await actions.queryStringWithDefaults("processing run request", queryKeys.StepId) || await actions.headers("processing run request", headerKeys.InngestStepId) || null;
        let headerReqVersion;
        try {
          const rawVersionHeader = await actions.headers("processing run request", headerKeys.RequestVersion);
          if (rawVersionHeader && Number.isFinite(Number(rawVersionHeader))) {
            const res = versionSchema.parse(Number(rawVersionHeader));
            if (!res.sdkDecided) headerReqVersion = res.version;
          }
        } catch {
        }
        const { version: version$1, result } = this.runStep({
          functionId: fnId,
          data: body,
          stepId,
          timer,
          reqArgs,
          headers: await getHeaders(),
          fn,
          forceExecution,
          actions,
          headerReqVersion
        });
        const stepOutput = await result;
        const opDataUndefinedToNull = (op) => {
          op.data = undefinedToNull(op.data);
          return op;
        };
        const handler = {
          "function-rejected": (result$1) => {
            return {
              status: result$1.retriable ? 500 : 400,
              headers: {
                "Content-Type": "application/json",
                [headerKeys.NoRetry]: result$1.retriable ? "false" : "true",
                ...typeof result$1.retriable === "string" ? { [headerKeys.RetryAfter]: result$1.retriable } : {}
              },
              body: stringify$1(undefinedToNull(result$1.error)),
              version: version$1
            };
          },
          "function-resolved": (result$1) => {
            if (forceExecution) {
              const runCompleteOp = {
                id: _internals.hashId("complete"),
                op: StepOpCode.RunComplete,
                data: undefinedToNull(result$1.data)
              };
              return {
                status: 206,
                headers: { "Content-Type": "application/json" },
                body: stringify$1(runCompleteOp),
                version: version$1
              };
            }
            return {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: stringify$1(undefinedToNull(result$1.data)),
              version: version$1
            };
          },
          "step-not-found": (result$1) => {
            let error = `Could not find step "${result$1.step.displayName || result$1.step.id}" to run; timed out.`;
            if (result$1.foundSteps.length > 0) {
              const foundStepsSummary = result$1.foundSteps.map((step2) => {
                return `${step2.displayName || step2.id} (${step2.id})`;
              }).join("\n");
              error = `${error} Found new steps: 
${foundStepsSummary}.`;
            }
            if (result$1.totalFoundSteps > result$1.foundSteps.length) error = `${error} (showing ${result$1.foundSteps.length} of ${result$1.totalFoundSteps})`;
            return {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                [headerKeys.NoRetry]: "false"
              },
              body: stringify$1({
                error,
                requestedStep: result$1.step.id,
                foundSteps: result$1.foundSteps,
                totalFoundSteps: result$1.totalFoundSteps
              }),
              version: version$1
            };
          },
          "step-ran": (result$1) => {
            const step2 = opDataUndefinedToNull(result$1.step);
            return {
              status: 206,
              headers: {
                "Content-Type": "application/json",
                ...typeof result$1.retriable !== "undefined" ? {
                  [headerKeys.NoRetry]: result$1.retriable ? "false" : "true",
                  ...typeof result$1.retriable === "string" ? { [headerKeys.RetryAfter]: result$1.retriable } : {}
                } : {}
              },
              body: stringify$1([step2]),
              version: version$1
            };
          },
          "steps-found": (result$1) => {
            const steps = result$1.steps.map(opDataUndefinedToNull);
            return {
              status: 206,
              headers: { "Content-Type": "application/json" },
              body: stringify$1(steps),
              version: version$1
            };
          },
          "change-mode": (result$1) => {
            return {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                [headerKeys.NoRetry]: "true"
              },
              body: stringify$1({ error: `We wanted to change mode to "${result$1.to}", but this is not supported within the InngestCommHandler. This is a bug in the Inngest SDK.` }),
              version: version$1
            };
          }
        }[stepOutput.type];
        try {
          return await handler(stepOutput);
        } catch (err2) {
          this.log("error", "Error handling execution result", err2);
          throw err2;
        }
      }
      const env = (await getHeaders())[headerKeys.Environment] ?? null;
      if (method === "GET") {
        const validationResult = await signatureValidation;
        if (!validationResult.success) {
          this.log("error", "Signature validation failed", validationResult.err);
          return {
            status: 401,
            headers: { "Content-Type": "application/json" },
            body: stringify$1({ message: "Unauthorized" }),
            version: void 0
          };
        }
        return {
          status: 200,
          body: stringify$1(await this.introspectionBody({
            actions,
            env,
            signatureValidation,
            url
          })),
          headers: { "Content-Type": "application/json" },
          version: void 0
        };
      }
      if (method === "PUT") {
        const [deployId, inBandSyncRequested] = await Promise.all([actions.queryStringWithDefaults("processing deployment request", queryKeys.DeployId).then((deployId$1) => {
          return deployId$1 === "undefined" ? void 0 : deployId$1;
        }), Promise.resolve(parseAsBoolean(this.env[envKeys.InngestAllowInBandSync])).then((allowInBandSync) => {
          if (allowInBandSync !== void 0 && !allowInBandSync) return syncKind.OutOfBand;
          return actions.headers("processing deployment request", headerKeys.InngestSyncKind);
        }).then((kind) => {
          return kind === syncKind.InBand;
        })]);
        if (inBandSyncRequested) {
          if (isMissingBody) {
            this.log("error", "Missing body when syncing, possibly due to missing request body middleware");
            return {
              status: 500,
              headers: { "Content-Type": "application/json" },
              body: stringify$1(serializeError$1(/* @__PURE__ */ new Error("Missing request body when syncing, possibly due to missing request body middleware"))),
              version: void 0
            };
          }
          if (!(await signatureValidation).success) return {
            status: 401,
            body: stringify$1({ code: "sig_verification_failed" }),
            headers: { "Content-Type": "application/json" },
            version: void 0
          };
          const res = inBandSyncRequestBodySchema.safeParse(body);
          if (!res.success) return {
            status: 400,
            body: stringify$1({
              code: "invalid_request",
              message: res.error.message
            }),
            headers: { "Content-Type": "application/json" },
            version: void 0
          };
          url = this.reqUrl(new URL(res.data.url));
          return {
            status: 200,
            body: stringify$1(await this.inBandRegisterBody({
              actions,
              deployId,
              env,
              signatureValidation,
              url
            })),
            headers: {
              "Content-Type": "application/json",
              [headerKeys.InngestSyncKind]: syncKind.InBand
            },
            version: void 0
          };
        }
        const { status, message, modified } = await this.register(this.reqUrl(url), deployId, getHeaders);
        return {
          status,
          body: stringify$1({
            message,
            modified
          }),
          headers: {
            "Content-Type": "application/json",
            [headerKeys.InngestSyncKind]: syncKind.OutOfBand
          },
          version: void 0
        };
      }
    } catch (err2) {
      return {
        status: 500,
        body: stringify$1({
          type: "internal",
          ...serializeError$1(err2)
        }),
        headers: { "Content-Type": "application/json" },
        version: void 0
      };
    }
    this.log("error", `Received unhandled HTTP method "${method}" (type: ${typeof method}); expected POST, PUT, or GET`);
    return {
      status: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
      version: void 0
    };
  }
  runStep({ actions, functionId, stepId, data, timer, reqArgs, headers, fn, forceExecution, headerReqVersion }) {
    if (!fn) throw new Error(`Could not find function with ID "${functionId}"`);
    const immediateFnData = parseFnData(data, headerReqVersion);
    let { version: version$1, sdkDecided } = immediateFnData;
    if (version$1 === ExecutionVersion.V1 && sdkDecided && fn.fn["shouldOptimizeParallelism"]?.()) version$1 = ExecutionVersion.V2;
    const result = runAsPromise(async () => {
      const anyFnData = await fetchAllFnData({
        data: immediateFnData,
        api: this.client["inngestApi"],
        version: version$1
      });
      if (!anyFnData.ok) throw new Error(anyFnData.error);
      const createResponse = forceExecution && actions.experimentalTransformSyncResponse ? (data$1) => actions.experimentalTransformSyncResponse("created sync->async response", data$1).then((res) => ({
        ...res,
        version: version$1
      })) : void 0;
      const executionOptions = await (/* @__PURE__ */ ((s) => s)({
        [ExecutionVersion.V0]: ({ event, events, steps, ctx, version: version$2 }) => {
          const stepState = Object.entries(steps ?? {}).reduce((acc, [id, data$1]) => {
            return {
              ...acc,
              [id]: {
                id,
                data: data$1
              }
            };
          }, {});
          return {
            version: version$2,
            partialOptions: {
              client: this.client,
              runId: ctx?.run_id || "",
              stepMode: StepMode.Async,
              data: {
                event,
                events,
                runId: ctx?.run_id || "",
                attempt: ctx?.attempt ?? 0
              },
              stepState,
              requestedRunStep: stepId === "step" ? void 0 : stepId || void 0,
              timer,
              isFailureHandler: fn.onFailure,
              stepCompletionOrder: ctx?.stack?.stack ?? [],
              reqArgs,
              headers,
              createResponse
            }
          };
        },
        [ExecutionVersion.V1]: ({ event, events, steps, ctx, version: version$2 }) => {
          const stepState = Object.entries(steps ?? {}).reduce((acc, [id, result$1]) => {
            return {
              ...acc,
              [id]: result$1.type === "data" ? {
                id,
                data: result$1.data
              } : result$1.type === "input" ? {
                id,
                input: result$1.input
              } : {
                id,
                error: result$1.error
              }
            };
          }, {});
          const requestedRunStep = stepId === "step" ? void 0 : stepId || void 0;
          const checkpointingConfig = fn.fn["shouldAsyncCheckpoint"](requestedRunStep, ctx?.fn_id, Boolean(ctx?.disable_immediate_execution));
          return {
            version: checkpointingConfig && sdkDecided ? ExecutionVersion.V2 : version$2,
            partialOptions: {
              client: this.client,
              runId: ctx?.run_id || "",
              stepMode: checkpointingConfig ? StepMode.AsyncCheckpointing : StepMode.Async,
              checkpointingConfig,
              data: {
                event,
                events,
                runId: ctx?.run_id || "",
                attempt: ctx?.attempt ?? 0,
                maxAttempts: ctx?.max_attempts
              },
              internalFnId: ctx?.fn_id,
              queueItemId: ctx?.qi_id,
              stepState,
              requestedRunStep,
              timer,
              isFailureHandler: fn.onFailure,
              disableImmediateExecution: ctx?.disable_immediate_execution,
              stepCompletionOrder: ctx?.stack?.stack ?? [],
              reqArgs,
              headers,
              createResponse
            }
          };
        },
        [ExecutionVersion.V2]: ({ event, events, steps, ctx, version: version$2 }) => {
          const stepState = Object.entries(steps ?? {}).reduce((acc, [id, result$1]) => {
            return {
              ...acc,
              [id]: result$1.type === "data" ? {
                id,
                data: result$1.data
              } : result$1.type === "input" ? {
                id,
                input: result$1.input
              } : {
                id,
                error: result$1.error
              }
            };
          }, {});
          const requestedRunStep = stepId === "step" ? void 0 : stepId || void 0;
          const checkpointingConfig = fn.fn["shouldAsyncCheckpoint"](requestedRunStep, ctx?.fn_id, Boolean(ctx?.disable_immediate_execution));
          return {
            version: version$2,
            partialOptions: {
              client: this.client,
              runId: ctx?.run_id || "",
              stepMode: checkpointingConfig ? StepMode.AsyncCheckpointing : StepMode.Async,
              checkpointingConfig,
              data: {
                event,
                events,
                runId: ctx?.run_id || "",
                attempt: ctx?.attempt ?? 0,
                maxAttempts: ctx?.max_attempts
              },
              internalFnId: ctx?.fn_id,
              queueItemId: ctx?.qi_id,
              stepState,
              requestedRunStep,
              timer,
              isFailureHandler: fn.onFailure,
              disableImmediateExecution: ctx?.disable_immediate_execution,
              stepCompletionOrder: ctx?.stack?.stack ?? [],
              reqArgs,
              headers,
              createResponse
            }
          };
        }
      }))[version$1](anyFnData.value);
      return fn.fn["createExecution"](executionOptions).start();
    });
    return {
      version: version$1,
      result
    };
  }
  configs(url) {
    const configs = Object.values(this.rawFns).reduce((acc, fn) => [...acc, ...fn["getConfig"]({
      baseUrl: url,
      appPrefix: this.id
    })], []);
    for (const config of configs) {
      const check = functionConfigSchema.safeParse(config);
      if (!check.success) {
        const errors = check.error.errors.map((err2) => err2.message).join("; ");
        this.log("warn", `Config invalid for function "${config.id}" : ${errors}`);
      }
    }
    return configs;
  }
  /**
  * Return an Inngest serve endpoint URL given a potential `path` and `host`.
  *
  * Will automatically use the `serveHost` and `servePath` if they have been
  * set when registering.
  */
  reqUrl(url) {
    let ret = new URL(url);
    const serveHost = this.serveHost || this.env[envKeys.InngestServeHost];
    const servePath = this.servePath || this.env[envKeys.InngestServePath];
    if (servePath) ret.pathname = servePath;
    if (serveHost) ret = new URL(ret.pathname + ret.search, serveHost);
    return ret;
  }
  registerBody({ url, deployId }) {
    return {
      url: url.href,
      deployType: "ping",
      framework: this.frameworkName,
      appName: this.id,
      functions: this.configs(url),
      sdk: `js:v${version}`,
      v: "0.1",
      deployId: deployId || void 0,
      capabilities: {
        trust_probe: "v1",
        connect: "v1"
      },
      appVersion: this.client.appVersion
    };
  }
  async inBandRegisterBody({ actions, deployId, env, signatureValidation, url }) {
    const registerBody = this.registerBody({
      deployId,
      url
    });
    const introspectionBody = await this.introspectionBody({
      actions,
      env,
      signatureValidation,
      url
    });
    const body = {
      app_id: this.id,
      appVersion: this.client.appVersion,
      capabilities: registerBody.capabilities,
      env,
      framework: registerBody.framework,
      functions: registerBody.functions,
      inspection: introspectionBody,
      platform: getPlatformName({
        ...getProcessEnv(),
        ...this.env
      }),
      sdk_author: "inngest",
      sdk_language: "",
      sdk_version: "",
      sdk: registerBody.sdk,
      url: registerBody.url
    };
    if ("authentication_succeeded" in introspectionBody && introspectionBody.authentication_succeeded) {
      body.sdk_language = introspectionBody.sdk_language;
      body.sdk_version = introspectionBody.sdk_version;
    }
    return body;
  }
  async introspectionBody({ actions, env, signatureValidation, url }) {
    const registerBody = this.registerBody({
      url: this.reqUrl(url),
      deployId: null
    });
    if (!this._mode) throw new Error("No mode set; cannot introspect without mode");
    let introspection = {
      extra: { is_mode_explicit: this._mode.isExplicit },
      has_event_key: this.client["eventKeySet"](),
      has_signing_key: Boolean(this.signingKey),
      function_count: registerBody.functions.length,
      mode: this._mode.type,
      schema_version: "2024-05-24"
    };
    if (this._mode.type === "cloud") try {
      if (!(await signatureValidation).success) throw new Error("Signature validation failed");
      let signingKeyHash = null;
      if (this.hashedSigningKey) signingKeyHash = removeSigningKeyPrefix(this.hashedSigningKey).slice(0, 12);
      let signingKeyFallbackHash = null;
      if (this.hashedSigningKeyFallback) signingKeyFallbackHash = removeSigningKeyPrefix(this.hashedSigningKeyFallback).slice(0, 12);
      introspection = {
        ...introspection,
        authentication_succeeded: true,
        api_origin: this.apiBaseUrl,
        app_id: this.id,
        capabilities: {
          trust_probe: "v1",
          connect: "v1"
        },
        env,
        event_api_origin: this.eventApiBaseUrl,
        event_key_hash: this.hashedEventKey ?? null,
        extra: {
          ...introspection.extra,
          is_streaming: await this.shouldStream(actions),
          native_crypto: globalThis.crypto?.subtle ? true : false
        },
        framework: this.frameworkName,
        sdk_language: "js",
        sdk_version: version,
        serve_origin: this.serveHost ?? null,
        serve_path: this.servePath ?? null,
        signing_key_fallback_hash: signingKeyFallbackHash,
        signing_key_hash: signingKeyHash
      };
    } catch {
      introspection = { ...introspection };
    }
    return introspection;
  }
  async register(url, deployId, getHeaders) {
    const body = this.registerBody({
      url,
      deployId
    });
    let res;
    let registerURL = new URL(this.inngestRegisterUrl.href);
    if (this._mode && this._mode.isInferred && this._mode.isDev) {
      const host = devServerHost(this.env);
      if (await devServerAvailable(host, this.fetch)) registerURL = devServerUrl(host, "/fn/register");
    } else if (this._mode?.explicitDevUrl) registerURL = devServerUrl(this._mode.explicitDevUrl.href, "/fn/register");
    if (deployId) registerURL.searchParams.set(queryKeys.DeployId, deployId);
    try {
      res = await fetchWithAuthFallback({
        authToken: this.hashedSigningKey,
        authTokenFallback: this.hashedSigningKeyFallback,
        fetch: this.fetch,
        url: registerURL.href,
        options: {
          method: "POST",
          body: stringify$1(body),
          headers: {
            ...await getHeaders(),
            [headerKeys.InngestSyncKind]: syncKind.OutOfBand
          },
          redirect: "follow"
        }
      });
    } catch (err2) {
      this.log("error", err2);
      return {
        status: 500,
        message: `Failed to register${err2 instanceof Error ? `; ${err2.message}` : ""}`,
        modified: false
      };
    }
    const raw = await res.text();
    let data = {};
    try {
      data = JSON.parse(raw);
    } catch (err2) {
      this.log("warn", "Couldn't unpack register response:", err2);
      let message = "Failed to register";
      if (err2 instanceof Error) message += `; ${err2.message}`;
      message += `; status code: ${res.status}`;
      return {
        status: 500,
        message,
        modified: false
      };
    }
    let status;
    let error;
    let skipped;
    let modified;
    try {
      ({ status, error, skipped, modified } = registerResSchema.parse(data));
    } catch (err2) {
      this.log("warn", "Invalid register response schema:", err2);
      let message = "Failed to register";
      if (err2 instanceof Error) message += `; ${err2.message}`;
      message += `; status code: ${res.status}`;
      return {
        status: 500,
        message,
        modified: false
      };
    }
    if (!skipped) this.log("debug", "registered inngest functions:", res.status, res.statusText, data);
    return {
      status,
      message: error,
      modified
    };
  }
  /**
  * Given an environment, upsert any missing keys. This is useful in
  * situations where environment variables are passed directly to handlers or
  * are otherwise difficult to access during initialization.
  */
  upsertKeysFromEnv() {
    if (!this.signingKey && this.env[envKeys.InngestSigningKey]) this.signingKey = String(this.env[envKeys.InngestSigningKey]);
    if (this.signingKey) this.client["inngestApi"].setSigningKey(this.signingKey);
    if (!this.signingKeyFallback && this.env[envKeys.InngestSigningKeyFallback]) this.signingKeyFallback = String(this.env[envKeys.InngestSigningKeyFallback]);
    if (this.signingKeyFallback) this.client["inngestApi"].setSigningKeyFallback(this.signingKeyFallback);
    if (!this.client["eventKeySet"]() && this.env[envKeys.InngestEventKey]) this.client.setEventKey(String(this.env[envKeys.InngestEventKey]));
    if (this.env[envKeys.InngestDevServerUrl]) this.log("warn", `Use of ${envKeys.InngestDevServerUrl} has been deprecated in v3; please use ${envKeys.InngestBaseUrl} instead. See https://www.inngest.com/docs/sdk/migration`);
  }
  /**
  * Validate the signature of a request and return the signing key used to
  * validate it.
  */
  async validateSignature(sig, body) {
    try {
      if (this.skipSignatureValidation) return {
        success: true,
        keyUsed: ""
      };
      if (this._mode && !this._mode.isCloud) return {
        success: true,
        keyUsed: ""
      };
      if (!this.signingKey) throw new Error(`No signing key found in client options or ${envKeys.InngestSigningKey} env var. Find your keys at https://app.inngest.com/secrets`);
      if (!sig) throw new Error(`No ${headerKeys.Signature} provided`);
      return {
        success: true,
        keyUsed: await new RequestSignature(sig).verifySignature({
          body,
          allowExpiredSignatures: this.allowExpiredSignatures,
          signingKey: this.signingKey,
          signingKeyFallback: this.signingKeyFallback
        })
      };
    } catch (err2) {
      return {
        success: false,
        err: err2
      };
    }
  }
  async getResponseSignature(key, body) {
    const now = Math.round(Date.now() / 1e3);
    return `t=${now}&s=${await signDataWithKey(body, key, now.toString())}`;
  }
  /**
  * Log to stdout/stderr if the log level is set to include the given level.
  * The default log level is `"info"`.
  *
  * This is an abstraction over `console.log` and will try to use the correct
  * method for the given log level.  For example, `log("error", "foo")` will
  * call `console.error("foo")`.
  */
  log(level, ...args) {
    const logLevels$1 = [
      "debug",
      "info",
      "warn",
      "error",
      "fatal",
      "silent"
    ];
    const logLevelSetting = logLevels$1.indexOf(this.logLevel);
    if (logLevels$1.indexOf(level) >= logLevelSetting) {
      let logger = console.log;
      if (Object.hasOwn(console, level)) logger = console[level];
      logger(`${logPrefix} ${level} -`, ...args);
    }
  }
};
var RequestSignature = class {
  timestamp;
  signature;
  constructor(sig) {
    const params = new URLSearchParams(sig);
    this.timestamp = params.get("t") || "";
    this.signature = params.get("s") || "";
    if (!this.timestamp || !this.signature) throw new Error(`Invalid ${headerKeys.Signature} provided`);
  }
  hasExpired(allowExpiredSignatures) {
    if (allowExpiredSignatures) return false;
    const ts = Number.parseInt(this.timestamp, 10);
    if (!Number.isFinite(ts)) return true;
    const delta = Date.now() - ts * 1e3;
    return Math.abs(delta) > 1e3 * 60 * 5;
  }
  async #verifySignature({ body, signingKey, allowExpiredSignatures }) {
    if (this.hasExpired(allowExpiredSignatures)) throw new Error("Signature has expired");
    if (!timingSafeEqual(await signDataWithKey(body, signingKey, this.timestamp), this.signature)) throw new Error("Invalid signature");
  }
  async verifySignature({ body, signingKey, signingKeyFallback, allowExpiredSignatures }) {
    try {
      await this.#verifySignature({
        body,
        signingKey,
        allowExpiredSignatures
      });
      return signingKey;
    } catch (err2) {
      if (!signingKeyFallback) throw err2;
      await this.#verifySignature({
        body,
        signingKey: signingKeyFallback,
        allowExpiredSignatures
      });
      return signingKeyFallback;
    }
  }
};
var DefaultLogger = class {
  info(...args) {
    console.info(...args);
  }
  warn(...args) {
    console.warn(...args);
  }
  error(...args) {
    console.error(...args);
  }
  debug(...args) {
    console.debug(...args);
  }
};
var ProxyLogger = class {
  logger;
  enabled = false;
  constructor(logger) {
    this.logger = logger;
    return new Proxy(this, { get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver);
      return Reflect.get(target.logger, prop, receiver);
    } });
  }
  info(...args) {
    if (!this.enabled) return;
    this.logger.info(...args);
  }
  warn(...args) {
    if (!this.enabled) return;
    this.logger.warn(...args);
  }
  error(...args) {
    if (!this.enabled) return;
    this.logger.error(...args);
  }
  debug(...args) {
    if (!this.enabled || !(typeof this.logger.debug === "function")) return;
    this.logger.debug(...args);
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  async flush() {
    if (this.logger.constructor.name == DefaultLogger.name) return;
    const logger = this.logger;
    if (typeof logger.flush === "function") {
      await logger.flush();
      return;
    }
    await resolveNextTick();
  }
};
async function resolveApiBaseUrl(opts) {
  if (opts.apiBaseUrl !== void 0) return opts.apiBaseUrl;
  if (opts.mode.isDev && opts.mode.isInferred) {
    if (await devServerAvailable(defaultDevServerHost, opts.fetch ?? globalThis.fetch)) return defaultDevServerHost;
  }
  return defaultInngestApiBaseUrl;
}
const realtimeSubscriptionTokenSchema = objectType({ jwt: stringType() });
const sendSignalSuccessResponseSchema = objectType({ data: objectType({ run_id: stringType().min(1) }) });
const checkpointNewRunResponseSchema = objectType({ data: objectType({
  fn_id: stringType().min(1),
  app_id: stringType().min(1),
  run_id: stringType().min(1),
  token: stringType().min(1).optional()
}) });
var InngestApi = class {
  apiBaseUrl;
  signingKey;
  signingKeyFallback;
  fetch;
  mode;
  constructor({ baseUrl, signingKey, signingKeyFallback, fetch: fetch2, mode }) {
    this.apiBaseUrl = baseUrl;
    this.signingKey = signingKey;
    this.signingKeyFallback = signingKeyFallback;
    this.fetch = fetch2;
    this.mode = mode;
  }
  get hashedKey() {
    return hashSigningKey(this.signingKey);
  }
  get hashedFallbackKey() {
    if (!this.signingKeyFallback) return;
    return hashSigningKey(this.signingKeyFallback);
  }
  setSigningKey(key) {
    if (typeof key === "string" && this.signingKey === "") this.signingKey = key;
  }
  setSigningKeyFallback(key) {
    if (typeof key === "string" && !this.signingKeyFallback) this.signingKeyFallback = key;
  }
  async getTargetUrl(path) {
    const baseUrl = await resolveApiBaseUrl({
      apiBaseUrl: this.apiBaseUrl,
      mode: this.mode,
      fetch: this.fetch
    });
    return new URL(path, baseUrl);
  }
  async req(url, options) {
    const finalUrl = typeof url === "string" ? await this.getTargetUrl(url) : url;
    try {
      return ok(await fetchWithAuthFallback({
        authToken: this.hashedKey,
        authTokenFallback: this.hashedFallbackKey,
        fetch: this.fetch,
        url: finalUrl,
        options: {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options?.headers
          }
        }
      }));
    } catch (error) {
      return err(error);
    }
  }
  async getRunSteps(runId, version2) {
    const result = await this.req(`/v0/runs/${encodeURIComponent(runId)}/actions`);
    if (result.ok) {
      const res = result.value;
      const data = await res.json();
      if (res.ok) return ok(stepsSchemas[version2].parse(data));
      return err(errorSchema.parse(data));
    }
    return err({
      error: getErrorMessage(result.error, "Unknown error retrieving step data"),
      status: 500
    });
  }
  async getRunBatch(runId) {
    const result = await this.req(`/v0/runs/${encodeURIComponent(runId)}/batch`);
    if (result.ok) {
      const res = result.value;
      const data = await res.json();
      if (res.ok) return ok(batchSchema.parse(data));
      return err(errorSchema.parse(data));
    }
    return err({
      error: getErrorMessage(result.error, "Unknown error retrieving event batch"),
      status: 500
    });
  }
  async publish(publishOptions, data) {
    const isStream = data instanceof ReadableStream;
    const url = await this.getTargetUrl("/v1/realtime/publish");
    url.searchParams.set("channel", publishOptions.channel || "");
    if (publishOptions.runId) url.searchParams.set("run_id", publishOptions.runId);
    for (const topic of publishOptions.topics) url.searchParams.append("topic", topic);
    const result = await this.req(url, {
      body: isStream ? data : typeof data === "string" ? data : JSON.stringify(data),
      method: "POST",
      headers: { "Content-Type": isStream ? "text/stream" : "application/json" },
      ...isStream ? { duplex: "half" } : {}
    });
    if (result.ok) {
      const res = result.value;
      if (!res.ok) throw new Error(`Failed to publish event: ${res.status} ${res.statusText}`);
      return ok(void 0);
    }
    return err({
      error: getErrorMessage(result.error, "Unknown error publishing event"),
      status: 500
    });
  }
  async sendSignal(signalOptions, options) {
    const url = await this.getTargetUrl("/v1/signals");
    const body = {
      signal: signalOptions.signal,
      data: signalOptions.data
    };
    return fetchWithAuthFallback({
      authToken: this.hashedKey,
      authTokenFallback: this.hashedFallbackKey,
      fetch: this.fetch,
      url,
      options: {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...options?.headers
        }
      }
    }).then(async (res) => {
      if (res.status === 404) return ok({ runId: void 0 });
      const resClone = res.clone();
      let json;
      try {
        json = await res.json();
      } catch {
        return err({
          error: `Failed to send signal: ${res.status} ${res.statusText} - ${await resClone.text()}`,
          status: res.status
        });
      }
      if (!res.ok) try {
        return err(errorSchema.parse(json));
      } catch {
        return err({
          error: `Failed to send signal: ${res.status} ${res.statusText} - ${await res.text()}`,
          status: res.status
        });
      }
      const parseRes = sendSignalSuccessResponseSchema.safeParse(json);
      if (!parseRes.success) return err({
        error: `Successfully sent signal, but response parsing failed: ${res.status} ${res.statusText} - ${await resClone.text()}`,
        status: res.status
      });
      return ok({ runId: parseRes.data.data.run_id });
    }).catch((error) => {
      return err({
        error: getErrorMessage(error, "Unknown error sending signal"),
        status: 500
      });
    });
  }
  async getSubscriptionToken(channel, topics) {
    const url = await this.getTargetUrl("/v1/realtime/token");
    const body = topics.map((topic) => ({
      channel,
      name: topic,
      kind: "run"
    }));
    return fetchWithAuthFallback({
      authToken: this.hashedKey,
      authTokenFallback: this.hashedFallbackKey,
      fetch: this.fetch,
      url,
      options: {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Failed to get subscription token: ${res.status} ${res.statusText} - ${await res.text()}`);
      return realtimeSubscriptionTokenSchema.parse(await res.json()).jwt;
    }).catch((error) => {
      throw new Error(getErrorMessage(error, "Unknown error getting subscription token"));
    });
  }
  async updateMetadata(args, options) {
    const payload = {
      target: args.target,
      metadata: args.metadata
    };
    const result = await this.req(`/v1/runs/${encodeURIComponent(args.target.run_id)}/metadata`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: options?.headers
    });
    if (!result.ok) return err({
      error: getErrorMessage(result.error, "Unknown error updating metadata"),
      status: 500
    });
    const res = result.value;
    if (res.ok) return ok(void 0);
    const resClone = res.clone();
    let json;
    try {
      json = await res.json();
    } catch {
      return err({
        error: `Failed to update metadata: ${res.status} ${res.statusText} - ${await resClone.text()}`,
        status: res.status
      });
    }
    try {
      return err(errorSchema.parse(json));
    } catch {
      return err({
        error: `Failed to update metadata: ${res.status} ${res.statusText}`,
        status: res.status
      });
    }
  }
  /**
  * Start a new run, optionally passing in a number of steps to initialize the
  * run with.
  */
  async checkpointNewRun(args) {
    const body = JSON.stringify({
      run_id: args.runId,
      event: args.event,
      steps: args.steps,
      ts: (/* @__PURE__ */ new Date()).valueOf(),
      request_version: args.executionVersion,
      retries: args.retries
    });
    const result = await this.req("/v1/checkpoint", {
      method: "POST",
      body
    });
    if (!result.ok) throw new Error(getErrorMessage(result.error, "Unknown error checkpointing new run"));
    const res = result.value;
    if (res.ok) {
      const rawData = await res.json();
      return checkpointNewRunResponseSchema.parse(rawData);
    }
    throw new Error(`Failed to checkpoint new run: ${res.status} ${res.statusText} - ${await res.text()}`);
  }
  /**
  * Checkpoint steps for a given sync run.
  */
  async checkpointSteps(args) {
    const body = JSON.stringify({
      fn_id: args.fnId,
      app_id: args.appId,
      run_id: args.runId,
      steps: args.steps,
      ts: (/* @__PURE__ */ new Date()).valueOf()
    });
    const result = await this.req(`/v1/checkpoint/${encodeURIComponent(args.runId)}/steps`, {
      method: "POST",
      body
    });
    if (!result.ok) throw new Error(getErrorMessage(result.error, "Unknown error checkpointing steps"));
    const res = result.value;
    if (!res.ok) throw new Error(`Failed to checkpoint steps: ${res.status} ${res.statusText} - ${await res.text()}`);
  }
  /**
  * Checkpoint steps for a given async run.
  */
  async checkpointStepsAsync(args) {
    const body = JSON.stringify({
      run_id: args.runId,
      fn_id: args.fnId,
      qi_id: args.queueItemId,
      steps: args.steps,
      ts: (/* @__PURE__ */ new Date()).valueOf()
    });
    const result = await this.req(`/v1/checkpoint/${encodeURIComponent(args.runId)}/async`, {
      method: "POST",
      body
    });
    if (!result.ok) throw new Error(getErrorMessage(result.error, "Unknown error checkpointing async"));
    const res = result.value;
    if (!res.ok) throw new Error(`Failed to checkpoint async: ${res.status} ${res.statusText} - ${await res.text()}`);
  }
  /**
  * Fetch the output of a completed run using a token.
  *
  * This uses token-based auth (not signing key) and is intended for use by
  * proxy endpoints that fetch results on behalf of users.
  *
  * @param runId - The ID of the run to fetch output for
  * @param token - The token used to authenticate the request
  * @returns The raw Response from the API
  */
  async getRunOutput(runId, token) {
    const url = await this.getTargetUrl(`/v1/http/runs/${encodeURIComponent(runId)}/output`);
    url.searchParams.set("token", token);
    return this.fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
function createEntropy(byteLength) {
  const bytes = new Uint8Array(byteLength);
  const { crypto } = globalThis;
  if (!crypto) throw new Error("missing crypto module");
  if (!crypto.getRandomValues) throw new Error("missing crypto.getRandomValues");
  crypto.getRandomValues(bytes);
  return bytes;
}
var Inngest = class Inngest2 {
  get [Symbol.toStringTag]() {
    return Inngest2.Tag;
  }
  /**
  * The ID of this instance, most commonly a reference to the application it
  * resides in.
  *
  * The ID of your client should remain the same for its lifetime; if you'd
  * like to change the name of your client as it appears in the Inngest UI,
  * change the `name` property instead.
  */
  id;
  /**
  * Stores the options so we can remember explicit settings the user has
  * provided.
  */
  options;
  /**
  * Inngest event key, used to send events to Inngest Cloud.
  */
  eventKey = "";
  _apiBaseUrl;
  _eventBaseUrl;
  inngestApi;
  /**
  * The absolute URL of the Inngest Cloud API.
  */
  sendEventUrl = new URL(`e/${this.eventKey}`, defaultInngestEventBaseUrl);
  headers;
  fetch;
  logger;
  localFns = [];
  /**
  * A promise that resolves when the middleware stack has been initialized and
  * the client is ready to be used.
  */
  middleware;
  /**
  * Whether the client is running in a production environment. This can
  * sometimes be `undefined` if the client has expressed no preference or
  * perhaps environment variables are only available at a later stage in the
  * runtime, for example when receiving a request.
  *
  * An {@link InngestCommHandler} should prioritize this value over all other
  * settings, but should still check for the presence of an environment
  * variable if it is not set.
  */
  _mode;
  schemas;
  _appVersion;
  /**
  * @internal
  * Flag set by metadataMiddleware to enable step.metadata()
  */
  experimentalMetadataEnabled = false;
  get apiBaseUrl() {
    return this._apiBaseUrl;
  }
  get eventBaseUrl() {
    return this._eventBaseUrl;
  }
  get env() {
    return this.headers[headerKeys.Environment] ?? null;
  }
  get appVersion() {
    return this._appVersion;
  }
  /**
  * Access the metadata builder for updating run and step metadata.
  *
  * @example
  * ```ts
  * // Update metadata for the current run
  * await inngest.metadata.update({ status: "processing" });
  *
  * // Update metadata for a different run
  * await inngest.metadata.run(otherRunId).update({ key: "val" });
  *
  * ```
  */
  get metadata() {
    if (!this.experimentalMetadataEnabled) throw new Error('inngest.metadata is experimental. Enable it by adding metadataMiddleware() from "inngest/experimental" to your client middleware.');
    return new UnscopedMetadataBuilder(this);
  }
  /**
  * A client used to interact with the Inngest API by sending or reacting to
  * events.
  *
  * To provide event typing, see {@link EventSchemas}.
  *
  * ```ts
  * const inngest = new Inngest({ name: "My App" });
  *
  * // or to provide event typing too
  * const inngest = new Inngest({
  *   name: "My App",
  *   schemas: new EventSchemas().fromRecord<{
  *     "app/user.created": {
  *       data: { userId: string };
  *     };
  *   }>(),
  * });
  * ```
  */
  constructor(options) {
    this.options = options;
    const { id, fetch: fetch2, logger = new DefaultLogger(), middleware, isDev, schemas, appVersion } = this.options;
    if (!id) throw new Error("An `id` must be passed to create an Inngest instance.");
    this.id = id;
    this._mode = getMode({ explicitMode: typeof isDev === "boolean" ? isDev ? "dev" : "cloud" : void 0 });
    this.fetch = getFetch(fetch2);
    this.inngestApi = new InngestApi({
      baseUrl: this.apiBaseUrl,
      signingKey: processEnv(envKeys.InngestSigningKey) || "",
      signingKeyFallback: processEnv(envKeys.InngestSigningKeyFallback),
      fetch: this.fetch,
      mode: this.mode
    });
    this.schemas = schemas;
    this.loadModeEnvVars();
    this.logger = logger;
    this.middleware = this.initializeMiddleware([...builtInMiddleware, ...middleware || []]);
    this._appVersion = appVersion;
  }
  /**
  * Returns a `Promise` that resolves when the app is ready and all middleware
  * has been initialized.
  */
  get ready() {
    return this.middleware.then(() => {
    });
  }
  /**
  * Set the environment variables for this client. This is useful if you are
  * passed environment variables at runtime instead of as globals and need to
  * update the client with those values as requests come in.
  */
  setEnvVars(env = getProcessEnv()) {
    this.mode = getMode({
      env,
      client: this
    });
    return this;
  }
  loadModeEnvVars() {
    this._apiBaseUrl = this.options.baseUrl || this.mode["env"][envKeys.InngestApiBaseUrl] || this.mode["env"][envKeys.InngestBaseUrl] || this.mode.getExplicitUrl(defaultInngestApiBaseUrl);
    this._eventBaseUrl = this.options.baseUrl || this.mode["env"][envKeys.InngestEventApiBaseUrl] || this.mode["env"][envKeys.InngestBaseUrl] || this.mode.getExplicitUrl(defaultInngestEventBaseUrl);
    this.setEventKey(this.options.eventKey || this.mode["env"][envKeys.InngestEventKey] || "");
    this.headers = inngestHeaders({
      inngestEnv: this.options.env,
      env: this.mode["env"]
    });
    this.inngestApi["mode"] = this.mode;
    this.inngestApi["apiBaseUrl"] = this._apiBaseUrl;
  }
  /**
  * Initialize all passed middleware, running the `register` function on each
  * in sequence and returning the requested hook registrations.
  */
  async initializeMiddleware(middleware = [], opts) {
    const prefix = await (opts?.prefixStack ?? []);
    const stack = middleware.reduce(async (acc, m) => {
      const prev = await acc;
      const next = await m.init({
        client: this,
        ...opts?.registerInput
      });
      return [...prev, next];
    }, Promise.resolve([]));
    return [...prefix, ...await stack];
  }
  get mode() {
    return this._mode;
  }
  set mode(m) {
    this._mode = m;
    this.loadModeEnvVars();
  }
  /**
  * Given a response from Inngest, relay the error to the caller.
  */
  async getResponseError(response, rawBody, foundErr = "Unknown error") {
    let errorMessage = foundErr;
    if (errorMessage === "Unknown error") switch (response.status) {
      case 401:
        errorMessage = "Event key Not Found";
        break;
      case 400:
        errorMessage = "Cannot process event payload";
        break;
      case 403:
        errorMessage = "Forbidden";
        break;
      case 404:
        errorMessage = "Event key not found";
        break;
      case 406:
        errorMessage = `${JSON.stringify(await rawBody)}`;
        break;
      case 409:
      case 412:
        errorMessage = "Event transformation failed";
        break;
      case 413:
        errorMessage = "Event payload too large";
        break;
      case 500:
        errorMessage = "Internal server error";
        break;
      default:
        try {
          errorMessage = await response.text();
        } catch (_err) {
          errorMessage = `${JSON.stringify(await rawBody)}`;
        }
        break;
    }
    return /* @__PURE__ */ new Error(`Inngest API Error: ${response.status} ${errorMessage}`);
  }
  /**
  * Set the event key for this instance of Inngest. This is useful if for some
  * reason the key is not available at time of instantiation or present in the
  * `INNGEST_EVENT_KEY` environment variable.
  */
  setEventKey(eventKey) {
    this.eventKey = eventKey || dummyEventKey;
    this.sendEventUrl = new URL(`e/${this.eventKey}`, this.eventBaseUrl || defaultInngestEventBaseUrl);
  }
  eventKeySet() {
    return Boolean(this.eventKey) && this.eventKey !== dummyEventKey;
  }
  /**
  * EXPERIMENTAL: This API is not yet stable and may change in the future
  * without a major version bump.
  *
  * Send a Signal to Inngest.
  */
  async sendSignal({ signal, data, env }) {
    const headers = { ...env ? { [headerKeys.Environment]: env } : {} };
    return this._sendSignal({
      signal,
      data,
      headers
    });
  }
  async _sendSignal({ signal, data, headers }) {
    const res = await this.inngestApi.sendSignal({
      signal,
      data
    }, {
      ...this.headers,
      ...headers
    });
    if (res.ok) return res.value;
    throw new Error(`Failed to send signal: ${res.error?.error || "Unknown error"}`);
  }
  async updateMetadata({ target, metadata, headers }) {
    const res = await this.inngestApi.updateMetadata({
      target,
      metadata
    }, { headers });
    if (res.ok) return res.value;
    throw new Error(`Failed to update metadata: ${res.error?.error || "Unknown error"}`);
  }
  async warnMetadata(target, kind, text) {
    this.logger.warn(text);
    if (!this.experimentalMetadataEnabled) return;
    await this.updateMetadata({
      target,
      metadata: [{
        kind: "inngest.warnings",
        op: "merge",
        values: { [`sdk.${kind}`]: text }
      }]
    });
  }
  /**
  * Realtime-related functionality for this Inngest client.
  */
  realtime = {
    publish: async (opts) => {
      const [{ topic, channel, data }, ctx] = await Promise.all([opts, getAsyncCtx()]);
      const runId = ctx?.execution?.ctx.runId;
      const res = await this.inngestApi.publish({
        channel,
        topics: [topic],
        runId
      }, data);
      if (res.ok) return data;
      throw new Error(`Failed to publish event: ${res.error?.error || "Unknown error"}`);
    },
    getSubscriptionToken: async ({ channel, topics }) => {
      const channelId = typeof channel === "string" ? channel : channel.name;
      if (!channelId) throw new Error("Channel ID is required to create a subscription token");
      return {
        channel: channelId,
        topics,
        key: await this.inngestApi.getSubscriptionToken(channelId, topics)
      };
    }
  };
  endpoint(handler) {
    if (!this.options.endpointAdapter) throw new Error("No endpoint adapter configured for this Inngest client.");
    return this.options.endpointAdapter({ client: this })(handler);
  }
  /**
  * Creates a proxy handler that polls Inngest for durable endpoint results.
  *
  * The proxy:
  * - Extracts `runId` and `token` from query params
  * - Fetches the result from Inngest API
  * - Runs the response through middleware (e.g., decryption)
  * - Adds CORS headers
  *
  * Use this in combination with the `asyncRedirectUrl` option on your
  * endpoint adapter to redirect users to your own proxy endpoint instead
  * of directly to Inngest.
  *
  * @example
  * ```ts
  * import { Inngest } from "inngest";
  * import { endpointAdapter } from "inngest/edge";
  *
  * const inngest = new Inngest({
  *   id: "my-app",
  *   endpointAdapter: endpointAdapter.withOptions({
  *     asyncRedirectUrl: "/api/inngest/poll",
  *   }),
  * });
  *
  * // Durable endpoint
  * export const GET = inngest.endpoint(async (req) => {
  *   const result = await step.run("work", () => "done");
  *   return new Response(result);
  * });
  *
  * // Proxy endpoint at /api/inngest/poll
  * export const GET = inngest.endpointProxy();
  * ```
  */
  endpointProxy() {
    if (!this.options.endpointAdapter) throw new Error("No endpoint adapter configured for this Inngest client.");
    if (!this.options.endpointAdapter.createProxyHandler) throw new Error("The configured endpoint adapter does not support proxy handlers.");
    return this.options.endpointAdapter.createProxyHandler({ client: this });
  }
  /**
  * Decrypt a proxy response using the client's middleware stack.
  *
  * This is called internally by proxy handlers to decrypt E2E encrypted
  * function results. It runs the `transformInput` hook which handles
  * decryption in encryption middleware.
  *
  * Uses type assertions because we're creating a minimal "fake" execution
  * context just to run the decryption middleware hooks - not a full execution.
  *
  * @internal
  */
  async decryptProxyResult(result) {
    if (!result.data) return result;
    const dummyEvent = {
      name: "__proxy__",
      data: {}
    };
    const proxyFn = {
      id: () => "__proxy__",
      name: "__proxy__"
    };
    const decryptedData = (await (await getHookStack(this.middleware, "onFunctionRun", {
      ctx: {
        event: dummyEvent,
        runId: "__proxy__"
      },
      fn: proxyFn,
      steps: [{
        id: "__result__",
        data: result.data
      }],
      reqArgs: []
    }, {
      transformInput: (prev, output) => ({
        ctx: {
          ...prev.ctx,
          ...output?.ctx
        },
        fn: proxyFn,
        steps: prev.steps.map((step$1, i) => ({
          ...step$1,
          ...output?.steps?.[i]
        })),
        reqArgs: prev.reqArgs
      }),
      transformOutput: (prev, output) => ({ result: {
        ...prev.result,
        ...output?.result
      } })
    })).transformInput?.({
      ctx: {
        event: dummyEvent,
        events: [dummyEvent],
        runId: "__proxy__",
        attempt: 0,
        step
      },
      fn: proxyFn,
      reqArgs: [],
      steps: [{
        id: "__result__",
        data: result.data
      }]
    }))?.steps?.[0]?.data ?? result.data;
    return {
      ...result,
      data: decryptedData
    };
  }
  /**
  * Send one or many events to Inngest. Takes an entire payload (including
  * name) as each input.
  *
  * ```ts
  * await inngest.send({ name: "app/user.created", data: { id: 123 } });
  * ```
  *
  * Returns a promise that will resolve if the event(s) were sent successfully,
  * else throws with an error explaining what went wrong.
  *
  * If you wish to send an event with custom types (i.e. one that hasn't been
  * generated), make sure to add it when creating your Inngest instance, like
  * so:
  *
  * ```ts
  * const inngest = new Inngest({
  *   name: "My App",
  *   schemas: new EventSchemas().fromRecord<{
  *     "my/event": {
  *       name: "my/event";
  *       data: { bar: string };
  *     };
  *   }>(),
  * });
  * ```
  */
  async send(payload, options) {
    const headers = { ...options?.env ? { [headerKeys.Environment]: options.env } : {} };
    return this._send({
      payload,
      headers
    });
  }
  /**
  * Internal method for sending an event, used to allow Inngest internals to
  * further customize the request sent to an Inngest Server.
  */
  async _send({ payload, headers }) {
    const nowMillis = (/* @__PURE__ */ new Date()).getTime();
    let maxAttempts = 5;
    try {
      const entropy = createEntropy(10);
      const entropyBase64 = Buffer.from(entropy).toString("base64");
      headers = {
        ...headers,
        [headerKeys.EventIdSeed]: `${nowMillis},${entropyBase64}`
      };
    } catch (err2) {
      let message = "Event-sending retries disabled";
      if (err2 instanceof Error) message += `: ${err2.message}`;
      console.debug(message);
      maxAttempts = 1;
    }
    const hooks = await getHookStack(this.middleware, "onSendEvent", void 0, {
      transformInput: (prev, output) => {
        return {
          ...prev,
          ...output
        };
      },
      transformOutput(prev, output) {
        return { result: {
          ...prev.result,
          ...output?.result
        } };
      }
    });
    let payloads = Array.isArray(payload) ? payload : payload ? [payload] : [];
    const inputChanges = await hooks.transformInput?.({ payloads: [...payloads] });
    if (inputChanges?.payloads) payloads = [...inputChanges.payloads];
    payloads = payloads.map((p) => {
      return {
        ...p,
        id: p.id,
        ts: p.ts || nowMillis,
        data: p.data || {}
      };
    });
    const applyHookToOutput = async (arg) => {
      const hookOutput = await hooks.transformOutput?.(arg);
      return {
        ...arg.result,
        ...hookOutput?.result
      };
    };
    if (!payloads.length) {
      console.warn(prettyError({
        type: "warn",
        whatHappened: "`inngest.send()` called with no events",
        reassurance: "This is not an error, but you may not have intended to do this.",
        consequences: "The returned promise will resolve, but no events have been sent to Inngest.",
        stack: true
      }));
      return await applyHookToOutput({ result: { ids: [] } });
    }
    let url = this.sendEventUrl.href;
    if (this.mode.isCloud && !this.eventKeySet()) throw new Error(prettyError({
      whatHappened: "Failed to send event",
      consequences: "Your event or events were not sent to Inngest.",
      why: "We couldn't find an event key to use to send events to Inngest.",
      toFixNow: fixEventKeyMissingSteps
    }));
    if (this.mode.isDev && this.mode.isInferred && !this.eventBaseUrl) {
      if (await devServerAvailable(defaultDevServerHost, this.fetch)) url = devServerUrl(defaultDevServerHost, `e/${this.eventKey}`).href;
    }
    return await applyHookToOutput({ result: { ids: (await retryWithBackoff(async () => {
      let rawBody;
      let body;
      const response = await this.fetch(url, {
        method: "POST",
        body: stringify$1(payloads),
        headers: {
          ...this.headers,
          ...headers
        }
      });
      try {
        rawBody = await response.json();
        body = await sendEventResponseSchema.parseAsync(rawBody);
      } catch (_err) {
        throw await this.getResponseError(response, rawBody);
      }
      if (body.status !== 200 || body.error) throw await this.getResponseError(response, rawBody, body.error);
      return body;
    }, {
      maxAttempts,
      baseDelay: 100
    })).ids } });
  }
  createFunction = (rawOptions, rawTrigger, handler) => {
    const fn = this._createFunction(rawOptions, rawTrigger, handler);
    this.localFns.push(fn);
    return fn;
  };
  get funcs() {
    return this.localFns;
  }
  _createFunction = (rawOptions, rawTrigger, handler) => {
    const options = this.sanitizeOptions(rawOptions);
    const triggers = this.sanitizeTriggers(rawTrigger);
    return new InngestFunction(this, {
      ...options,
      triggers
    }, handler);
  };
  /**
  * Runtime-only validation.
  */
  sanitizeOptions(options) {
    if (Object.hasOwn(options, "fns")) console.warn(`${logPrefix} InngestFunction: \`fns\` option has been deprecated in v3; use \`middleware\` instead. See https://www.inngest.com/docs/sdk/migration`);
    if (typeof options === "string") {
      console.warn(`${logPrefix} InngestFunction: Creating a function with a string as the first argument has been deprecated in v3; pass an object instead. See https://www.inngest.com/docs/sdk/migration`);
      return { id: options };
    }
    return options;
  }
  /**
  * Runtime-only validation.
  */
  sanitizeTriggers(triggers) {
    if (typeof triggers === "string") {
      console.warn(`${logPrefix} InngestFunction: Creating a function with a string as the second argument has been deprecated in v3; pass an object instead. See https://www.inngest.com/docs/sdk/migration`);
      return [{ event: triggers }];
    }
    if (!Array.isArray(triggers)) return [triggers];
    return triggers;
  }
};
const builtInMiddleware = /* @__PURE__ */ ((m) => m)([new InngestMiddleware({
  name: "Inngest: Logger",
  init({ client }) {
    return { onFunctionRun(arg) {
      const { ctx } = arg;
      const metadata = {
        runID: ctx.runId,
        eventName: ctx.event.name,
        functionName: arg.fn.name
      };
      let providedLogger = client["logger"];
      try {
        if ("child" in providedLogger) providedLogger = providedLogger.child(metadata);
      } catch (err2) {
        console.error('failed to create "childLogger" with error: ', err2);
      }
      const logger = new ProxyLogger(providedLogger);
      return {
        transformInput() {
          return { ctx: { logger } };
        },
        beforeExecution() {
          logger.enable();
        },
        transformOutput({ result: { error } }) {
          if (error) logger.error(error);
        },
        async beforeResponse() {
          await logger.flush();
        }
      };
    } };
  }
})]);
(function(_Inngest) {
  _Inngest.Tag = "Inngest.App";
})(Inngest || (Inngest = {}));
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const jsonResponse = (status, body) => ({
  status,
  headers: {
    "Content-Type": "application/json",
    ...corsHeaders
  },
  body: typeof body === "string" ? body : JSON.stringify(body)
});
const errorResponse = (status, message) => jsonResponse(status, { error: message });
async function handleDurableEndpointProxyRequest(client, ctx) {
  if (ctx.method === "OPTIONS") return {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400"
    },
    body: ""
  };
  const { runId, token } = ctx;
  if (!runId || !token) return errorResponse(400, "Missing runId or token query parameter");
  try {
    const response = await client["inngestApi"].getRunOutput(runId, token);
    if (!response.ok) return jsonResponse(response.status, await response.text());
    let body = await response.json();
    body = await client["decryptProxyResult"](body);
    return jsonResponse(200, body);
  } catch (error) {
    return errorResponse(500, error instanceof Error ? error.message : "Failed to fetch run output");
  }
}
let InngestEndpointAdapter;
(function(_InngestEndpointAdapter) {
  const Tag = _InngestEndpointAdapter.Tag = "Inngest.EndpointAdapter";
  _InngestEndpointAdapter.create = (rawFn, proxyFn) => {
    const scopedOptions = {};
    const fn = (options) => rawFn({
      ...scopedOptions,
      ...options
    });
    const properties = {
      [Symbol.toStringTag]: { value: Tag },
      withOptions: { value: (options) => {
        Object.assign(scopedOptions, options);
        return fn;
      } }
    };
    if (proxyFn) properties["createProxyHandler"] = { value: proxyFn };
    return Object.defineProperties(fn, properties);
  };
})(InngestEndpointAdapter || (InngestEndpointAdapter = {}));
const frameworkName = "edge";
const commHandler = (options, syncOptions) => {
  return new InngestCommHandler({
    frameworkName,
    fetch: fetch.bind(globalThis),
    ...options,
    syncOptions,
    handler: (req) => {
      return {
        body: () => req.text(),
        headers: (key) => req.headers.get(key),
        method: () => req.method,
        url: () => new URL(req.url, `https://${req.headers.get("host") || ""}`),
        transformResponse: ({ body, status, headers }) => {
          return new Response(body, {
            status,
            headers
          });
        },
        experimentalTransformSyncResponse: async (data) => {
          const res = data;
          const headers = {};
          res.headers.forEach((v, k) => {
            headers[k] = v;
          });
          return {
            headers,
            status: res.status,
            body: await res.clone().text()
          };
        }
      };
    }
  });
};
const serve = (options) => {
  return commHandler(options).createHandler();
};
const createDurableEndpointProxyHandler = (options) => {
  return async (req) => {
    const url = new URL(req.url);
    const result = await handleDurableEndpointProxyRequest(options.client, {
      runId: url.searchParams.get("runId"),
      token: url.searchParams.get("token"),
      method: req.method
    });
    return new Response(result.body, {
      status: result.status,
      headers: result.headers
    });
  };
};
InngestEndpointAdapter.create((options) => {
  return commHandler(options, options).createSyncHandler();
}, createDurableEndpointProxyHandler);
export {
  Inngest as I,
  serve as s
};
