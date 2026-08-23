import { g as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireAnsiRegex } from "./ansi-regex.mjs";
var stripAnsi$1 = { exports: {} };
var hasRequiredStripAnsi;
function requireStripAnsi() {
  if (hasRequiredStripAnsi) return stripAnsi$1.exports;
  hasRequiredStripAnsi = 1;
  const ansiRegex = requireAnsiRegex();
  const stripAnsi2 = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
  stripAnsi$1.exports = stripAnsi2;
  stripAnsi$1.exports.default = stripAnsi2;
  return stripAnsi$1.exports;
}
var stripAnsiExports = requireStripAnsi();
const stripAnsi = /* @__PURE__ */ getDefaultExportFromCjs(stripAnsiExports);
export {
  stripAnsi as s
};
