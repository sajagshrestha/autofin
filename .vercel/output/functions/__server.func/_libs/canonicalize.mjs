import { g as getDefaultExportFromCjs } from "./react.mjs";
var canonicalize$1;
var hasRequiredCanonicalize;
function requireCanonicalize() {
  if (hasRequiredCanonicalize) return canonicalize$1;
  hasRequiredCanonicalize = 1;
  canonicalize$1 = function serialize(object) {
    if (object === null || typeof object !== "object" || object.toJSON != null) {
      return JSON.stringify(object);
    }
    if (Array.isArray(object)) {
      return "[" + object.reduce((t, cv, ci) => {
        const comma = ci === 0 ? "" : ",";
        const value = cv === void 0 || typeof cv === "symbol" ? null : cv;
        return t + comma + serialize(value);
      }, "") + "]";
    }
    return "{" + Object.keys(object).sort().reduce((t, cv, ci) => {
      if (object[cv] === void 0 || typeof object[cv] === "symbol") {
        return t;
      }
      const comma = t.length === 0 ? "" : ",";
      return t + comma + serialize(cv) + ":" + serialize(object[cv]);
    }, "") + "}";
  };
  return canonicalize$1;
}
var canonicalizeExports = requireCanonicalize();
const canonicalize = /* @__PURE__ */ getDefaultExportFromCjs(canonicalizeExports);
export {
  canonicalize as c
};
