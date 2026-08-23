var ansiRegex;
var hasRequiredAnsiRegex;
function requireAnsiRegex() {
  if (hasRequiredAnsiRegex) return ansiRegex;
  hasRequiredAnsiRegex = 1;
  ansiRegex = (options) => {
    options = Object.assign({
      onlyFirst: false
    }, options);
    const pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(pattern, options.onlyFirst ? void 0 : "g");
  };
  return ansiRegex;
}
export {
  requireAnsiRegex as r
};
