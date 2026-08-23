import { g as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireAnsiStyles } from "./ansi-styles.mjs";
import { r as requireSupportsColor } from "./supports-color.mjs";
var util;
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  const stringReplaceAll = (string, substring, replacer) => {
    let index = string.indexOf(substring);
    if (index === -1) {
      return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = "";
    do {
      returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
      endIndex = index + substringLength;
      index = string.indexOf(substring, endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
    let endIndex = 0;
    let returnValue = "";
    do {
      const gotCR = string[index - 1] === "\r";
      returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
      endIndex = index + 1;
      index = string.indexOf("\n", endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  util = {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  };
  return util;
}
var templates;
var hasRequiredTemplates;
function requireTemplates() {
  if (hasRequiredTemplates) return templates;
  hasRequiredTemplates = 1;
  const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
  const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
  const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
  const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
  const ESCAPES = /* @__PURE__ */ new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", "\x1B"],
    ["a", "\x07"]
  ]);
  function unescape(c) {
    const u = c[0] === "u";
    const bracket = c[1] === "{";
    if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
      return String.fromCharCode(parseInt(c.slice(1), 16));
    }
    if (u && bracket) {
      return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
    }
    return ESCAPES.get(c) || c;
  }
  function parseArguments(name, arguments_) {
    const results = [];
    const chunks = arguments_.trim().split(/\s*,\s*/g);
    let matches;
    for (const chunk of chunks) {
      const number = Number(chunk);
      if (!Number.isNaN(number)) {
        results.push(number);
      } else if (matches = chunk.match(STRING_REGEX)) {
        results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
      } else {
        throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
      }
    }
    return results;
  }
  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1];
      if (matches[2]) {
        const args = parseArguments(name, matches[2]);
        results.push([name].concat(args));
      } else {
        results.push([name]);
      }
    }
    return results;
  }
  function buildStyle(chalk2, styles) {
    const enabled = {};
    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1);
      }
    }
    let current = chalk2;
    for (const [styleName, styles2] of Object.entries(enabled)) {
      if (!Array.isArray(styles2)) {
        continue;
      }
      if (!(styleName in current)) {
        throw new Error(`Unknown Chalk style: ${styleName}`);
      }
      current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
    }
    return current;
  }
  templates = (chalk2, temporary) => {
    const styles = [];
    const chunks = [];
    let chunk = [];
    temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
      if (escapeCharacter) {
        chunk.push(unescape(escapeCharacter));
      } else if (style) {
        const string = chunk.join("");
        chunk = [];
        chunks.push(styles.length === 0 ? string : buildStyle(chalk2, styles)(string));
        styles.push({ inverse, styles: parseStyle(style) });
      } else if (close) {
        if (styles.length === 0) {
          throw new Error("Found extraneous } in Chalk template literal");
        }
        chunks.push(buildStyle(chalk2, styles)(chunk.join("")));
        chunk = [];
        styles.pop();
      } else {
        chunk.push(character);
      }
    });
    chunks.push(chunk.join(""));
    if (styles.length > 0) {
      const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(errMessage);
    }
    return chunks.join("");
  };
  return templates;
}
var source;
var hasRequiredSource;
function requireSource() {
  if (hasRequiredSource) return source;
  hasRequiredSource = 1;
  const ansiStyles = requireAnsiStyles();
  const { stdout: stdoutColor, stderr: stderrColor } = requireSupportsColor();
  const {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  } = requireUtil();
  const { isArray } = Array;
  const levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  const styles = /* @__PURE__ */ Object.create(null);
  const applyOptions = (object, options = {}) => {
    if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === void 0 ? colorLevel : options.level;
  };
  class ChalkClass {
    constructor(options) {
      return chalkFactory(options);
    }
  }
  const chalkFactory = (options) => {
    const chalk3 = {};
    applyOptions(chalk3, options);
    chalk3.template = (...arguments_) => chalkTag(chalk3.template, ...arguments_);
    Object.setPrototypeOf(chalk3, Chalk.prototype);
    Object.setPrototypeOf(chalk3.template, chalk3);
    chalk3.template.constructor = () => {
      throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
    };
    chalk3.template.Instance = ChalkClass;
    return chalk3.template;
  };
  function Chalk(options) {
    return chalkFactory(options);
  }
  for (const [styleName, style] of Object.entries(ansiStyles)) {
    styles[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      }
    };
  }
  styles.visible = {
    get() {
      const builder = createBuilder(this, this._styler, true);
      Object.defineProperty(this, "visible", { value: builder });
      return builder;
    }
  };
  const usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (const model of usedModels) {
    styles[model] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  for (const model of usedModels) {
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles[bgModel] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  const proto = Object.defineProperties(() => {
  }, {
    ...styles,
    level: {
      enumerable: true,
      get() {
        return this._generator.level;
      },
      set(level) {
        this._generator.level = level;
      }
    }
  });
  const createStyler = (open, close, parent) => {
    let openAll;
    let closeAll;
    if (parent === void 0) {
      openAll = open;
      closeAll = close;
    } else {
      openAll = parent.openAll + open;
      closeAll = close + parent.closeAll;
    }
    return {
      open,
      close,
      openAll,
      closeAll,
      parent
    };
  };
  const createBuilder = (self, _styler, _isEmpty) => {
    const builder = (...arguments_) => {
      if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
        return applyStyle(builder, chalkTag(builder, ...arguments_));
      }
      return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
    };
    Object.setPrototypeOf(builder, proto);
    builder._generator = self;
    builder._styler = _styler;
    builder._isEmpty = _isEmpty;
    return builder;
  };
  const applyStyle = (self, string) => {
    if (self.level <= 0 || !string) {
      return self._isEmpty ? "" : string;
    }
    let styler = self._styler;
    if (styler === void 0) {
      return string;
    }
    const { openAll, closeAll } = styler;
    if (string.indexOf("\x1B") !== -1) {
      while (styler !== void 0) {
        string = stringReplaceAll(string, styler.close, styler.open);
        styler = styler.parent;
      }
    }
    const lfIndex = string.indexOf("\n");
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
  };
  let template;
  const chalkTag = (chalk3, ...strings) => {
    const [firstString] = strings;
    if (!isArray(firstString) || !isArray(firstString.raw)) {
      return strings.join(" ");
    }
    const arguments_ = strings.slice(1);
    const parts = [firstString.raw[0]];
    for (let i = 1; i < firstString.length; i++) {
      parts.push(
        String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
        String(firstString.raw[i])
      );
    }
    if (template === void 0) {
      template = requireTemplates();
    }
    return template(chalk3, parts.join(""));
  };
  Object.defineProperties(Chalk.prototype, styles);
  const chalk2 = Chalk();
  chalk2.supportsColor = stdoutColor;
  chalk2.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
  chalk2.stderr.supportsColor = stderrColor;
  source = chalk2;
  return source;
}
var sourceExports = requireSource();
const chalk = /* @__PURE__ */ getDefaultExportFromCjs(sourceExports);
export {
  chalk as c
};
