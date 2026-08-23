var dist = {};
var adapters = {};
var anthropic$1 = {};
var hasRequiredAnthropic$1;
function requireAnthropic$1() {
  if (hasRequiredAnthropic$1) return anthropic$1;
  hasRequiredAnthropic$1 = 1;
  Object.defineProperty(anthropic$1, "__esModule", { value: true });
  return anthropic$1;
}
var gemini$1 = {};
var hasRequiredGemini$1;
function requireGemini$1() {
  if (hasRequiredGemini$1) return gemini$1;
  hasRequiredGemini$1 = 1;
  Object.defineProperty(gemini$1, "__esModule", { value: true });
  gemini$1.GeminiAiAdapter = void 0;
  var GeminiAiAdapter;
  (function(GeminiAiAdapter2) {
    (function(HarmCategory) {
      HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
      HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
      HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
      HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
      HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
      HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
    })(GeminiAiAdapter2.HarmCategory || (GeminiAiAdapter2.HarmCategory = {}));
    (function(HarmBlockThreshold) {
      HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
      HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
      HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
      HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
      HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
      HarmBlockThreshold["OFF"] = "OFF";
    })(GeminiAiAdapter2.HarmBlockThreshold || (GeminiAiAdapter2.HarmBlockThreshold = {}));
  })(GeminiAiAdapter || (gemini$1.GeminiAiAdapter = GeminiAiAdapter = {}));
  return gemini$1;
}
var openai$1 = {};
var hasRequiredOpenai$1;
function requireOpenai$1() {
  if (hasRequiredOpenai$1) return openai$1;
  hasRequiredOpenai$1 = 1;
  Object.defineProperty(openai$1, "__esModule", { value: true });
  return openai$1;
}
var azureOpenai$1 = {};
var hasRequiredAzureOpenai$1;
function requireAzureOpenai$1() {
  if (hasRequiredAzureOpenai$1) return azureOpenai$1;
  hasRequiredAzureOpenai$1 = 1;
  Object.defineProperty(azureOpenai$1, "__esModule", { value: true });
  return azureOpenai$1;
}
var grok$1 = {};
var hasRequiredGrok$1;
function requireGrok$1() {
  if (hasRequiredGrok$1) return grok$1;
  hasRequiredGrok$1 = 1;
  Object.defineProperty(grok$1, "__esModule", { value: true });
  return grok$1;
}
var openaiResponses$1 = {};
var hasRequiredOpenaiResponses$1;
function requireOpenaiResponses$1() {
  if (hasRequiredOpenaiResponses$1) return openaiResponses$1;
  hasRequiredOpenaiResponses$1 = 1;
  Object.defineProperty(openaiResponses$1, "__esModule", { value: true });
  return openaiResponses$1;
}
var hasRequiredAdapters;
function requireAdapters() {
  if (hasRequiredAdapters) return adapters;
  hasRequiredAdapters = 1;
  (function(exports) {
    var __createBinding = adapters && adapters.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = adapters && adapters.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireAnthropic$1(), exports);
    __exportStar(requireGemini$1(), exports);
    __exportStar(requireOpenai$1(), exports);
    __exportStar(requireAzureOpenai$1(), exports);
    __exportStar(requireGrok$1(), exports);
    __exportStar(requireOpenaiResponses$1(), exports);
  })(adapters);
  return adapters;
}
var models = {};
var anthropic = {};
var env = {};
var hasRequiredEnv;
function requireEnv() {
  if (hasRequiredEnv) return env;
  hasRequiredEnv = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.envKeys = exports.processEnv = exports.allProcessEnv = void 0;
    const allProcessEnv = () => {
      try {
        if (process.env) {
          return process.env;
        }
      } catch (_err) {
      }
      try {
        const env2 = Deno.env.toObject();
        if (env2) {
          return env2;
        }
      } catch (_err) {
      }
      try {
        const env2 = Netlify.env.toObject();
        if (env2) {
          return env2;
        }
      } catch (_err) {
      }
      return {};
    };
    exports.allProcessEnv = allProcessEnv;
    const processEnv = (key) => {
      return (0, exports.allProcessEnv)()[key];
    };
    exports.processEnv = processEnv;
    var envKeys;
    (function(envKeys2) {
      envKeys2["OpenAiApiKey"] = "OPENAI_API_KEY";
      envKeys2["GeminiApiKey"] = "GEMINI_API_KEY";
      envKeys2["AnthropicApiKey"] = "ANTHROPIC_API_KEY";
      envKeys2["DeepSeekApiKey"] = "DEEPSEEK_API_KEY";
      envKeys2["GrokApiKey"] = "XAI_API_KEY";
      envKeys2["AzureOpenAiApiKey"] = "AZURE_OPENAI_API_KEY";
    })(envKeys || (exports.envKeys = envKeys = {}));
  })(env);
  return env;
}
var hasRequiredAnthropic;
function requireAnthropic() {
  if (hasRequiredAnthropic) return anthropic;
  hasRequiredAnthropic = 1;
  Object.defineProperty(anthropic, "__esModule", { value: true });
  anthropic.anthropic = void 0;
  const env_1 = requireEnv();
  const anthropic$12 = (options) => {
    var _a, _b;
    const authKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.AnthropicApiKey) || "";
    let baseUrl = options.baseUrl || "https://api.anthropic.com/v1/";
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const url = new URL("messages", baseUrl);
    const headers = {
      "anthropic-version": "2023-06-01"
    };
    if ((((_a = options.betaHeaders) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0) {
      headers["anthropic-beta"] = ((_b = options.betaHeaders) === null || _b === void 0 ? void 0 : _b.join(",")) || "";
    }
    return {
      url: url.href,
      authKey,
      format: "anthropic",
      onCall(_, body) {
        Object.assign(body, options.defaultParameters);
        body.model || (body.model = options.model);
      },
      headers,
      options
    };
  };
  anthropic.anthropic = anthropic$12;
  return anthropic;
}
var gemini = {};
var hasRequiredGemini;
function requireGemini() {
  if (hasRequiredGemini) return gemini;
  hasRequiredGemini = 1;
  var __rest = gemini && gemini.__rest || function(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(gemini, "__esModule", { value: true });
  gemini.gemini = void 0;
  const env_1 = requireEnv();
  const gemini$12 = (options) => {
    const authKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.GeminiApiKey) || "";
    let baseUrl = options.baseUrl || "https://generativelanguage.googleapis.com/v1beta/";
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const url = new URL(`models/${options.model}:generateContent?key=${authKey}`, baseUrl);
    const headers = {};
    return {
      url: url.href,
      authKey,
      format: "gemini",
      onCall(_, body) {
        var _a;
        if (!options.defaultParameters) {
          return;
        }
        const _b = options.defaultParameters, { generationConfig: defaultGenerationConfig } = _b, otherDefaults = __rest(_b, ["generationConfig"]);
        Object.assign(body, Object.assign(Object.assign({}, otherDefaults), body));
        if (defaultGenerationConfig) {
          body.generationConfig = Object.assign(Object.assign(Object.assign({}, defaultGenerationConfig), body.generationConfig || {}), {
            // And ensure nested thinkingConfig is also deep-merged
            thinkingConfig: Object.assign(Object.assign({}, defaultGenerationConfig.thinkingConfig), ((_a = body.generationConfig) === null || _a === void 0 ? void 0 : _a.thinkingConfig) || {})
          });
        }
      },
      headers,
      options
    };
  };
  gemini.gemini = gemini$12;
  return gemini;
}
var openai = {};
var hasRequiredOpenai;
function requireOpenai() {
  if (hasRequiredOpenai) return openai;
  hasRequiredOpenai = 1;
  Object.defineProperty(openai, "__esModule", { value: true });
  openai.openai = void 0;
  const env_1 = requireEnv();
  const openai$12 = (options) => {
    const authKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.OpenAiApiKey) || "";
    let baseUrl = options.baseUrl || "https://api.openai.com/v1/";
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const url = new URL("chat/completions", baseUrl);
    return {
      url: url.href,
      authKey,
      format: "openai-chat",
      onCall(_, body) {
        Object.assign(body, options.defaultParameters);
        body.model || (body.model = options.model);
      },
      options
    };
  };
  openai.openai = openai$12;
  return openai;
}
var azureOpenai = {};
var hasRequiredAzureOpenai;
function requireAzureOpenai() {
  if (hasRequiredAzureOpenai) return azureOpenai;
  hasRequiredAzureOpenai = 1;
  Object.defineProperty(azureOpenai, "__esModule", { value: true });
  azureOpenai.azureOpenai = void 0;
  const env_js_1 = requireEnv();
  const openai_js_1 = requireOpenai();
  const azureOpenai$12 = (options) => {
    if (!options.endpoint) {
      throw new Error("Azure OpenAI endpoint is required");
    }
    const authKey = options.apiKey || (0, env_js_1.processEnv)(env_js_1.envKeys.AzureOpenAiApiKey) || "";
    const baseModel = (0, openai_js_1.openai)({
      model: options.model,
      apiKey: authKey,
      baseUrl: options.endpoint,
      defaultParameters: options.defaultParameters
    });
    const url = new URL(`openai/deployments/${options.deployment}/chat/completions`, options.endpoint);
    url.searchParams.set("api-version", options.apiVersion);
    return Object.assign(Object.assign({}, baseModel), {
      url: url.href,
      format: "azure-openai",
      onCall(_, body) {
        Object.assign(body, options.defaultParameters);
        body.model || (body.model = options.model);
      },
      // Override headers to use Azure's API key format
      headers: {
        "api-key": baseModel.authKey,
        "Content-Type": "application/json"
      },
      options
    });
  };
  azureOpenai.azureOpenai = azureOpenai$12;
  return azureOpenai;
}
var deepseek = {};
var hasRequiredDeepseek;
function requireDeepseek() {
  if (hasRequiredDeepseek) return deepseek;
  hasRequiredDeepseek = 1;
  Object.defineProperty(deepseek, "__esModule", { value: true });
  deepseek.deepseek = void 0;
  const env_1 = requireEnv();
  const deepseek$1 = (options) => {
    const authKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.DeepSeekApiKey) || "";
    let baseUrl = options.baseUrl || "https://api.deepseek.com/v1/";
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const url = new URL("chat/completions", baseUrl);
    return {
      url: url.href,
      authKey,
      format: "openai-chat",
      onCall(_, body) {
        Object.assign(body, options.defaultParameters);
        body.model || (body.model = options.model);
      },
      options
    };
  };
  deepseek.deepseek = deepseek$1;
  return deepseek;
}
var grok = {};
var hasRequiredGrok;
function requireGrok() {
  if (hasRequiredGrok) return grok;
  hasRequiredGrok = 1;
  Object.defineProperty(grok, "__esModule", { value: true });
  grok.grok = void 0;
  const env_1 = requireEnv();
  const openai_js_1 = requireOpenai();
  const grok$12 = (options) => {
    const apiKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.GrokApiKey);
    const baseUrl = options.baseUrl || "https://api.x.ai/v1";
    const model = options.model;
    const adapter = (0, openai_js_1.openai)(Object.assign(Object.assign({}, options), {
      apiKey,
      baseUrl,
      model
    }));
    adapter.format = "grok";
    return adapter;
  };
  grok.grok = grok$12;
  return grok;
}
var openaiResponses = {};
var hasRequiredOpenaiResponses;
function requireOpenaiResponses() {
  if (hasRequiredOpenaiResponses) return openaiResponses;
  hasRequiredOpenaiResponses = 1;
  Object.defineProperty(openaiResponses, "__esModule", { value: true });
  openaiResponses.openaiResponses = void 0;
  const env_1 = requireEnv();
  const openaiResponses$12 = (options) => {
    const authKey = options.apiKey || (0, env_1.processEnv)(env_1.envKeys.OpenAiApiKey) || "";
    let baseUrl = options.baseUrl || "https://api.openai.com/v1/";
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const url = new URL("responses", baseUrl);
    return {
      url: url.href,
      authKey,
      format: "openai-responses",
      onCall(_, body) {
        Object.assign(body, options.defaultParameters);
        body.model || (body.model = options.model);
      },
      options
    };
  };
  openaiResponses.openaiResponses = openaiResponses$12;
  return openaiResponses;
}
var hasRequiredModels;
function requireModels() {
  if (hasRequiredModels) return models;
  hasRequiredModels = 1;
  (function(exports) {
    var __createBinding = models && models.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = models && models.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireAnthropic(), exports);
    __exportStar(requireGemini(), exports);
    __exportStar(requireOpenai(), exports);
    __exportStar(requireAzureOpenai(), exports);
    __exportStar(requireDeepseek(), exports);
    __exportStar(requireGrok(), exports);
    __exportStar(requireOpenaiResponses(), exports);
  })(models);
  return models;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function(exports) {
    var __createBinding = dist && dist.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = dist && dist.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = dist && dist.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importStar = dist && dist.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.models = void 0;
    __exportStar(requireAdapters(), exports);
    __exportStar(requireModels(), exports);
    exports.models = __importStar(requireModels());
  })(dist);
  return dist;
}
var distExports = requireDist();
export {
  distExports as d
};
