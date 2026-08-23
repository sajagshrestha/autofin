import { r as reactExports, R as React, t as t$6 } from "./react.mjs";
import { $ as $0c4a58759813079a$export$4e328f61c538687f, a as $e969f22b6713ca4a$export$ae780daf29e6d456 } from "./react-aria.mjs";
import { u as useVirtualizer } from "./tanstack__react-virtual.mjs";
import { r as reactDomExports } from "./react-dom.mjs";
import { a as withSelectorExports } from "./use-sync-external-store.mjs";
import { u as useFloating, i as inner, a as useInnerOffset, b as useInteractions } from "./floating-ui__react.mjs";
import { o as offset, s as shift, f as flip, a as size } from "./floating-ui__react-dom.mjs";
import { d as autoUpdate } from "./floating-ui__dom.mjs";
var i$5 = Object.defineProperty;
var d$2 = (t2, e2, n2) => e2 in t2 ? i$5(t2, e2, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e2] = n2;
var r$7 = (t2, e2, n2) => (d$2(t2, typeof e2 != "symbol" ? e2 + "" : e2, n2), n2);
let o$7 = class o {
  constructor() {
    r$7(this, "current", this.detect());
    r$7(this, "handoffState", "pending");
    r$7(this, "currentId", 0);
  }
  set(e2) {
    this.current !== e2 && (this.handoffState = "pending", this.currentId = 0, this.current = e2);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
let s$9 = new o$7();
function l$5(n2) {
  var u2;
  return s$9.isServer ? null : n2 == null ? document : (u2 = n2 == null ? void 0 : n2.ownerDocument) != null ? u2 : document;
}
function r$6(n2) {
  var u2, o4;
  return s$9.isServer ? null : n2 == null ? document : (o4 = (u2 = n2 == null ? void 0 : n2.getRootNode) == null ? void 0 : u2.call(n2)) != null ? o4 : document;
}
function e$4(n2) {
  var u2, o4;
  return (o4 = (u2 = r$6(n2)) == null ? void 0 : u2.activeElement) != null ? o4 : null;
}
function d$1(n2) {
  return e$4(n2) === n2;
}
function t$5(e2) {
  typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o4) => setTimeout(() => {
    throw o4;
  }));
}
function o$6() {
  let s2 = [], r2 = { addEventListener(e2, t2, n2, i2) {
    return e2.addEventListener(t2, n2, i2), r2.add(() => e2.removeEventListener(t2, n2, i2));
  }, requestAnimationFrame(...e2) {
    let t2 = requestAnimationFrame(...e2);
    return r2.add(() => cancelAnimationFrame(t2));
  }, nextFrame(...e2) {
    return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e2));
  }, setTimeout(...e2) {
    let t2 = setTimeout(...e2);
    return r2.add(() => clearTimeout(t2));
  }, microTask(...e2) {
    let t2 = { current: true };
    return t$5(() => {
      t2.current && e2[0]();
    }), r2.add(() => {
      t2.current = false;
    });
  }, style(e2, t2, n2) {
    let i2 = e2.style.getPropertyValue(t2);
    return Object.assign(e2.style, { [t2]: n2 }), this.add(() => {
      Object.assign(e2.style, { [t2]: i2 });
    });
  }, group(e2) {
    let t2 = o$6();
    return e2(t2), this.add(() => t2.dispose());
  }, add(e2) {
    return s2.includes(e2) || s2.push(e2), () => {
      let t2 = s2.indexOf(e2);
      if (t2 >= 0) for (let n2 of s2.splice(t2, 1)) n2();
    };
  }, dispose() {
    for (let e2 of s2.splice(0)) e2();
  } };
  return r2;
}
function p$6() {
  let [e2] = reactExports.useState(o$6);
  return reactExports.useEffect(() => () => e2.dispose(), [e2]), e2;
}
let n$6 = (e2, t2) => {
  s$9.isServer ? reactExports.useEffect(e2, t2) : reactExports.useLayoutEffect(e2, t2);
};
function s$8(e2) {
  let r2 = reactExports.useRef(e2);
  return n$6(() => {
    r2.current = e2;
  }, [e2]), r2;
}
let o$5 = function(t2) {
  let e2 = s$8(t2);
  return React.useCallback((...r2) => e2.current(...r2), [e2]);
};
function E$4(e2) {
  let t2 = e2.width / 2, n2 = e2.height / 2;
  return { top: e2.clientY - n2, right: e2.clientX + t2, bottom: e2.clientY + n2, left: e2.clientX - t2 };
}
function P$2(e2, t2) {
  return !(!e2 || !t2 || e2.right < t2.left || e2.left > t2.right || e2.bottom < t2.top || e2.top > t2.bottom);
}
function w$3({ disabled: e2 = false } = {}) {
  let t2 = reactExports.useRef(null), [n2, l2] = reactExports.useState(false), r2 = p$6(), o4 = o$5(() => {
    t2.current = null, l2(false), r2.dispose();
  }), f2 = o$5((s2) => {
    if (r2.dispose(), t2.current === null) {
      t2.current = s2.currentTarget, l2(true);
      {
        let i2 = l$5(s2.currentTarget);
        r2.addEventListener(i2, "pointerup", o4, false), r2.addEventListener(i2, "pointermove", (c2) => {
          if (t2.current) {
            let p2 = E$4(c2);
            l2(P$2(p2, t2.current.getBoundingClientRect()));
          }
        }, false), r2.addEventListener(i2, "pointercancel", o4, false);
      }
    }
  });
  return { pressed: n2, pressProps: e2 ? {} : { onPointerDown: f2, onPointerUp: o4, onClick: o4 } };
}
function n$5(e2) {
  return reactExports.useMemo(() => e2, Object.values(e2));
}
let e$3 = reactExports.createContext(void 0);
function a$a() {
  return reactExports.useContext(e$3);
}
function t$4(...r2) {
  return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
}
function u$c(r2, n2, ...a3) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a3) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$c), t2;
}
var A$2 = ((a3) => (a3[a3.None = 0] = "None", a3[a3.RenderStrategy = 1] = "RenderStrategy", a3[a3.Static = 2] = "Static", a3))(A$2 || {}), C$5 = ((t2) => (t2[t2.Unmount = 0] = "Unmount", t2[t2.Hidden = 1] = "Hidden", t2))(C$5 || {});
function K() {
  let e2 = I$5();
  return reactExports.useCallback((r2) => U$1({ mergeRefs: e2, ...r2 }), [e2]);
}
function U$1({ ourProps: e2, theirProps: r2, slot: t2, defaultTag: a3, features: o4, visible: n2 = true, name: i2, mergeRefs: l2 }) {
  l2 = l2 != null ? l2 : H$2;
  let s2 = P$1(r2, e2);
  if (n2) return F$1(s2, t2, a3, i2, l2);
  let y2 = o4 != null ? o4 : 0;
  if (y2 & 2) {
    let { static: f2 = false, ...u2 } = s2;
    if (f2) return F$1(u2, t2, a3, i2, l2);
  }
  if (y2 & 1) {
    let { unmount: f2 = true, ...u2 } = s2;
    return u$c(f2 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return F$1({ ...u2, hidden: true, style: { display: "none" } }, t2, a3, i2, l2);
    } });
  }
  return F$1(s2, t2, a3, i2, l2);
}
function F$1(e2, r2 = {}, t2, a3, o4) {
  let { as: n2 = t2, children: i2, refName: l2 = "ref", ...s2 } = h$4(e2, ["unmount", "static"]), y2 = e2.ref !== void 0 ? { [l2]: e2.ref } : {}, f2 = typeof i2 == "function" ? i2(r2) : i2;
  f2 = E$3(f2), "className" in s2 && s2.className && typeof s2.className == "function" && (s2.className = s2.className(r2)), s2["aria-labelledby"] && s2["aria-labelledby"] === s2.id && (s2["aria-labelledby"] = void 0);
  let u2 = {};
  if (r2) {
    let d2 = false, p2 = [];
    for (let [c2, T3] of Object.entries(r2)) typeof T3 == "boolean" && (d2 = true), T3 === true && p2.push(c2.replace(/([A-Z])/g, (g2) => `-${g2.toLowerCase()}`));
    if (d2) {
      u2["data-headlessui-state"] = p2.join(" ");
      for (let c2 of p2) u2[`data-${c2}`] = "";
    }
  }
  if (b$3(n2) && (Object.keys(m$4(s2)).length > 0 || Object.keys(m$4(u2)).length > 0)) if (!reactExports.isValidElement(f2) || Array.isArray(f2) && f2.length > 1 || L$3(f2)) {
    if (Object.keys(m$4(s2)).length > 0) throw new Error(['Passing props on "Fragment"!', "", `The current component <${a3} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(m$4(s2)).concat(Object.keys(m$4(u2))).map((d2) => `  - ${d2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d2) => `  - ${d2}`).join(`
`)].join(`
`));
  } else {
    let d2 = f2.props, p2 = d2 == null ? void 0 : d2.className, c2 = typeof p2 == "function" ? (...R) => t$4(p2(...R), s2.className) : t$4(p2, s2.className), T3 = c2 ? { className: c2 } : {}, g2 = P$1(f2.props, m$4(h$4(s2, ["ref"])));
    for (let R in u2) R in g2 && delete u2[R];
    return reactExports.cloneElement(f2, Object.assign({}, g2, u2, y2, { ref: o4(D$4(f2), y2.ref) }, T3));
  }
  return reactExports.createElement(n2, Object.assign({}, h$4(s2, ["ref"]), !b$3(n2) && y2, !b$3(n2) && u2), f2);
}
function I$5() {
  let e2 = reactExports.useRef([]), r2 = reactExports.useCallback((t2) => {
    for (let a3 of e2.current) a3 != null && (typeof a3 == "function" ? a3(t2) : a3.current = t2);
  }, []);
  return (...t2) => {
    if (!t2.every((a3) => a3 == null)) return e2.current = t2, r2;
  };
}
function H$2(...e2) {
  return e2.every((r2) => r2 == null) ? void 0 : (r2) => {
    for (let t2 of e2) t2 != null && (typeof t2 == "function" ? t2(r2) : t2.current = r2);
  };
}
function P$1(...e2) {
  if (e2.length === 0) return {};
  if (e2.length === 1) return e2[0];
  let r2 = {}, t2 = {};
  for (let o4 of e2) for (let n2 in o4) n2.startsWith("on") && typeof o4[n2] == "function" ? (t2[n2] != null || (t2[n2] = []), t2[n2].push(o4[n2])) : r2[n2] = o4[n2];
  if (r2.disabled || r2["aria-disabled"]) for (let o4 in t2) /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(o4) && (t2[o4] = [(n2) => {
    var i2;
    return (i2 = n2 == null ? void 0 : n2.preventDefault) == null ? void 0 : i2.call(n2);
  }]);
  for (let o4 in t2) Object.assign(r2, { [o4](n2, ...i2) {
    let l2 = t2[o4];
    for (let s2 of l2) {
      if ((n2 instanceof Event || (n2 == null ? void 0 : n2.nativeEvent) instanceof Event) && n2.defaultPrevented) return;
      s2(n2, ...i2);
    }
  } });
  return r2;
}
function V$1(...e2) {
  if (e2.length === 0) return {};
  if (e2.length === 1) return e2[0];
  let r2 = {}, t2 = {};
  for (let o4 of e2) for (let n2 in o4) n2.startsWith("on") && typeof o4[n2] == "function" ? (t2[n2] != null || (t2[n2] = []), t2[n2].push(o4[n2])) : r2[n2] = o4[n2];
  for (let o4 in t2) Object.assign(r2, { [o4](...n2) {
    let i2 = t2[o4];
    for (let l2 of i2) l2 == null || l2(...n2);
  } });
  return r2;
}
function Y(e2) {
  var r2;
  return Object.assign(reactExports.forwardRef(e2), { displayName: (r2 = e2.displayName) != null ? r2 : e2.name });
}
function m$4(e2) {
  let r2 = Object.assign({}, e2);
  for (let t2 in r2) r2[t2] === void 0 && delete r2[t2];
  return r2;
}
function h$4(e2, r2 = []) {
  let t2 = Object.assign({}, e2);
  for (let a3 of r2) a3 in t2 && delete t2[a3];
  return t2;
}
function D$4(e2) {
  return React.version.split(".")[0] >= "19" ? e2.props.ref : e2.ref;
}
function E$3(e2) {
  if (e2 != null && e2.$$typeof === /* @__PURE__ */ Symbol.for("react.lazy")) {
    let r2 = e2._payload;
    if (r2 != null && r2.status === "fulfilled") return E$3(r2.value);
  }
  return e2;
}
function b$3(e2) {
  return e2 === reactExports.Fragment || e2 === /* @__PURE__ */ Symbol.for("react.fragment");
}
function L$3(e2) {
  return b$3(e2.type);
}
function b$2(l2, r2, c2) {
  let [i2, s2] = reactExports.useState(c2), e2 = l2 !== void 0, t2 = reactExports.useRef(e2), u2 = reactExports.useRef(false), d2 = reactExports.useRef(false);
  return e2 && !t2.current && !u2.current ? (u2.current = true, t2.current = e2, console.error("A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.")) : !e2 && t2.current && !d2.current && (d2.current = true, t2.current = e2, console.error("A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.")), [e2 ? l2 : i2, o$5((n2) => (e2 || reactDomExports.flushSync(() => s2(n2)), r2 == null ? void 0 : r2(n2)))];
}
function l$4(e2) {
  let [t2] = reactExports.useState(e2);
  return t2;
}
function p$5(t2 = {}, i2 = null, n2 = []) {
  for (let [e2, o4] of Object.entries(t2)) s$7(n2, r$5(i2, e2), o4);
  return n2;
}
function r$5(t2, i2) {
  return t2 ? t2 + "[" + i2 + "]" : i2;
}
function s$7(t2, i2, n2) {
  if (Array.isArray(n2)) for (let [e2, o4] of n2.entries()) s$7(t2, r$5(i2, e2.toString()), o4);
  else n2 instanceof Date ? t2.push([i2, n2.toISOString()]) : typeof n2 == "boolean" ? t2.push([i2, n2 ? "1" : "0"]) : typeof n2 == "string" ? t2.push([i2, n2]) : typeof n2 == "number" ? t2.push([i2, `${n2}`]) : n2 == null ? t2.push([i2, ""]) : c$9(n2) && !reactExports.isValidElement(n2) && p$5(n2, i2, t2);
}
function c$9(t2) {
  if (Object.prototype.toString.call(t2) !== "[object Object]") return false;
  let i2 = Object.getPrototypeOf(t2);
  return i2 === null || Object.getPrototypeOf(i2) === null;
}
let a$9 = "span";
var s$6 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(s$6 || {});
function l$3(t2, r2) {
  var n2;
  let { features: d2 = 1, ...e2 } = t2, o4 = { ref: r2, "aria-hidden": (d2 & 2) === 2 ? true : (n2 = e2["aria-hidden"]) != null ? n2 : void 0, hidden: (d2 & 4) === 4 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(d2 & 4) === 4 && (d2 & 2) !== 2 && { display: "none" } } };
  return K()({ ourProps: o4, theirProps: e2, slot: {}, defaultTag: a$9, name: "Hidden" });
}
let f$9 = Y(l$3);
let f$8 = reactExports.createContext(null);
function c$8({ children: t2 }) {
  let e2 = reactExports.useContext(f$8);
  if (!e2) return React.createElement(React.Fragment, null, t2);
  let { target: r2 } = e2;
  return r2 ? reactDomExports.createPortal(React.createElement(React.Fragment, null, t2), r2) : null;
}
function j$5({ data: t2, form: e2, disabled: r2, onReset: n2, overrides: F2 }) {
  let [i2, a3] = reactExports.useState(null), p2 = p$6();
  return reactExports.useEffect(() => {
    if (n2 && i2) return p2.addEventListener(i2, "reset", n2);
  }, [i2, e2, n2]), React.createElement(c$8, null, React.createElement(C$4, { setForm: a3, formId: e2 }), p$5(t2).map(([s2, v2]) => React.createElement(f$9, { features: s$6.Hidden, ...m$4({ key: s2, as: "input", type: "hidden", hidden: true, readOnly: true, form: e2, disabled: r2, name: s2, value: v2, ...F2 }) })));
}
function C$4({ setForm: t2, formId: e2 }) {
  return reactExports.useEffect(() => {
    if (e2) {
      let r2 = document.getElementById(e2);
      r2 && t2(r2);
    }
  }, [t2, e2]), e2 ? null : React.createElement(f$9, { features: s$6.Hidden, as: "input", type: "hidden", hidden: true, readOnly: true, ref: (r2) => {
    if (!r2) return;
    let n2 = r2.closest("form");
    n2 && t2(n2);
  } });
}
let e$2 = reactExports.createContext(void 0);
function u$b() {
  return reactExports.useContext(e$2);
}
function o$4(e2) {
  return typeof e2 != "object" || e2 === null ? false : "nodeType" in e2;
}
function t$3(e2) {
  return o$4(e2) && "tagName" in e2;
}
function n$4(e2) {
  return t$3(e2) && "accessKey" in e2;
}
function i$4(e2) {
  return t$3(e2) && "tabIndex" in e2;
}
function r$4(e2) {
  return t$3(e2) && "style" in e2;
}
function u$a(e2) {
  return n$4(e2) && e2.nodeName === "IFRAME";
}
function l$2(e2) {
  return n$4(e2) && e2.nodeName === "INPUT";
}
function m$3(e2) {
  return n$4(e2) && e2.nodeName === "LABEL";
}
function a$8(e2) {
  return n$4(e2) && e2.nodeName === "FIELDSET";
}
function E$2(e2) {
  return n$4(e2) && e2.nodeName === "LEGEND";
}
function L$2(e2) {
  return t$3(e2) ? e2.matches('a[href],audio[controls],button,details,embed,iframe,img[usemap],input:not([type="hidden"]),label,select,textarea,video[controls]') : false;
}
function s$5(l2) {
  let e2 = l2.parentElement, t2 = null;
  for (; e2 && !a$8(e2); ) E$2(e2) && (t2 = e2), e2 = e2.parentElement;
  let i2 = (e2 == null ? void 0 : e2.getAttribute("disabled")) === "";
  return i2 && r$3(t2) ? false : i2;
}
function r$3(l2) {
  if (!l2) return false;
  let e2 = l2.previousElementSibling;
  for (; e2 !== null; ) {
    if (E$2(e2)) return false;
    e2 = e2.previousElementSibling;
  }
  return true;
}
let u$9 = /* @__PURE__ */ Symbol();
function T$3(t2, n2 = true) {
  return Object.assign(t2, { [u$9]: n2 });
}
function y$4(...t2) {
  let n2 = reactExports.useRef(t2);
  reactExports.useEffect(() => {
    n2.current = t2;
  }, [t2]);
  let c2 = o$5((e2) => {
    for (let o4 of n2.current) o4 != null && (typeof o4 == "function" ? o4(e2) : o4.current = e2);
  });
  return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$9])) ? void 0 : c2;
}
let a$7 = reactExports.createContext(null);
a$7.displayName = "DescriptionContext";
function f$7() {
  let r2 = reactExports.useContext(a$7);
  if (r2 === null) {
    let e2 = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(e2, f$7), e2;
  }
  return r2;
}
function w$2() {
  var r2, e2;
  return (e2 = (r2 = reactExports.useContext(a$7)) == null ? void 0 : r2.value) != null ? e2 : void 0;
}
let I$4 = "p";
function C$3(r2, e2) {
  let c2 = reactExports.useId(), t2 = a$a(), { id: i2 = `headlessui-description-${c2}`, ...l2 } = r2, n2 = f$7(), o4 = y$4(e2);
  n$6(() => n2.register(i2), [i2, n2.register]);
  let s2 = n$5({ ...n2.slot, disabled: t2 || false }), p2 = { ref: o4, ...n2.props, id: i2 };
  return K()({ ourProps: p2, theirProps: l2, slot: s2, defaultTag: I$4, name: n2.name || "Description" });
}
let _$2 = Y(C$3);
Object.assign(_$2, {});
var o$3 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$3 || {});
let L$1 = reactExports.createContext(null);
L$1.displayName = "LabelContext";
function C$2() {
  let n2 = reactExports.useContext(L$1);
  if (n2 === null) {
    let l2 = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(l2, C$2), l2;
  }
  return n2;
}
function N$1(n2) {
  var a3, e2, o4;
  let l2 = (e2 = (a3 = reactExports.useContext(L$1)) == null ? void 0 : a3.value) != null ? e2 : void 0;
  return ((o4 = n2 == null ? void 0 : n2.length) != null ? o4 : 0) > 0 ? [l2, ...n2].filter(Boolean).join(" ") : l2;
}
function V({ inherit: n2 = false } = {}) {
  let l2 = N$1(), [a3, e2] = reactExports.useState([]), o4 = n2 ? [l2, ...a3].filter(Boolean) : a3;
  return [o4.length > 0 ? o4.join(" ") : void 0, reactExports.useMemo(() => function(t2) {
    let p2 = o$5((i2) => (e2((u2) => [...u2, i2]), () => e2((u2) => {
      let d2 = u2.slice(), f2 = d2.indexOf(i2);
      return f2 !== -1 && d2.splice(f2, 1), d2;
    }))), b2 = reactExports.useMemo(() => ({ register: p2, slot: t2.slot, name: t2.name, props: t2.props, value: t2.value }), [p2, t2.slot, t2.name, t2.props, t2.value]);
    return React.createElement(L$1.Provider, { value: b2 }, t2.children);
  }, [e2])];
}
let G$1 = "label";
function U(n2, l2) {
  var y2;
  let a3 = reactExports.useId(), e2 = C$2(), o4 = u$b(), T3 = a$a(), { id: t2 = `headlessui-label-${a3}`, htmlFor: p2 = o4 != null ? o4 : (y2 = e2.props) == null ? void 0 : y2.htmlFor, passive: b2 = false, ...i2 } = n2, u2 = y$4(l2);
  n$6(() => e2.register(t2), [t2, e2.register]);
  let d2 = o$5((s2) => {
    let g2 = s2.currentTarget;
    if (!(s2.target !== s2.currentTarget && L$2(s2.target)) && (m$3(g2) && s2.preventDefault(), e2.props && "onClick" in e2.props && typeof e2.props.onClick == "function" && e2.props.onClick(s2), m$3(g2))) {
      let r2 = document.getElementById(g2.htmlFor);
      if (r2) {
        let E2 = r2.getAttribute("disabled");
        if (E2 === "true" || E2 === "") return;
        let x2 = r2.getAttribute("aria-disabled");
        if (x2 === "true" || x2 === "") return;
        (l$2(r2) && (r2.type === "file" || r2.type === "radio" || r2.type === "checkbox") || r2.role === "radio" || r2.role === "checkbox" || r2.role === "switch") && r2.click(), r2.focus({ preventScroll: true });
      }
    }
  }), f2 = n$5({ ...e2.slot, disabled: T3 || false }), c2 = { ref: u2, ...e2.props, id: t2, htmlFor: p2, onClick: d2 };
  return b2 && ("onClick" in c2 && (delete c2.htmlFor, delete c2.onClick), "onClick" in i2 && delete i2.onClick), K()({ ourProps: c2, theirProps: i2, slot: f2, defaultTag: p2 ? G$1 : "div", name: e2.name || "Label" });
}
let j$4 = Y(U), Z = Object.assign(j$4, {});
function l$1(e2, r2) {
  return e2 !== null && r2 !== null && typeof e2 == "object" && typeof r2 == "object" && "id" in e2 && "id" in r2 ? e2.id === r2.id : e2 === r2;
}
function u$8(e2 = l$1) {
  return reactExports.useCallback((r2, t2) => {
    if (typeof e2 == "string") {
      let o4 = e2;
      return (r2 == null ? void 0 : r2[o4]) === (t2 == null ? void 0 : t2[o4]);
    }
    return e2(r2, t2);
  }, [e2]);
}
function h$3(i2) {
  if (i2 === null) return { width: 0, height: 0 };
  let { width: t2, height: e2 } = i2.getBoundingClientRect();
  return { width: t2, height: e2 };
}
function w$1(i2, t2, e2 = false) {
  let [r2, f2] = reactExports.useState(() => h$3(t2));
  return n$6(() => {
    if (!t2 || !i2) return;
    let n2 = o$6();
    return n2.requestAnimationFrame(function s2() {
      n2.requestAnimationFrame(s2), f2((u2) => {
        let o4 = h$3(t2);
        return o4.width === u2.width && o4.height === u2.height ? u2 : o4;
      });
    }), () => {
      n2.dispose();
    };
  }, [t2, i2]), e2 ? { width: `${r2.width}px`, height: `${r2.height}px` } : r2;
}
var g$1 = ((f2) => (f2[f2.Left = 0] = "Left", f2[f2.Right = 2] = "Right", f2))(g$1 || {});
function s$4(t2) {
  let r2 = reactExports.useRef(null), u2 = o$5((e2) => {
    r2.current = e2.pointerType, !s$5(e2.currentTarget) && e2.pointerType === "mouse" && e2.button === g$1.Left && (e2.preventDefault(), t2(e2));
  }), i2 = o$5((e2) => {
    r2.current !== "mouse" && (s$5(e2.currentTarget) || t2(e2));
  });
  return { onPointerDown: u2, onClick: i2 };
}
let a$6 = class a extends Map {
  constructor(t2) {
    super();
    this.factory = t2;
  }
  get(t2) {
    let e2 = super.get(t2);
    return e2 === void 0 && (e2 = this.factory(t2), this.set(t2, e2)), e2;
  }
};
var h$2 = Object.defineProperty;
var v$2 = (t2, e2, r2) => e2 in t2 ? h$2(t2, e2, { enumerable: true, configurable: true, writable: true, value: r2 }) : t2[e2] = r2;
var S$3 = (t2, e2, r2) => (v$2(t2, e2 + "", r2), r2), b$1 = (t2, e2, r2) => {
  if (!e2.has(t2)) throw TypeError("Cannot " + r2);
};
var i$3 = (t2, e2, r2) => (b$1(t2, e2, "read from private field"), r2 ? r2.call(t2) : e2.get(t2)), c$7 = (t2, e2, r2) => {
  if (e2.has(t2)) throw TypeError("Cannot add the same private member more than once");
  e2 instanceof WeakSet ? e2.add(t2) : e2.set(t2, r2);
}, u$7 = (t2, e2, r2, s2) => (b$1(t2, e2, "write to private field"), e2.set(t2, r2), r2);
var n$3, a$5, o$2;
let T$2 = class T {
  constructor(e2) {
    c$7(this, n$3, {});
    c$7(this, a$5, new a$6(() => /* @__PURE__ */ new Set()));
    c$7(this, o$2, /* @__PURE__ */ new Set());
    S$3(this, "disposables", o$6());
    u$7(this, n$3, e2), s$9.isServer && this.disposables.microTask(() => {
      this.dispose();
    });
  }
  dispose() {
    this.disposables.dispose();
  }
  get state() {
    return i$3(this, n$3);
  }
  subscribe(e2, r2) {
    if (s$9.isServer) return () => {
    };
    let s2 = { selector: e2, callback: r2, current: e2(i$3(this, n$3)) };
    return i$3(this, o$2).add(s2), this.disposables.add(() => {
      i$3(this, o$2).delete(s2);
    });
  }
  on(e2, r2) {
    return s$9.isServer ? () => {
    } : (i$3(this, a$5).get(e2).add(r2), this.disposables.add(() => {
      i$3(this, a$5).get(e2).delete(r2);
    }));
  }
  send(e2) {
    let r2 = this.reduce(i$3(this, n$3), e2);
    if (r2 !== i$3(this, n$3)) {
      u$7(this, n$3, r2);
      for (let s2 of i$3(this, o$2)) {
        let l2 = s2.selector(i$3(this, n$3));
        j$3(s2.current, l2) || (s2.current = l2, s2.callback(l2));
      }
      for (let s2 of i$3(this, a$5).get(e2.type)) s2(i$3(this, n$3), e2);
    }
  }
};
n$3 = /* @__PURE__ */ new WeakMap(), a$5 = /* @__PURE__ */ new WeakMap(), o$2 = /* @__PURE__ */ new WeakMap();
function j$3(t2, e2) {
  return Object.is(t2, e2) ? true : typeof t2 != "object" || t2 === null || typeof e2 != "object" || e2 === null ? false : Array.isArray(t2) && Array.isArray(e2) ? t2.length !== e2.length ? false : f$6(t2[Symbol.iterator](), e2[Symbol.iterator]()) : t2 instanceof Map && e2 instanceof Map || t2 instanceof Set && e2 instanceof Set ? t2.size !== e2.size ? false : f$6(t2.entries(), e2.entries()) : p$4(t2) && p$4(e2) ? f$6(Object.entries(t2)[Symbol.iterator](), Object.entries(e2)[Symbol.iterator]()) : false;
}
function f$6(t2, e2) {
  do {
    let r2 = t2.next(), s2 = e2.next();
    if (r2.done && s2.done) return true;
    if (r2.done || s2.done || !Object.is(r2.value, s2.value)) return false;
  } while (true);
}
function p$4(t2) {
  if (Object.prototype.toString.call(t2) !== "[object Object]") return false;
  let e2 = Object.getPrototypeOf(t2);
  return e2 === null || Object.getPrototypeOf(e2) === null;
}
var a$4 = Object.defineProperty;
var r$2 = (e2, c2, t2) => c2 in e2 ? a$4(e2, c2, { enumerable: true, configurable: true, writable: true, value: t2 }) : e2[c2] = t2;
var p$3 = (e2, c2, t2) => (r$2(e2, typeof c2 != "symbol" ? c2 + "" : c2, t2), t2);
var k$3 = ((t2) => (t2[t2.Push = 0] = "Push", t2[t2.Pop = 1] = "Pop", t2))(k$3 || {});
let y$3 = { [0](e2, c2) {
  let t2 = c2.id, s2 = e2.stack, i2 = e2.stack.indexOf(t2);
  if (i2 !== -1) {
    let n2 = e2.stack.slice();
    return n2.splice(i2, 1), n2.push(t2), s2 = n2, { ...e2, stack: s2 };
  }
  return { ...e2, stack: [...e2.stack, t2] };
}, [1](e2, c2) {
  let t2 = c2.id, s2 = e2.stack.indexOf(t2);
  if (s2 === -1) return e2;
  let i2 = e2.stack.slice();
  return i2.splice(s2, 1), { ...e2, stack: i2 };
} };
let o$1 = class o2 extends T$2 {
  constructor() {
    super(...arguments);
    p$3(this, "actions", { push: (t2) => this.send({ type: 0, id: t2 }), pop: (t2) => this.send({ type: 1, id: t2 }) });
    p$3(this, "selectors", { isTop: (t2, s2) => t2.stack[t2.stack.length - 1] === s2, inStack: (t2, s2) => t2.stack.includes(s2) });
  }
  static new() {
    return new o2({ stack: [] });
  }
  reduce(t2, s2) {
    return u$c(s2.type, y$3, t2, s2);
  }
};
const x$1 = new a$6(() => o$1.new());
function S$2(e2, n2, r2 = j$3) {
  return withSelectorExports.useSyncExternalStoreWithSelector(o$5((i2) => e2.subscribe(s$3, i2)), o$5(() => e2.state), o$5(() => e2.state), o$5(n2), r2);
}
function s$3(e2) {
  return e2;
}
function I$3(o4, s2) {
  let t2 = reactExports.useId(), r2 = x$1.get(s2), [i2, c2] = S$2(r2, reactExports.useCallback((e2) => [r2.selectors.isTop(e2, t2), r2.selectors.inStack(e2, t2)], [r2, t2]));
  return n$6(() => {
    if (o4) return r2.actions.push(t2), () => r2.actions.pop(t2);
  }, [r2, o4, t2]), o4 ? c2 ? i2 : true : false;
}
let f$5 = /* @__PURE__ */ new Map(), u$6 = /* @__PURE__ */ new Map();
function h$1(t2) {
  var e2;
  let r2 = (e2 = u$6.get(t2)) != null ? e2 : 0;
  return u$6.set(t2, r2 + 1), r2 !== 0 ? () => m$2(t2) : (f$5.set(t2, { "aria-hidden": t2.getAttribute("aria-hidden"), inert: t2.inert }), t2.setAttribute("aria-hidden", "true"), t2.inert = true, () => m$2(t2));
}
function m$2(t2) {
  var i2;
  let r2 = (i2 = u$6.get(t2)) != null ? i2 : 1;
  if (r2 === 1 ? u$6.delete(t2) : u$6.set(t2, r2 - 1), r2 !== 1) return;
  let e2 = f$5.get(t2);
  e2 && (e2["aria-hidden"] === null ? t2.removeAttribute("aria-hidden") : t2.setAttribute("aria-hidden", e2["aria-hidden"]), t2.inert = e2.inert, f$5.delete(t2));
}
function y$2(t2, { allowed: r2, disallowed: e2 } = {}) {
  let i2 = I$3(t2, "inert-others");
  n$6(() => {
    var d2, c2;
    if (!i2) return;
    let a3 = o$6();
    for (let n2 of (d2 = e2 == null ? void 0 : e2()) != null ? d2 : []) n2 && a3.add(h$1(n2));
    let s2 = (c2 = r2 == null ? void 0 : r2()) != null ? c2 : [];
    for (let n2 of s2) {
      if (!n2) continue;
      let l2 = l$5(n2);
      if (!l2) continue;
      let o4 = n2.parentElement;
      for (; o4 && o4 !== l2.body; ) {
        for (let p2 of o4.children) s2.some((E2) => p2.contains(E2)) || a3.add(h$1(p2));
        o4 = o4.parentElement;
      }
    }
    return a3.dispose;
  }, [i2, r2, e2]);
}
function p$2(s2, n2, o4) {
  let i2 = s$8((t2) => {
    let e2 = t2.getBoundingClientRect();
    e2.x === 0 && e2.y === 0 && e2.width === 0 && e2.height === 0 && o4();
  });
  reactExports.useEffect(() => {
    if (!s2) return;
    let t2 = n2 === null ? null : n$4(n2) ? n2 : n2.current;
    if (!t2) return;
    let e2 = o$6();
    if (typeof ResizeObserver != "undefined") {
      let r2 = new ResizeObserver(() => i2.current(t2));
      r2.observe(t2), e2.add(() => r2.disconnect());
    }
    if (typeof IntersectionObserver != "undefined") {
      let r2 = new IntersectionObserver(() => i2.current(t2));
      r2.observe(t2), e2.add(() => r2.disconnect());
    }
    return () => e2.dispose();
  }, [n2, i2, s2]);
}
let E$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "details>summary", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var T$1 = ((o4) => (o4[o4.First = 1] = "First", o4[o4.Previous = 2] = "Previous", o4[o4.Next = 4] = "Next", o4[o4.Last = 8] = "Last", o4[o4.WrapAround = 16] = "WrapAround", o4[o4.NoScroll = 32] = "NoScroll", o4[o4.AutoFocus = 64] = "AutoFocus", o4))(T$1 || {}), A$1 = ((n2) => (n2[n2.Error = 0] = "Error", n2[n2.Overflow = 1] = "Overflow", n2[n2.Success = 2] = "Success", n2[n2.Underflow = 3] = "Underflow", n2))(A$1 || {}), O$1 = ((t2) => (t2[t2.Previous = -1] = "Previous", t2[t2.Next = 1] = "Next", t2))(O$1 || {});
var I$2 = ((t2) => (t2[t2.Strict = 0] = "Strict", t2[t2.Loose = 1] = "Loose", t2))(I$2 || {});
function H$1(e2, r2 = 0) {
  var t2;
  return e2 === ((t2 = l$5(e2)) == null ? void 0 : t2.body) ? false : u$c(r2, { [0]() {
    return e2.matches(E$1);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(E$1)) return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
var g = ((t2) => (t2[t2.Keyboard = 0] = "Keyboard", t2[t2.Mouse = 1] = "Mouse", t2))(g || {});
typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e2) => {
  e2.metaKey || e2.altKey || e2.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true), document.addEventListener("click", (e2) => {
  e2.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e2.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true));
function G(e2, r2 = (t2) => t2) {
  return e2.slice().sort((t2, l2) => {
    let n2 = r2(t2), a3 = r2(l2);
    if (n2 === null || a3 === null) return 0;
    let u2 = n2.compareDocumentPosition(a3);
    return u2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : u2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function t$2() {
  return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
}
function i$2() {
  return /Android/gi.test(window.navigator.userAgent);
}
function n$2() {
  return t$2() || i$2();
}
function i$1(t2, e2, o4, n2) {
  let u2 = s$8(o4);
  reactExports.useEffect(() => {
    if (!t2) return;
    function r2(m2) {
      u2.current(m2);
    }
    return document.addEventListener(e2, r2, n2), () => document.removeEventListener(e2, r2, n2);
  }, [t2, e2, n2]);
}
function s$2(t2, e2, o4, n2) {
  let i2 = s$8(o4);
  reactExports.useEffect(() => {
    if (!t2) return;
    function r2(d2) {
      i2.current(d2);
    }
    return window.addEventListener(e2, r2, n2), () => window.removeEventListener(e2, r2, n2);
  }, [t2, e2, n2]);
}
const C$1 = 30;
function k$2(o4, f2, h2) {
  let m2 = s$8(h2), s2 = reactExports.useCallback(function(e2, c2) {
    if (e2.defaultPrevented) return;
    let r2 = c2(e2);
    if (r2 === null || !r2.getRootNode().contains(r2) || !r2.isConnected) return;
    let M2 = (function u2(n2) {
      return typeof n2 == "function" ? u2(n2()) : Array.isArray(n2) || n2 instanceof Set ? n2 : [n2];
    })(f2);
    for (let u2 of M2) if (u2 !== null && (u2.contains(r2) || e2.composed && e2.composedPath().includes(u2))) return;
    return !H$1(r2, I$2.Loose) && r2.tabIndex !== -1 && e2.preventDefault(), m2.current(e2, r2);
  }, [m2, f2]), i2 = reactExports.useRef(null);
  i$1(o4, "pointerdown", (t2) => {
    var e2, c2;
    n$2() || (i2.current = ((c2 = (e2 = t2.composedPath) == null ? void 0 : e2.call(t2)) == null ? void 0 : c2[0]) || t2.target);
  }, true), i$1(o4, "pointerup", (t2) => {
    if (n$2() || !i2.current) return;
    let e2 = i2.current;
    return i2.current = null, s2(t2, () => e2);
  }, true);
  let l2 = reactExports.useRef({ x: 0, y: 0 });
  i$1(o4, "touchstart", (t2) => {
    l2.current.x = t2.touches[0].clientX, l2.current.y = t2.touches[0].clientY;
  }, true), i$1(o4, "touchend", (t2) => {
    let e2 = { x: t2.changedTouches[0].clientX, y: t2.changedTouches[0].clientY };
    if (!(Math.abs(e2.x - l2.current.x) >= C$1 || Math.abs(e2.y - l2.current.y) >= C$1)) return s2(t2, () => i$4(t2.target) ? t2.target : null);
  }, true), s$2(o4, "blur", (t2) => s2(t2, () => u$a(window.document.activeElement) ? window.document.activeElement : null), true);
}
function u$5(...e2) {
  return reactExports.useMemo(() => l$5(...e2), [...e2]);
}
var H = ((e2) => (e2[e2.Ignore = 0] = "Ignore", e2[e2.Select = 1] = "Select", e2[e2.Close = 2] = "Close", e2))(H || {});
const S$1 = { Ignore: { kind: 0 }, Select: (r2) => ({ kind: 1, target: r2 }), Close: { kind: 2 } }, M$1 = 200, f$4 = 5;
function L(r2, { trigger: n2, action: T3, close: e2, select: p2 }) {
  let l2 = reactExports.useRef(null), i2 = reactExports.useRef(null), u2 = reactExports.useRef(null);
  i$1(r2 && n2 !== null, "pointerdown", (t2) => {
    o$4(t2 == null ? void 0 : t2.target) && n2 != null && n2.contains(t2.target) && (i2.current = t2.x, u2.current = t2.y, l2.current = t2.timeStamp);
  }), i$1(r2 && n2 !== null, "pointerup", (t2) => {
    var s2, m2;
    let c2 = l2.current;
    if (c2 === null || (l2.current = null, !i$4(t2.target)) || Math.abs(t2.x - ((s2 = i2.current) != null ? s2 : t2.x)) < f$4 && Math.abs(t2.y - ((m2 = u2.current) != null ? m2 : t2.y)) < f$4) return;
    let a3 = T3(t2);
    switch (a3.kind) {
      case 0:
        return;
      case 1: {
        t2.timeStamp - c2 > M$1 && (p2(a3.target), e2());
        break;
      }
      case 2: {
        e2();
        break;
      }
    }
  }, { capture: true });
}
function E(n2, e2, a3, t2) {
  let i2 = s$8(a3);
  reactExports.useEffect(() => {
    n2 = n2 != null ? n2 : window;
    function r2(o4) {
      i2.current(o4);
    }
    return n2.addEventListener(e2, r2, t2), () => n2.removeEventListener(e2, r2, t2);
  }, [n2, e2, t2]);
}
function v$1(e2) {
  let l2 = reactExports.useRef({ value: "", selectionStart: null, selectionEnd: null });
  return E(e2, "blur", (n2) => {
    let t2 = n2.target;
    l$2(t2) && (l2.current = { value: t2.value, selectionStart: t2.selectionStart, selectionEnd: t2.selectionEnd });
  }), o$5(() => {
    if (!d$1(e2) && l$2(e2) && e2.isConnected) {
      if (e2.focus({ preventScroll: true }), e2.value !== l2.current.value) e2.setSelectionRange(e2.value.length, e2.value.length);
      else {
        let { selectionStart: n2, selectionEnd: t2 } = l2.current;
        n2 !== null && t2 !== null && e2.setSelectionRange(n2, t2);
      }
      l2.current = { value: "", selectionStart: null, selectionEnd: null };
    }
  });
}
function e$1(t2, u2) {
  return reactExports.useMemo(() => {
    var n2;
    if (t2.type) return t2.type;
    let r2 = (n2 = t2.as) != null ? n2 : "button";
    if (typeof r2 == "string" && r2.toLowerCase() === "button" || (u2 == null ? void 0 : u2.tagName) === "BUTTON" && !u2.hasAttribute("type")) return "button";
  }, [t2.type, t2.as, u2]);
}
function o3(t2) {
  return reactExports.useSyncExternalStore(t2.subscribe, t2.getSnapshot, t2.getSnapshot);
}
function a$3(o4, r2) {
  let t2 = o4(), n2 = /* @__PURE__ */ new Set();
  return { getSnapshot() {
    return t2;
  }, subscribe(e2) {
    return n2.add(e2), () => n2.delete(e2);
  }, dispatch(e2, ...s2) {
    let i2 = r2[e2].call(t2, ...s2);
    i2 && (t2 = i2, n2.forEach((c2) => c2()));
  } };
}
function d() {
  let r2;
  return { before({ doc: e2 }) {
    var l2;
    let o4 = e2.documentElement, t2 = (l2 = e2.defaultView) != null ? l2 : window;
    r2 = Math.max(0, t2.innerWidth - o4.clientWidth);
  }, after({ doc: e2, d: o4 }) {
    let t2 = e2.documentElement, l2 = Math.max(0, t2.clientWidth - t2.offsetWidth), n2 = Math.max(0, r2 - l2);
    o4.style(t2, "paddingRight", `${n2}px`);
  } };
}
function w() {
  return t$2() ? { before({ doc: o4, d: r2, meta: m2 }) {
    function a3(s2) {
      for (let l2 of m2().containers) for (let c2 of l2()) if (c2.contains(s2)) return true;
      return false;
    }
    r2.microTask(() => {
      var c2;
      if (window.getComputedStyle(o4.documentElement).scrollBehavior !== "auto") {
        let t2 = o$6();
        t2.style(o4.documentElement, "scrollBehavior", "auto"), r2.add(() => r2.microTask(() => t2.dispose()));
      }
      let s2 = (c2 = window.scrollY) != null ? c2 : window.pageYOffset, l2 = null;
      r2.addEventListener(o4, "click", (t2) => {
        if (i$4(t2.target)) try {
          let e2 = t2.target.closest("a");
          if (!e2) return;
          let { hash: n2 } = new URL(e2.href), f2 = o4.querySelector(n2);
          i$4(f2) && !a3(f2) && (l2 = f2);
        } catch {
        }
      }, true), r2.group((t2) => {
        r2.addEventListener(o4, "touchstart", (e2) => {
          if (t2.dispose(), i$4(e2.target) && r$4(e2.target)) if (a3(e2.target)) {
            let n2 = e2.target;
            for (; n2.parentElement && a3(n2.parentElement); ) n2 = n2.parentElement;
            t2.style(n2, "overscrollBehavior", "contain");
          } else t2.style(e2.target, "touchAction", "none");
        });
      }), r2.addEventListener(o4, "touchmove", (t2) => {
        if (i$4(t2.target)) {
          if (l$2(t2.target)) return;
          if (a3(t2.target)) {
            let e2 = t2.target;
            for (; e2.parentElement && e2.dataset.headlessuiPortal !== "" && !(e2.scrollHeight > e2.clientHeight || e2.scrollWidth > e2.clientWidth); ) e2 = e2.parentElement;
            e2.dataset.headlessuiPortal === "" && t2.preventDefault();
          } else t2.preventDefault();
        }
      }, { passive: false }), r2.add(() => {
        var e2;
        let t2 = (e2 = window.scrollY) != null ? e2 : window.pageYOffset;
        s2 !== t2 && window.scrollTo(0, s2), l2 && l2.isConnected && (l2.scrollIntoView({ block: "nearest" }), l2 = null);
      });
    });
  } } : {};
}
function r$1() {
  return { before({ doc: e2, d: o4 }) {
    o4.style(e2.documentElement, "overflow", "hidden");
  } };
}
function r(e2) {
  let o4 = {};
  for (let t2 of e2) Object.assign(o4, t2(o4));
  return o4;
}
let c$6 = a$3(() => /* @__PURE__ */ new Map(), { PUSH(e2, o4) {
  var n2;
  let t2 = (n2 = this.get(e2)) != null ? n2 : { doc: e2, count: 0, d: o$6(), meta: /* @__PURE__ */ new Set(), computedMeta: {} };
  return t2.count++, t2.meta.add(o4), t2.computedMeta = r(t2.meta), this.set(e2, t2), this;
}, POP(e2, o4) {
  let t2 = this.get(e2);
  return t2 && (t2.count--, t2.meta.delete(o4), t2.computedMeta = r(t2.meta)), this;
}, SCROLL_PREVENT(e2) {
  let o4 = { doc: e2.doc, d: e2.d, meta() {
    return e2.computedMeta;
  } }, t2 = [w(), d(), r$1()];
  t2.forEach(({ before: n2 }) => n2 == null ? void 0 : n2(o4)), t2.forEach(({ after: n2 }) => n2 == null ? void 0 : n2(o4));
}, SCROLL_ALLOW({ d: e2 }) {
  e2.dispose();
}, TEARDOWN({ doc: e2 }) {
  this.delete(e2);
} });
c$6.subscribe(() => {
  let e2 = c$6.getSnapshot(), o4 = /* @__PURE__ */ new Map();
  for (let [t2] of e2) o4.set(t2, t2.documentElement.style.overflow);
  for (let t2 of e2.values()) {
    let n2 = o4.get(t2.doc) === "hidden", a3 = t2.count !== 0;
    (a3 && !n2 || !a3 && n2) && c$6.dispatch(t2.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t2), t2.count === 0 && c$6.dispatch("TEARDOWN", t2);
  }
});
function a$2(r2, e2, n2 = () => ({ containers: [] })) {
  let f2 = o3(c$6), o$12 = e2 ? f2.get(e2) : void 0, i2 = o$12 ? o$12.count > 0 : false;
  return n$6(() => {
    if (!(!e2 || !r2)) return c$6.dispatch("PUSH", e2, n2), () => c$6.dispatch("POP", e2, n2);
  }, [r2, e2]), i2;
}
function f$3(e2, c2, n2 = () => [document.body]) {
  let r2 = I$3(e2, "scroll-lock");
  a$2(r2, c2, (t2) => {
    var o4;
    return { containers: [...(o4 = t2.containers) != null ? o4 : [], n2] };
  });
}
function t$1(e2) {
  return [e2.screenX, e2.screenY];
}
function u$4() {
  let e2 = reactExports.useRef([-1, -1]);
  return { wasMoved(r2) {
    let n2 = t$1(r2);
    return e2.current[0] === n2[0] && e2.current[1] === n2[1] ? false : (e2.current = n2, true);
  }, update(r2) {
    e2.current = t$1(r2);
  } };
}
function c$5(u2 = 0) {
  let [r2, a3] = reactExports.useState(u2), g2 = reactExports.useCallback((e2) => a3(e2), []), s2 = reactExports.useCallback((e2) => a3((l2) => l2 | e2), []), m2 = reactExports.useCallback((e2) => (r2 & e2) === e2, [r2]), n2 = reactExports.useCallback((e2) => a3((l2) => l2 & ~e2), []), F2 = reactExports.useCallback((e2) => a3((l2) => l2 ^ e2), []);
  return { flags: r2, setFlag: g2, addFlag: s2, hasFlag: m2, removeFlag: n2, toggleFlag: F2 };
}
var T2, S;
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T2 = process == null ? void 0 : process.env) == null ? void 0 : T2["NODE_ENV"]) === "test" && typeof ((S = Element == null ? void 0 : Element.prototype) == null ? void 0 : S.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var A = ((i2) => (i2[i2.None = 0] = "None", i2[i2.Closed = 1] = "Closed", i2[i2.Enter = 2] = "Enter", i2[i2.Leave = 4] = "Leave", i2))(A || {});
function x(e2) {
  let r2 = {};
  for (let t2 in e2) e2[t2] === true && (r2[`data-${t2}`] = "");
  return r2;
}
function N(e2, r2, t2, n2) {
  let [i2, a3] = reactExports.useState(t2), { hasFlag: s2, addFlag: o4, removeFlag: l2 } = c$5(e2 && i2 ? 3 : 0), u2 = reactExports.useRef(false), f2 = reactExports.useRef(false), E2 = p$6();
  return n$6(() => {
    var d2;
    if (e2) {
      if (t2 && a3(true), !r2) {
        t2 && o4(3);
        return;
      }
      return (d2 = void 0) == null || d2.call(n2, t2), C(r2, { inFlight: u2, prepare() {
        f2.current ? f2.current = false : f2.current = u2.current, u2.current = true, !f2.current && (t2 ? (o4(3), l2(4)) : (o4(4), l2(2)));
      }, run() {
        f2.current ? t2 ? (l2(3), o4(4)) : (l2(4), o4(3)) : t2 ? l2(1) : o4(1);
      }, done() {
        var p2;
        f2.current && D$3(r2) || (u2.current = false, l2(7), t2 || a3(false), (p2 = void 0) == null || p2.call(n2, t2));
      } });
    }
  }, [e2, t2, r2, E2]), e2 ? [i2, { closed: s2(1), enter: s2(2), leave: s2(4), transition: s2(2) || s2(4) }] : [t2, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C(e2, { prepare: r2, run: t2, done: n2, inFlight: i2 }) {
  let a3 = o$6();
  return j$2(e2, { prepare: r2, inFlight: i2 }), a3.nextFrame(() => {
    t2(), a3.requestAnimationFrame(() => {
      a3.add(M(e2, n2));
    });
  }), a3.dispose;
}
function M(e2, r2) {
  var a3, s2;
  let t2 = o$6();
  if (!e2) return t2.dispose;
  let n2 = false;
  t2.add(() => {
    n2 = true;
  });
  let i2 = (s2 = (a3 = e2.getAnimations) == null ? void 0 : a3.call(e2).filter((o4) => o4 instanceof CSSTransition)) != null ? s2 : [];
  return i2.length === 0 ? (r2(), t2.dispose) : (Promise.allSettled(i2.map((o4) => o4.finished)).then(() => {
    n2 || r2();
  }), t2.dispose);
}
function j$2(e2, { inFlight: r2, prepare: t2 }) {
  if (r2 != null && r2.current) {
    t2();
    return;
  }
  let n2 = e2.style.transition;
  e2.style.transition = "none", t2(), e2.offsetHeight, e2.style.transition = n2;
}
function D$3(e2) {
  var t2, n2;
  return ((n2 = (t2 = e2.getAnimations) == null ? void 0 : t2.call(e2)) != null ? n2 : []).some((i2) => i2 instanceof CSSTransition && i2.playState !== "finished");
}
function F(c2, { container: e2, accept: t2, walk: r2 }) {
  let o4 = reactExports.useRef(t2), l2 = reactExports.useRef(r2);
  reactExports.useEffect(() => {
    o4.current = t2, l2.current = r2;
  }, [t2, r2]), n$6(() => {
    if (!e2 || !c2) return;
    let n2 = l$5(e2);
    if (!n2) return;
    let f2 = o4.current, p2 = l2.current, i2 = Object.assign((m2) => f2(m2), { acceptNode: f2 }), u2 = n2.createTreeWalker(e2, NodeFilter.SHOW_ELEMENT, i2, false);
    for (; u2.nextNode(); ) p2(u2.currentNode);
  }, [e2, c2, o4, l2]);
}
function m$1(u2, t2) {
  let e2 = reactExports.useRef([]), r2 = o$5(u2);
  reactExports.useEffect(() => {
    let o4 = [...e2.current];
    for (let [a3, l2] of t2.entries()) if (e2.current[a3] !== l2) {
      let n2 = r2(t2, o4);
      return e2.current = t2, n2;
    }
  }, [r2, ...t2]);
}
let y$1 = reactExports.createContext({ styles: void 0, setReference: () => {
}, setFloating: () => {
}, getReferenceProps: () => ({}), getFloatingProps: () => ({}), slot: {} });
y$1.displayName = "FloatingContext";
let $ = reactExports.createContext(null);
$.displayName = "PlacementContext";
function ye(e2) {
  return reactExports.useMemo(() => e2 ? typeof e2 == "string" ? { to: e2 } : e2 : null, [e2]);
}
function Fe() {
  return reactExports.useContext(y$1).setReference;
}
function Te() {
  let { getFloatingProps: e2, slot: t2 } = reactExports.useContext(y$1);
  return reactExports.useCallback((...n2) => Object.assign({}, e2(...n2), { "data-anchor": t2.anchor }), [e2, t2]);
}
function Re(e2 = null) {
  e2 === false && (e2 = null), typeof e2 == "string" && (e2 = { to: e2 });
  let t2 = reactExports.useContext($), n2 = reactExports.useMemo(() => e2, [JSON.stringify(e2, (l2, o4) => {
    var u2;
    return (u2 = o4 == null ? void 0 : o4.outerHTML) != null ? u2 : o4;
  })]);
  n$6(() => {
    t2 == null || t2(n2 != null ? n2 : null);
  }, [t2, n2]);
  let r2 = reactExports.useContext(y$1);
  return reactExports.useMemo(() => [r2.setFloating, e2 ? r2.styles : {}], [r2.setFloating, e2, r2.styles]);
}
let D$2 = 4;
function Ae({ children: e2, enabled: t2 = true }) {
  let [n2, r2] = reactExports.useState(null), [l2, o4] = reactExports.useState(0), u2 = reactExports.useRef(null), [f2, s2] = reactExports.useState(null);
  ce(f2);
  let i2 = t2 && n2 !== null && f2 !== null, { to: F2 = "bottom", gap: E2 = 0, offset: A2 = 0, padding: c2 = 0, inner: h2 } = ge(n2, f2), [a3, p2 = "center"] = F2.split(" ");
  n$6(() => {
    i2 && o4(0);
  }, [i2]);
  let { refs: b2, floatingStyles: S2, context: g2 } = useFloating({ open: i2, placement: a3 === "selection" ? p2 === "center" ? "bottom" : `bottom-${p2}` : p2 === "center" ? `${a3}` : `${a3}-${p2}`, strategy: "absolute", transform: false, middleware: [offset({ mainAxis: a3 === "selection" ? 0 : E2, crossAxis: A2 }), shift({ padding: c2 }), a3 !== "selection" && flip({ padding: c2 }), a3 === "selection" && h2 ? inner({ ...h2, padding: c2, overflowRef: u2, offset: l2, minItemsVisible: D$2, referenceOverflowThreshold: c2, onFallbackChange(P2) {
    var L2, N2;
    if (!P2) return;
    let d2 = g2.elements.floating;
    if (!d2) return;
    let M2 = parseFloat(getComputedStyle(d2).scrollPaddingBottom) || 0, I2 = Math.min(D$2, d2.childElementCount), W = 0, B2 = 0;
    for (let m2 of (N2 = (L2 = g2.elements.floating) == null ? void 0 : L2.childNodes) != null ? N2 : []) if (n$4(m2)) {
      let x2 = m2.offsetTop, k2 = x2 + m2.clientHeight + M2, H2 = d2.scrollTop, U2 = H2 + d2.clientHeight;
      if (x2 >= H2 && k2 <= U2) I2--;
      else {
        B2 = Math.max(0, Math.min(k2, U2) - Math.max(x2, H2)), W = m2.clientHeight;
        break;
      }
    }
    I2 >= 1 && o4((m2) => {
      let x2 = W * I2 - B2 + M2;
      return m2 >= x2 ? m2 : x2;
    });
  } }) : null, size({ padding: c2, apply({ availableWidth: P2, availableHeight: d2, elements: M2 }) {
    Object.assign(M2.floating.style, { overflow: "auto", maxWidth: `${P2}px`, maxHeight: `min(var(--anchor-max-height, 100vh), ${d2}px)` });
  } })].filter(Boolean), whileElementsMounted: autoUpdate }), [w2 = a3, V2 = p2] = g2.placement.split("-");
  a3 === "selection" && (w2 = "selection");
  let G2 = reactExports.useMemo(() => ({ anchor: [w2, V2].filter(Boolean).join(" ") }), [w2, V2]), K2 = useInnerOffset(g2, { overflowRef: u2, onChange: o4 }), { getReferenceProps: Q, getFloatingProps: X2 } = useInteractions([K2]), Y2 = o$5((P2) => {
    s2(P2), b2.setFloating(P2);
  });
  return reactExports.createElement($.Provider, { value: r2 }, reactExports.createElement(y$1.Provider, { value: { setFloating: Y2, setReference: b2.setReference, styles: S2, getReferenceProps: Q, getFloatingProps: X2, slot: G2 } }, e2));
}
function ce(e2) {
  n$6(() => {
    if (!e2) return;
    let t2 = new MutationObserver(() => {
      let n2 = window.getComputedStyle(e2).maxHeight, r2 = parseFloat(n2);
      if (isNaN(r2)) return;
      let l2 = parseInt(n2);
      isNaN(l2) || r2 !== l2 && (e2.style.maxHeight = `${Math.ceil(r2)}px`);
    });
    return t2.observe(e2, { attributes: true, attributeFilter: ["style"] }), () => {
      t2.disconnect();
    };
  }, [e2]);
}
function ge(e2, t2) {
  var o4, u2, f2;
  let n2 = O((o4 = e2 == null ? void 0 : e2.gap) != null ? o4 : "var(--anchor-gap, 0)", t2), r2 = O((u2 = e2 == null ? void 0 : e2.offset) != null ? u2 : "var(--anchor-offset, 0)", t2), l2 = O((f2 = e2 == null ? void 0 : e2.padding) != null ? f2 : "var(--anchor-padding, 0)", t2);
  return { ...e2, gap: n2, offset: r2, padding: l2 };
}
function O(e2, t2, n2 = void 0) {
  let r2 = p$6(), l2 = o$5((s2, i2) => {
    if (s2 == null) return [n2, null];
    if (typeof s2 == "number") return [s2, null];
    if (typeof s2 == "string") {
      if (!i2) return [n2, null];
      let F2 = J$1(s2, i2);
      return [F2, (E2) => {
        let A2 = q(s2);
        {
          let c2 = A2.map((h2) => window.getComputedStyle(i2).getPropertyValue(h2));
          r2.requestAnimationFrame(function h2() {
            r2.nextFrame(h2);
            let a3 = false;
            for (let [b2, S2] of A2.entries()) {
              let g2 = window.getComputedStyle(i2).getPropertyValue(S2);
              if (c2[b2] !== g2) {
                c2[b2] = g2, a3 = true;
                break;
              }
            }
            if (!a3) return;
            let p2 = J$1(s2, i2);
            F2 !== p2 && (E2(p2), F2 = p2);
          });
        }
        return r2.dispose;
      }];
    }
    return [n2, null];
  }), o4 = reactExports.useMemo(() => l2(e2, t2)[0], [e2, t2]), [u2 = o4, f2] = reactExports.useState();
  return n$6(() => {
    let [s2, i2] = l2(e2, t2);
    if (f2(s2), !!i2) return i2(f2);
  }, [e2, t2]), u2;
}
function q(e2) {
  let t2 = /var\((.*)\)/.exec(e2);
  if (t2) {
    let n2 = t2[1].indexOf(",");
    if (n2 === -1) return [t2[1]];
    let r2 = t2[1].slice(0, n2).trim(), l2 = t2[1].slice(n2 + 1).trim();
    return l2 ? [r2, ...q(l2)] : [r2];
  }
  return [];
}
function J$1(e2, t2) {
  let n2 = document.createElement("div");
  t2.appendChild(n2), n2.style.setProperty("margin-top", "0px", "important"), n2.style.setProperty("margin-top", e2, "important");
  let r2 = parseFloat(window.getComputedStyle(n2).marginTop) || 0;
  return t2.removeChild(n2), r2;
}
function f$2({ children: t2, freeze: e2 }, o4) {
  let n2 = u$3(e2, t2);
  return reactExports.isValidElement(n2) ? reactExports.cloneElement(n2, { ref: o4 }) : React.createElement(React.Fragment, null, n2);
}
const s$1 = React.forwardRef(f$2);
function u$3(t2, e2) {
  let [o4, n2] = reactExports.useState(e2);
  return !t2 && o4 !== e2 && n2(e2), t2 ? o4 : e2;
}
let n$1 = reactExports.createContext(null);
n$1.displayName = "OpenClosedContext";
var i = ((e2) => (e2[e2.Open = 1] = "Open", e2[e2.Closed = 2] = "Closed", e2[e2.Closing = 4] = "Closing", e2[e2.Opening = 8] = "Opening", e2))(i || {});
function u$2() {
  return reactExports.useContext(n$1);
}
function c$4({ value: o4, children: t2 }) {
  return React.createElement(n$1.Provider, { value: o4 }, t2);
}
function t(n2) {
  function e2() {
    document.readyState !== "loading" && (n2(), document.removeEventListener("DOMContentLoaded", e2));
  }
  typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("DOMContentLoaded", e2), e2());
}
let n = [];
t(() => {
  function e2(t2) {
    if (!i$4(t2.target) || t2.target === document.body || n[0] === t2.target) return;
    let r2 = t2.target;
    r2 = r2.closest(E$1), n.unshift(r2 != null ? r2 : t2.target), n = n.filter((o4) => o4 != null && o4.isConnected), n.splice(10);
  }
  window.addEventListener("click", e2, { capture: true }), window.addEventListener("mousedown", e2, { capture: true }), window.addEventListener("focus", e2, { capture: true }), document.body.addEventListener("click", e2, { capture: true }), document.body.addEventListener("mousedown", e2, { capture: true }), document.body.addEventListener("focus", e2, { capture: true });
});
function u$1(l2) {
  throw new Error("Unexpected object: " + l2);
}
var c$3 = ((i2) => (i2[i2.First = 0] = "First", i2[i2.Previous = 1] = "Previous", i2[i2.Next = 2] = "Next", i2[i2.Last = 3] = "Last", i2[i2.Specific = 4] = "Specific", i2[i2.Nothing = 5] = "Nothing", i2))(c$3 || {});
function f$1(l2, n2) {
  let t2 = n2.resolveItems();
  if (t2.length <= 0) return null;
  let r2 = n2.resolveActiveIndex(), s2 = r2 != null ? r2 : -1;
  switch (l2.focus) {
    case 0: {
      for (let e2 = 0; e2 < t2.length; ++e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
      return r2;
    }
    case 1: {
      s2 === -1 && (s2 = t2.length);
      for (let e2 = s2 - 1; e2 >= 0; --e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
      return r2;
    }
    case 2: {
      for (let e2 = s2 + 1; e2 < t2.length; ++e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
      return r2;
    }
    case 3: {
      for (let e2 = t2.length - 1; e2 >= 0; --e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
      return r2;
    }
    case 4: {
      for (let e2 = 0; e2 < t2.length; ++e2) if (n2.resolveId(t2[e2], e2, t2) === l2.id) return e2;
      return r2;
    }
    case 5:
      return null;
    default:
      u$1(l2);
  }
}
function c$2(t2) {
  let r2 = o$5(t2), e2 = reactExports.useRef(false);
  reactExports.useEffect(() => (e2.current = false, () => {
    e2.current = true, t$5(() => {
      e2.current && r2();
    });
  }), [r2]);
}
function s() {
  let r2 = typeof document == "undefined";
  return "useSyncExternalStore" in t$6 ? ((o4) => o4.useSyncExternalStore)(t$6)(() => () => {
  }, () => false, () => !r2) : false;
}
function l() {
  let r2 = s(), [e2, n2] = reactExports.useState(s$9.isHandoffComplete);
  return e2 && s$9.isHandoffComplete === false && n2(false), reactExports.useEffect(() => {
    e2 !== true && n2(true);
  }, [e2]), reactExports.useEffect(() => s$9.handoff(), []), r2 ? false : e2;
}
let e = reactExports.createContext(false);
function a$1() {
  return reactExports.useContext(e);
}
function j$1(e2) {
  let o4 = a$1(), l2 = reactExports.useContext(c$1), [r2, p2] = reactExports.useState(() => {
    var s2;
    if (!o4 && l2 !== null) return (s2 = l2.current) != null ? s2 : null;
    if (s$9.isServer) return null;
    let t2 = e2 == null ? void 0 : e2.getElementById("headlessui-portal-root");
    if (t2) return t2;
    if (e2 === null) return null;
    let n2 = e2.createElement("div");
    return n2.setAttribute("id", "headlessui-portal-root"), e2.body.appendChild(n2);
  });
  return reactExports.useEffect(() => {
    r2 !== null && (e2 != null && e2.body.contains(r2) || e2 == null || e2.body.appendChild(r2));
  }, [r2, e2]), reactExports.useEffect(() => {
    o4 || l2 !== null && p2(l2.current);
  }, [l2, p2, o4]), r2;
}
let _$1 = reactExports.Fragment, I$1 = Y(function(o4, l$12) {
  let { ownerDocument: r2 = null, ...p2 } = o4, t2 = reactExports.useRef(null), n2 = y$4(T$3((a3) => {
    t2.current = a3;
  }), l$12), s2 = u$5(t2.current), C2 = r2 != null ? r2 : s2, u2 = j$1(C2), y2 = reactExports.useContext(m), g2 = p$6(), v2 = l(), M2 = K();
  return c$2(() => {
    var a3;
    u2 && u2.childNodes.length <= 0 && ((a3 = u2.parentElement) == null || a3.removeChild(u2));
  }), !u2 || !v2 ? null : reactDomExports.createPortal(React.createElement("div", { "data-headlessui-portal": "", ref: (a3) => {
    g2.dispose(), y2 && a3 && g2.add(y2.register(a3));
  } }, M2({ ourProps: { ref: n2 }, theirProps: p2, slot: {}, defaultTag: _$1, name: "Portal" })), u2);
});
function D$1(e2, o4) {
  let l2 = y$4(o4), { enabled: r2 = true, ownerDocument: p2, ...t2 } = e2, n2 = K();
  return r2 ? React.createElement(I$1, { ...t2, ownerDocument: p2, ref: l2 }) : n2({ ourProps: { ref: l2 }, theirProps: t2, slot: {}, defaultTag: _$1, name: "Portal" });
}
let J = reactExports.Fragment, c$1 = reactExports.createContext(null);
function X(e2, o4) {
  let { target: l2, ...r2 } = e2, t2 = { ref: y$4(o4) }, n2 = K();
  return React.createElement(c$1.Provider, { value: l2 }, n2({ ourProps: t2, theirProps: r2, defaultTag: J, name: "Popover.Group" }));
}
let m = reactExports.createContext(null);
let k$1 = Y(D$1), B = Y(X), le = Object.assign(k$1, { Group: B });
const c = { Idle: { kind: "Idle" }, Tracked: (e2) => ({ kind: "Tracked", position: e2 }), Moved: { kind: "Moved" } };
function a2(e2) {
  let t2 = e2.getBoundingClientRect();
  return `${t2.x},${t2.y}`;
}
function p$1(e2, t2, i2) {
  let n2 = o$6();
  if (t2.kind === "Tracked") {
    let o4 = function() {
      d2 !== a2(e2) && (n2.dispose(), i2());
    };
    let { position: d2 } = t2, s2 = new ResizeObserver(o4);
    s2.observe(e2), n2.add(() => s2.disconnect()), n2.addEventListener(window, "scroll", o4, { passive: true }), n2.addEventListener(window, "resize", o4);
  }
  return () => n2.dispose();
}
var I = Object.defineProperty;
var h = (t2, i2, e2) => i2 in t2 ? I(t2, i2, { enumerable: true, configurable: true, writable: true, value: e2 }) : t2[i2] = e2;
var f = (t2, i2, e2) => (h(t2, typeof i2 != "symbol" ? i2 + "" : i2, e2), e2);
var P = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(P || {}), k = ((e2) => (e2[e2.Single = 0] = "Single", e2[e2.Multi = 1] = "Multi", e2))(k || {}), _ = ((n2) => (n2[n2.Pointer = 0] = "Pointer", n2[n2.Focus = 1] = "Focus", n2[n2.Other = 2] = "Other", n2))(_ || {}), D = ((l2) => (l2[l2.OpenCombobox = 0] = "OpenCombobox", l2[l2.CloseCombobox = 1] = "CloseCombobox", l2[l2.GoToOption = 2] = "GoToOption", l2[l2.SetTyping = 3] = "SetTyping", l2[l2.RegisterOption = 4] = "RegisterOption", l2[l2.UnregisterOption = 5] = "UnregisterOption", l2[l2.DefaultToFirstOption = 6] = "DefaultToFirstOption", l2[l2.SetActivationTrigger = 7] = "SetActivationTrigger", l2[l2.UpdateVirtualConfiguration = 8] = "UpdateVirtualConfiguration", l2[l2.SetInputElement = 9] = "SetInputElement", l2[l2.SetButtonElement = 10] = "SetButtonElement", l2[l2.SetOptionsElement = 11] = "SetOptionsElement", l2[l2.MarkInputAsMoved = 12] = "MarkInputAsMoved", l2))(D || {});
function v(t2, i2 = (e2) => e2) {
  let e2 = t2.activeOptionIndex !== null ? t2.options[t2.activeOptionIndex] : null, n2 = i2(t2.options.slice()), o4 = n2.length > 0 && n2[0].dataRef.current.order !== null ? n2.sort((u2, a3) => u2.dataRef.current.order - a3.dataRef.current.order) : G(n2, (u2) => u2.dataRef.current.domRef.current), r2 = e2 ? o4.indexOf(e2) : null;
  return r2 === -1 && (r2 = null), { options: o4, activeOptionIndex: r2 };
}
let j = { [1](t2) {
  var e2;
  if ((e2 = t2.dataRef.current) != null && e2.disabled || t2.comboboxState === 1) return t2;
  let i2 = t2.inputElement ? c.Tracked(a2(t2.inputElement)) : t2.inputPositionState;
  return { ...t2, activeOptionIndex: null, comboboxState: 1, isTyping: false, activationTrigger: 2, inputPositionState: i2, __demoMode: false };
}, [0](t2) {
  var i2, e2;
  if ((i2 = t2.dataRef.current) != null && i2.disabled || t2.comboboxState === 0) return t2;
  if ((e2 = t2.dataRef.current) != null && e2.value) {
    let n2 = t2.dataRef.current.calculateIndex(t2.dataRef.current.value);
    if (n2 !== -1) return { ...t2, activeOptionIndex: n2, comboboxState: 0, __demoMode: false, inputPositionState: c.Idle };
  }
  return { ...t2, comboboxState: 0, inputPositionState: c.Idle, __demoMode: false };
}, [3](t2, i2) {
  return t2.isTyping === i2.isTyping ? t2 : { ...t2, isTyping: i2.isTyping };
}, [2](t2, i2) {
  var r2, u2, a3, s2;
  if ((r2 = t2.dataRef.current) != null && r2.disabled || t2.optionsElement && !((u2 = t2.dataRef.current) != null && u2.optionsPropsRef.current.static) && t2.comboboxState === 1) return t2;
  if (t2.virtual) {
    let { options: p2, disabled: c2 } = t2.virtual, m2 = i2.focus === c$3.Specific ? i2.idx : f$1(i2, { resolveItems: () => p2, resolveActiveIndex: () => {
      var l2, x2;
      return (x2 = (l2 = t2.activeOptionIndex) != null ? l2 : p2.findIndex((S2) => !c2(S2))) != null ? x2 : null;
    }, resolveDisabled: c2, resolveId() {
      throw new Error("Function not implemented.");
    } }), b2 = (a3 = i2.trigger) != null ? a3 : 2;
    return t2.activeOptionIndex === m2 && t2.activationTrigger === b2 ? t2 : { ...t2, activeOptionIndex: m2, activationTrigger: b2, isTyping: false, __demoMode: false };
  }
  let e2 = v(t2);
  if (e2.activeOptionIndex === null) {
    let p2 = e2.options.findIndex((c2) => !c2.dataRef.current.disabled);
    p2 !== -1 && (e2.activeOptionIndex = p2);
  }
  let n2 = i2.focus === c$3.Specific ? i2.idx : f$1(i2, { resolveItems: () => e2.options, resolveActiveIndex: () => e2.activeOptionIndex, resolveId: (p2) => p2.id, resolveDisabled: (p2) => p2.dataRef.current.disabled }), o4 = (s2 = i2.trigger) != null ? s2 : 2;
  return t2.activeOptionIndex === n2 && t2.activationTrigger === o4 ? t2 : { ...t2, ...e2, isTyping: false, activeOptionIndex: n2, activationTrigger: o4, __demoMode: false };
}, [4]: (t2, i2) => {
  var r2, u2, a3, s2;
  if ((r2 = t2.dataRef.current) != null && r2.virtual) return { ...t2, options: [...t2.options, i2.payload] };
  let e2 = i2.payload, n2 = v(t2, (p2) => (p2.push(e2), p2));
  t2.activeOptionIndex === null && (a3 = (u2 = t2.dataRef.current).isSelected) != null && a3.call(u2, i2.payload.dataRef.current.value) && (n2.activeOptionIndex = n2.options.indexOf(e2));
  let o4 = { ...t2, ...n2, activationTrigger: 2 };
  return (s2 = t2.dataRef.current) != null && s2.__demoMode && t2.dataRef.current.value === void 0 && (o4.activeOptionIndex = 0), o4;
}, [5]: (t2, i2) => {
  var n2;
  if ((n2 = t2.dataRef.current) != null && n2.virtual) return { ...t2, options: t2.options.filter((o4) => o4.id !== i2.id) };
  let e2 = v(t2, (o4) => {
    let r2 = o4.findIndex((u2) => u2.id === i2.id);
    return r2 !== -1 && o4.splice(r2, 1), o4;
  });
  return { ...t2, ...e2, activationTrigger: 2 };
}, [6]: (t2, i2) => t2.defaultToFirstOption === i2.value ? t2 : { ...t2, defaultToFirstOption: i2.value }, [7]: (t2, i2) => t2.activationTrigger === i2.trigger ? t2 : { ...t2, activationTrigger: i2.trigger }, [8]: (t2, i2) => {
  var n2, o4;
  if (t2.virtual === null) return { ...t2, virtual: { options: i2.options, disabled: (n2 = i2.disabled) != null ? n2 : () => false } };
  if (t2.virtual.options === i2.options && t2.virtual.disabled === i2.disabled) return t2;
  let e2 = t2.activeOptionIndex;
  if (t2.activeOptionIndex !== null) {
    let r2 = i2.options.indexOf(t2.virtual.options[t2.activeOptionIndex]);
    r2 !== -1 ? e2 = r2 : e2 = null;
  }
  return { ...t2, activeOptionIndex: e2, virtual: { options: i2.options, disabled: (o4 = i2.disabled) != null ? o4 : () => false } };
}, [9]: (t2, i2) => t2.inputElement === i2.element ? t2 : { ...t2, inputElement: i2.element }, [10]: (t2, i2) => t2.buttonElement === i2.element ? t2 : { ...t2, buttonElement: i2.element }, [11]: (t2, i2) => t2.optionsElement === i2.element ? t2 : { ...t2, optionsElement: i2.element }, [12](t2) {
  return t2.inputPositionState.kind !== "Tracked" ? t2 : { ...t2, inputPositionState: c.Moved };
} };
class y extends T$2 {
  constructor(e2) {
    super(e2);
    f(this, "actions", { onChange: (e3) => {
      let { onChange: n2, compare: o4, mode: r2, value: u2 } = this.state.dataRef.current;
      return u$c(r2, { [0]: () => n2 == null ? void 0 : n2(e3), [1]: () => {
        let a3 = u2.slice(), s2 = a3.findIndex((p2) => o4(p2, e3));
        return s2 === -1 ? a3.push(e3) : a3.splice(s2, 1), n2 == null ? void 0 : n2(a3);
      } });
    }, registerOption: (e3, n2) => (this.send({ type: 4, payload: { id: e3, dataRef: n2 } }), () => {
      this.state.activeOptionIndex === this.state.dataRef.current.calculateIndex(n2.current.value) && this.send({ type: 6, value: true }), this.send({ type: 5, id: e3 });
    }), goToOption: (e3, n2) => (this.send({ type: 6, value: false }), this.send({ type: 2, ...e3, trigger: n2 })), setIsTyping: (e3) => {
      this.send({ type: 3, isTyping: e3 });
    }, closeCombobox: () => {
      var e3, n2;
      this.send({ type: 1 }), this.send({ type: 6, value: false }), (n2 = (e3 = this.state.dataRef.current).onClose) == null || n2.call(e3);
    }, openCombobox: () => {
      this.send({ type: 0 }), this.send({ type: 6, value: true });
    }, setActivationTrigger: (e3) => {
      this.send({ type: 7, trigger: e3 });
    }, selectActiveOption: () => {
      let e3 = this.selectors.activeOptionIndex(this.state);
      if (e3 !== null) {
        if (this.actions.setIsTyping(false), this.state.virtual) this.actions.onChange(this.state.virtual.options[e3]);
        else {
          let { dataRef: n2 } = this.state.options[e3];
          this.actions.onChange(n2.current.value);
        }
        this.actions.goToOption({ focus: c$3.Specific, idx: e3 });
      }
    }, setInputElement: (e3) => {
      this.send({ type: 9, element: e3 });
    }, setButtonElement: (e3) => {
      this.send({ type: 10, element: e3 });
    }, setOptionsElement: (e3) => {
      this.send({ type: 11, element: e3 });
    } });
    f(this, "selectors", { activeDescendantId: (e3) => {
      var o4, r2;
      let n2 = this.selectors.activeOptionIndex(e3);
      if (n2 !== null) return e3.virtual ? (r2 = e3.options.find((u2) => !u2.dataRef.current.disabled && e3.dataRef.current.compare(u2.dataRef.current.value, e3.virtual.options[n2]))) == null ? void 0 : r2.id : (o4 = e3.options[n2]) == null ? void 0 : o4.id;
    }, activeOptionIndex: (e3) => {
      if (e3.defaultToFirstOption && e3.activeOptionIndex === null && (e3.virtual ? e3.virtual.options.length > 0 : e3.options.length > 0)) {
        if (e3.virtual) {
          let { options: o4, disabled: r2 } = e3.virtual, u2 = o4.findIndex((a3) => {
            var s2;
            return !((s2 = r2 == null ? void 0 : r2(a3)) != null && s2);
          });
          if (u2 !== -1) return u2;
        }
        let n2 = e3.options.findIndex((o4) => !o4.dataRef.current.disabled);
        if (n2 !== -1) return n2;
      }
      return e3.activeOptionIndex;
    }, activeOption: (e3) => {
      var o4, r2;
      let n2 = this.selectors.activeOptionIndex(e3);
      return n2 === null ? null : e3.virtual ? e3.virtual.options[n2 != null ? n2 : 0] : (r2 = (o4 = e3.options[n2]) == null ? void 0 : o4.dataRef.current.value) != null ? r2 : null;
    }, isActive: (e3, n2, o4) => {
      var u2;
      let r2 = this.selectors.activeOptionIndex(e3);
      return r2 === null ? false : e3.virtual ? r2 === e3.dataRef.current.calculateIndex(n2) : ((u2 = e3.options[r2]) == null ? void 0 : u2.id) === o4;
    }, shouldScrollIntoView: (e3, n2, o4) => !(e3.virtual || e3.__demoMode || e3.comboboxState !== 0 || e3.activationTrigger === 0 || !this.selectors.isActive(e3, n2, o4)), didInputMove(e3) {
      return e3.inputPositionState.kind === "Moved";
    } });
    {
      let n2 = this.state.id, o4 = x$1.get(null);
      this.disposables.add(o4.on(k$3.Push, (r2) => {
        !o4.selectors.isTop(r2, n2) && this.state.comboboxState === 0 && this.actions.closeCombobox();
      })), this.on(0, () => o4.actions.push(n2)), this.on(1, () => o4.actions.pop(n2));
    }
    this.disposables.group((n2) => {
      this.on(1, (o4) => {
        o4.inputElement && (n2.dispose(), n2.add(p$1(o4.inputElement, o4.inputPositionState, () => {
          this.send({ type: 12 });
        })));
      });
    });
  }
  static new({ id: e2, virtual: n2 = null, __demoMode: o4 = false }) {
    var r2;
    return new y({ id: e2, dataRef: { current: {} }, comboboxState: o4 ? 0 : 1, isTyping: false, options: [], virtual: n2 ? { options: n2.options, disabled: (r2 = n2.disabled) != null ? r2 : () => false } : null, activeOptionIndex: null, activationTrigger: 2, inputElement: null, buttonElement: null, optionsElement: null, __demoMode: o4, inputPositionState: c.Idle });
  }
  reduce(e2, n2) {
    return u$c(n2.type, j, e2, n2);
  }
}
const u = reactExports.createContext(null);
function p(n2) {
  let o4 = reactExports.useContext(u);
  if (o4 === null) {
    let e2 = new Error(`<${n2} /> is missing a parent <Combobox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(e2, b), e2;
  }
  return o4;
}
function b({ id: n2, virtual: o4 = null, __demoMode: e2 = false }) {
  let t2 = reactExports.useMemo(() => y.new({ id: n2, virtual: o4, __demoMode: e2 }), []);
  return c$2(() => t2.dispose()), t2;
}
let de = reactExports.createContext(null);
de.displayName = "ComboboxDataContext";
function te(T3) {
  let O2 = reactExports.useContext(de);
  if (O2 === null) {
    let e2 = new Error(`<${T3} /> is missing a parent <Combobox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(e2, te), e2;
  }
  return O2;
}
let Le = reactExports.createContext(null);
function Eo(T3) {
  let O2 = p("VirtualProvider"), e2 = te("VirtualProvider"), { options: o4 } = e2.virtual, E2 = S$2(O2, (a3) => a3.optionsElement), [R, y2] = reactExports.useMemo(() => {
    let a3 = E2;
    if (!a3) return [0, 0];
    let u2 = window.getComputedStyle(a3);
    return [parseFloat(u2.paddingBlockStart || u2.paddingTop), parseFloat(u2.paddingBlockEnd || u2.paddingBottom)];
  }, [E2]), b2 = useVirtualizer({ enabled: o4.length !== 0, scrollPaddingStart: R, scrollPaddingEnd: y2, count: o4.length, estimateSize() {
    return 40;
  }, getScrollElement() {
    return O2.state.optionsElement;
  }, overscan: 12 }), [h2, p$12] = reactExports.useState(0);
  n$6(() => {
    p$12((a3) => a3 + 1);
  }, [o4]);
  let f2 = b2.getVirtualItems(), n2 = S$2(O2, (a3) => a3.activationTrigger === _.Pointer), m2 = S$2(O2, O2.selectors.activeOptionIndex);
  return f2.length === 0 ? null : React.createElement(Le.Provider, { value: b2 }, React.createElement("div", { style: { position: "relative", width: "100%", height: `${b2.getTotalSize()}px` }, ref: (a3) => {
    a3 && (n2 || m2 !== null && o4.length > m2 && b2.scrollToIndex(m2));
  } }, f2.map((a3) => {
    var u2;
    return React.createElement(reactExports.Fragment, { key: a3.key }, React.cloneElement((u2 = T3.children) == null ? void 0 : u2.call(T3, { ...T3.slot, option: o4[a3.index] }), { key: `${h2}-${a3.key}`, "data-index": a3.index, "aria-setsize": o4.length, "aria-posinset": a3.index + 1, style: { position: "absolute", top: 0, left: 0, transform: `translateY(${a3.start}px)`, overflowAnchor: "none" } }));
  })));
}
let ho = reactExports.Fragment;
function Ao(T3, O2) {
  let e2 = reactExports.useId(), o4 = a$a(), { value: E2, defaultValue: R, onChange: y2, form: b$12, name: h2, by: p2, invalid: f2 = false, disabled: n2 = o4 || false, onClose: m2, __demoMode: a3 = false, multiple: u$12 = false, immediate: A2 = false, virtual: d2 = null, nullable: X2, ...G2 } = T3, C2 = l$4(R), [x2 = u$12 ? [] : void 0, v2] = b$2(E2, y2, C2), c2 = b({ id: e2, virtual: d2, __demoMode: a3 }), z = reactExports.useRef({ static: false, hold: false }), D$12 = u$8(p2), K$1 = o$5((i2) => d2 ? p2 === null ? d2.options.indexOf(i2) : d2.options.findIndex((M2) => D$12(M2, i2)) : c2.state.options.findIndex((M2) => D$12(M2.dataRef.current.value, i2))), W = reactExports.useCallback((i2) => u$c(l2.mode, { [k.Multi]: () => x2.some((M2) => D$12(M2, i2)), [k.Single]: () => D$12(x2, i2) }), [x2]), S2 = S$2(c2, (i2) => i2.virtual), j2 = o$5(() => m2 == null ? void 0 : m2()), l2 = reactExports.useMemo(() => ({ __demoMode: a3, immediate: A2, optionsPropsRef: z, value: x2, defaultValue: C2, disabled: n2, invalid: f2, mode: u$12 ? k.Multi : k.Single, virtual: d2 ? S2 : null, onChange: v2, isSelected: W, calculateIndex: K$1, compare: D$12, onClose: j2 }), [a3, A2, z, x2, C2, n2, f2, u$12, d2, S2, v2, W, K$1, D$12, j2]);
  n$6(() => {
    var i2;
    d2 && c2.send({ type: D.UpdateVirtualConfiguration, options: d2.options, disabled: (i2 = d2.disabled) != null ? i2 : null });
  }, [d2, d2 == null ? void 0 : d2.options, d2 == null ? void 0 : d2.disabled]), n$6(() => {
    c2.state.dataRef.current = l2;
  }, [l2]);
  let [k$12, Y2, s2, U2] = S$2(c2, (i2) => [i2.comboboxState, i2.buttonElement, i2.inputElement, i2.optionsElement]), $2 = x$1.get(null), ne = S$2($2, reactExports.useCallback((i2) => $2.selectors.isTop(i2, e2), [$2, e2]));
  k$2(ne, [Y2, s2, U2], () => c2.actions.closeCombobox());
  let be = S$2(c2, c2.selectors.activeOptionIndex), ee = S$2(c2, c2.selectors.activeOption), q2 = n$5({ open: k$12 === P.Open, disabled: n2, invalid: f2, activeIndex: be, activeOption: ee, value: x2 }), [t2, V$12] = V(), P$12 = O2 === null ? {} : { ref: O2 }, N2 = reactExports.useCallback(() => {
    if (C2 !== void 0) return v2 == null ? void 0 : v2(C2);
  }, [v2, C2]), g2 = K();
  return React.createElement(V$12, { value: t2, props: { htmlFor: s2 == null ? void 0 : s2.id }, slot: { open: k$12 === P.Open, disabled: n2 } }, React.createElement(Ae, null, React.createElement(de.Provider, { value: l2 }, React.createElement(u.Provider, { value: c2 }, React.createElement(c$4, { value: u$c(k$12, { [P.Open]: i.Open, [P.Closed]: i.Closed }) }, h2 != null && React.createElement(j$5, { disabled: n2, data: x2 != null ? { [h2]: x2 } : {}, form: b$12, onReset: N2 }), g2({ ourProps: P$12, theirProps: G2, slot: q2, defaultTag: ho, name: "Combobox" }))))));
}
let Io = "input";
function Ro(T3, O2) {
  var ee, q2;
  let e2 = p("Combobox.Input"), o4 = te("Combobox.Input"), E2 = reactExports.useId(), R = u$b(), { id: y2 = R || `headlessui-combobox-input-${E2}`, onChange: b2, displayValue: h2, disabled: p$12 = o4.disabled || false, autoFocus: f2 = false, type: n$12 = "text", ...m2 } = T3, a3 = reactExports.useRef(null), u2 = y$4(a3, O2, Fe(), e2.actions.setInputElement), [A2, d2] = S$2(e2, (t2) => [t2.comboboxState, t2.isTyping]), X2 = p$6(), G2 = o$5(() => {
    e2.actions.onChange(null), e2.state.optionsElement && (e2.state.optionsElement.scrollTop = 0), e2.actions.goToOption({ focus: c$3.Nothing });
  }), C2 = reactExports.useMemo(() => {
    var t2;
    return typeof h2 == "function" && o4.value !== void 0 ? (t2 = h2(o4.value)) != null ? t2 : "" : typeof o4.value == "string" ? o4.value : "";
  }, [o4.value, h2]);
  m$1(([t2, V2], [P$12, N2]) => {
    if (e2.state.isTyping) return;
    let g2 = a3.current;
    g2 && ((N2 === P.Open && V2 === P.Closed || t2 !== P$12) && (g2.value = t2), requestAnimationFrame(() => {
      if (e2.state.isTyping || !g2 || d$1(g2)) return;
      let { selectionStart: i2, selectionEnd: M2 } = g2;
      Math.abs((M2 != null ? M2 : 0) - (i2 != null ? i2 : 0)) === 0 && i2 === 0 && g2.setSelectionRange(g2.value.length, g2.value.length);
    }));
  }, [C2, A2, d2]), m$1(([t2], [V2]) => {
    if (t2 === P.Open && V2 === P.Closed) {
      if (e2.state.isTyping) return;
      let P2 = a3.current;
      if (!P2) return;
      let N2 = P2.value, { selectionStart: g2, selectionEnd: i2, selectionDirection: M2 } = P2;
      P2.value = "", P2.value = N2, M2 !== null ? P2.setSelectionRange(g2, i2, M2) : P2.setSelectionRange(g2, i2);
    }
  }, [A2]);
  let x2 = reactExports.useRef(false), v2 = o$5(() => {
    x2.current = true;
  }), c2 = o$5(() => {
    X2.nextFrame(() => {
      x2.current = false;
    });
  }), z = o$5((t2) => {
    switch (e2.actions.setIsTyping(true), t2.key) {
      case o$3.Enter:
        if (e2.state.comboboxState !== P.Open || x2.current) return;
        if (t2.preventDefault(), t2.stopPropagation(), e2.selectors.activeOptionIndex(e2.state) === null) {
          e2.actions.closeCombobox();
          return;
        }
        e2.actions.selectActiveOption(), o4.mode === k.Single && e2.actions.closeCombobox();
        break;
      case o$3.ArrowDown:
        return t2.preventDefault(), t2.stopPropagation(), u$c(e2.state.comboboxState, { [P.Open]: () => e2.actions.goToOption({ focus: c$3.Next }), [P.Closed]: () => e2.actions.openCombobox() });
      case o$3.ArrowUp:
        return t2.preventDefault(), t2.stopPropagation(), u$c(e2.state.comboboxState, { [P.Open]: () => e2.actions.goToOption({ focus: c$3.Previous }), [P.Closed]: () => {
          reactDomExports.flushSync(() => e2.actions.openCombobox()), o4.value || e2.actions.goToOption({ focus: c$3.Last });
        } });
      case o$3.Home:
        if (e2.state.comboboxState === P.Closed || t2.shiftKey) break;
        return t2.preventDefault(), t2.stopPropagation(), e2.actions.goToOption({ focus: c$3.First });
      case o$3.PageUp:
        return t2.preventDefault(), t2.stopPropagation(), e2.actions.goToOption({ focus: c$3.First });
      case o$3.End:
        if (e2.state.comboboxState === P.Closed || t2.shiftKey) break;
        return t2.preventDefault(), t2.stopPropagation(), e2.actions.goToOption({ focus: c$3.Last });
      case o$3.PageDown:
        return t2.preventDefault(), t2.stopPropagation(), e2.actions.goToOption({ focus: c$3.Last });
      case o$3.Escape:
        return e2.state.comboboxState !== P.Open ? void 0 : (t2.preventDefault(), e2.state.optionsElement && !o4.optionsPropsRef.current.static && t2.stopPropagation(), o4.mode === k.Single && o4.value === null && G2(), e2.actions.closeCombobox());
      case o$3.Tab:
        if (e2.actions.setIsTyping(false), e2.state.comboboxState !== P.Open) return;
        o4.mode === k.Single && e2.state.activationTrigger !== _.Focus && e2.actions.selectActiveOption(), e2.actions.closeCombobox();
        break;
    }
  }), D2 = o$5((t2) => {
    b2 == null || b2(t2), o4.mode === k.Single && t2.target.value === "" && G2(), e2.actions.openCombobox();
  }), K$1 = o$5((t2) => {
    var P$12, N2, g2;
    let V2 = (P$12 = t2.relatedTarget) != null ? P$12 : n.find((i2) => i2 !== t2.currentTarget);
    if (!((N2 = e2.state.optionsElement) != null && N2.contains(V2)) && !((g2 = e2.state.buttonElement) != null && g2.contains(V2)) && e2.state.comboboxState === P.Open) return t2.preventDefault(), o4.mode === k.Single && o4.value === null && G2(), e2.actions.closeCombobox();
  }), W = o$5((t2) => {
    var P$12, N2, g2;
    let V2 = (P$12 = t2.relatedTarget) != null ? P$12 : n.find((i2) => i2 !== t2.currentTarget);
    (N2 = e2.state.buttonElement) != null && N2.contains(V2) || (g2 = e2.state.optionsElement) != null && g2.contains(V2) || o4.disabled || o4.immediate && e2.state.comboboxState !== P.Open && X2.microTask(() => {
      reactDomExports.flushSync(() => e2.actions.openCombobox()), e2.actions.setActivationTrigger(_.Focus);
    });
  }), S2 = N$1(), j2 = w$2(), { isFocused: l2, focusProps: k$12 } = $0c4a58759813079a$export$4e328f61c538687f({ autoFocus: f2 }), { isHovered: Y2, hoverProps: s2 } = $e969f22b6713ca4a$export$ae780daf29e6d456({ isDisabled: p$12 }), U2 = S$2(e2, (t2) => t2.optionsElement), $2 = n$5({ open: A2 === P.Open, disabled: p$12, invalid: o4.invalid, hover: Y2, focus: l2, autofocus: f2 }), ne = V$1({ ref: u2, id: y2, role: "combobox", type: n$12, "aria-controls": U2 == null ? void 0 : U2.id, "aria-expanded": A2 === P.Open, "aria-activedescendant": S$2(e2, e2.selectors.activeDescendantId), "aria-labelledby": S2, "aria-describedby": j2, "aria-autocomplete": "list", defaultValue: (q2 = (ee = T3.defaultValue) != null ? ee : o4.defaultValue !== void 0 ? h2 == null ? void 0 : h2(o4.defaultValue) : null) != null ? q2 : o4.defaultValue, disabled: p$12 || void 0, autoFocus: f2, onCompositionStart: v2, onCompositionEnd: c2, onKeyDown: z, onChange: D2, onFocus: W, onBlur: K$1 }, k$12, s2);
  return K()({ ourProps: ne, theirProps: m2, slot: $2, defaultTag: Io, name: "Combobox.Input" });
}
let _o = "button";
function Fo(T3, O2) {
  let e2 = p("Combobox.Button"), o4 = te("Combobox.Button"), [E2, R] = reactExports.useState(null), y2 = y$4(O2, R, e2.actions.setButtonElement), b2 = reactExports.useId(), { id: h2 = `headlessui-combobox-button-${b2}`, disabled: p$12 = o4.disabled || false, autoFocus: f2 = false, ...n2 } = T3, [m2, a3, u2] = S$2(e2, (l2) => [l2.comboboxState, l2.inputElement, l2.optionsElement]), A2 = v$1(a3), d2 = m2 === P.Open;
  L(d2, { trigger: E2, action: reactExports.useCallback((l2) => {
    if (E2 != null && E2.contains(l2.target)) return S$1.Ignore;
    if (a3 != null && a3.contains(l2.target)) return S$1.Ignore;
    let k2 = l2.target.closest('[role="option"]:not([data-disabled])');
    return n$4(k2) ? S$1.Select(k2) : u2 != null && u2.contains(l2.target) ? S$1.Ignore : S$1.Close;
  }, [E2, a3, u2]), close: e2.actions.closeCombobox, select: e2.actions.selectActiveOption });
  let X2 = o$5((l2) => {
    switch (l2.key) {
      case o$3.Space:
      case o$3.Enter:
        l2.preventDefault(), l2.stopPropagation(), e2.state.comboboxState === P.Closed && reactDomExports.flushSync(() => e2.actions.openCombobox()), A2();
        return;
      case o$3.ArrowDown:
        l2.preventDefault(), l2.stopPropagation(), e2.state.comboboxState === P.Closed && (reactDomExports.flushSync(() => e2.actions.openCombobox()), e2.state.dataRef.current.value || e2.actions.goToOption({ focus: c$3.First })), A2();
        return;
      case o$3.ArrowUp:
        l2.preventDefault(), l2.stopPropagation(), e2.state.comboboxState === P.Closed && (reactDomExports.flushSync(() => e2.actions.openCombobox()), e2.state.dataRef.current.value || e2.actions.goToOption({ focus: c$3.Last })), A2();
        return;
      case o$3.Escape:
        if (e2.state.comboboxState !== P.Open) return;
        l2.preventDefault(), e2.state.optionsElement && !o4.optionsPropsRef.current.static && l2.stopPropagation(), reactDomExports.flushSync(() => e2.actions.closeCombobox()), A2();
        return;
      default:
        return;
    }
  }), G2 = s$4(() => {
    e2.state.comboboxState === P.Open ? e2.actions.closeCombobox() : e2.actions.openCombobox(), A2();
  }), C2 = N$1([h2]), { isFocusVisible: x2, focusProps: v2 } = $0c4a58759813079a$export$4e328f61c538687f({ autoFocus: f2 }), { isHovered: c2, hoverProps: z } = $e969f22b6713ca4a$export$ae780daf29e6d456({ isDisabled: p$12 }), { pressed: D2, pressProps: K$1 } = w$3({ disabled: p$12 }), W = n$5({ open: m2 === P.Open, active: D2 || m2 === P.Open, disabled: p$12, invalid: o4.invalid, value: o4.value, hover: c2, focus: x2 }), S2 = V$1({ ref: y2, id: h2, type: e$1(T3, E2), tabIndex: -1, "aria-haspopup": "listbox", "aria-controls": u2 == null ? void 0 : u2.id, "aria-expanded": m2 === P.Open, "aria-labelledby": C2, disabled: p$12 || void 0, autoFocus: f2, onKeyDown: X2 }, G2, v2, z, K$1);
  return K()({ ourProps: S2, theirProps: n2, slot: W, defaultTag: _o, name: "Combobox.Button" });
}
let Do = "div", So = A$2.RenderStrategy | A$2.Static;
function Mo(T3, O2) {
  var M2, Ce, ve;
  let e2 = reactExports.useId(), { id: o4 = `headlessui-combobox-options-${e2}`, hold: E2 = false, anchor: R, portal: y2 = false, modal: b2 = true, transition: h2 = false, ...p$12 } = T3, f2 = p("Combobox.Options"), n2 = te("Combobox.Options"), m2 = ye(R);
  m2 && (y2 = true);
  let [a3, u2] = Re(m2), [A2, d2] = reactExports.useState(null), X2 = Te(), G2 = y$4(O2, m2 ? a3 : null, f2.actions.setOptionsElement, d2), [C2, x$12, v2, c2, z] = S$2(f2, (_2) => [_2.comboboxState, _2.inputElement, _2.buttonElement, _2.optionsElement, _2.activationTrigger]), D2 = u$5(x$12 || v2), K$1 = u$5(c2), W = u$2(), [S2, j2] = N(h2, A2, W !== null ? (W & i.Open) === i.Open : C2 === P.Open);
  p$2(S2, x$12, f2.actions.closeCombobox);
  let l2 = n2.__demoMode ? false : b2 && C2 === P.Open;
  f$3(l2, K$1);
  let k$12 = n2.__demoMode ? false : b2 && C2 === P.Open;
  y$2(k$12, { allowed: reactExports.useCallback(() => [x$12, v2, c2], [x$12, v2, c2]) });
  let s2 = S$2(f2, f2.selectors.didInputMove) ? false : S2;
  n$6(() => {
    var _2;
    n2.optionsPropsRef.current.static = (_2 = T3.static) != null ? _2 : false;
  }, [n2.optionsPropsRef, T3.static]), n$6(() => {
    n2.optionsPropsRef.current.hold = E2;
  }, [n2.optionsPropsRef, E2]), F(C2 === P.Open, { container: c2, accept(_2) {
    return _2.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : _2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(_2) {
    _2.setAttribute("role", "none");
  } });
  let U2 = N$1([v2 == null ? void 0 : v2.id]), $2 = n$5({ open: C2 === P.Open, option: void 0 }), ne = o$5(() => {
    f2.actions.setActivationTrigger(_.Pointer);
  }), be = o$5((_$12) => {
    _$12.preventDefault(), f2.actions.setActivationTrigger(_.Pointer);
  }), ee = V$1(m2 ? X2() : {}, { "aria-labelledby": U2, role: "listbox", "aria-multiselectable": n2.mode === k.Multi ? true : void 0, id: o4, ref: G2, style: { ...p$12.style, ...u2, "--input-width": w$1(S2, x$12, true).width, "--button-width": w$1(S2, v2, true).width }, onWheel: z === _.Pointer ? void 0 : ne, onMouseDown: be, ...x(j2) }), q2 = S2 && C2 === P.Closed && !T3.static, t2 = u$3(q2, (M2 = n2.virtual) == null ? void 0 : M2.options), V2 = u$3(q2, n2.value), P$12 = reactExports.useCallback((_2) => n2.compare(V2, _2), [n2.compare, V2]), N$2 = reactExports.useMemo(() => {
    if (!n2.virtual) return n2;
    if (t2 === void 0) throw new Error("Missing `options` in virtual mode");
    return t2 !== n2.virtual.options ? { ...n2, virtual: { ...n2.virtual, options: t2 } } : n2;
  }, [n2, t2, (Ce = n2.virtual) == null ? void 0 : Ce.options]);
  n2.virtual && Object.assign(p$12, { children: React.createElement(de.Provider, { value: N$2 }, React.createElement(Eo, { slot: $2 }, p$12.children)) });
  let g2 = K(), i$12 = reactExports.useMemo(() => n2.mode === k.Multi ? n2 : { ...n2, isSelected: P$12 }, [n2, P$12]);
  return React.createElement(le, { enabled: y2 ? T3.static || S2 : false, ownerDocument: D2 }, React.createElement(de.Provider, { value: i$12 }, g2({ ourProps: ee, theirProps: { ...p$12, children: React.createElement(s$1, { freeze: q2 }, typeof p$12.children == "function" ? (ve = p$12.children) == null ? void 0 : ve.call(p$12, $2) : p$12.children) }, slot: $2, defaultTag: Do, features: So, visible: s2, name: "Combobox.Options" })));
}
let Lo = "div";
function Vo(T3, O2) {
  var l2, k$12, Y2;
  let e2 = te("Combobox.Option"), o4 = p("Combobox.Option"), E2 = reactExports.useId(), { id: R = `headlessui-combobox-option-${E2}`, value: y2, disabled: b2 = (Y2 = (k$12 = (l2 = e2.virtual) == null ? void 0 : l2.disabled) == null ? void 0 : k$12.call(l2, y2)) != null ? Y2 : false, order: h2 = null, ...p$12 } = T3, [f2] = S$2(o4, (s2) => [s2.inputElement]), n2 = v$1(f2), m2 = S$2(o4, reactExports.useCallback((s2) => o4.selectors.isActive(s2, y2, R), [y2, R])), a3 = e2.isSelected(y2), u2 = reactExports.useRef(null), A2 = s$8({ disabled: b2, value: y2, domRef: u2, order: h2 }), d2 = reactExports.useContext(Le), X2 = y$4(O2, u2, d2 ? d2.measureElement : null), G2 = o$5(() => {
    o4.actions.setIsTyping(false), o4.actions.onChange(y2);
  });
  n$6(() => o4.actions.registerOption(R, A2), [A2, R]);
  let C2 = S$2(o4, reactExports.useCallback((s2) => o4.selectors.shouldScrollIntoView(s2, y2, R), [y2, R]));
  n$6(() => {
    if (C2) return o$6().requestAnimationFrame(() => {
      var s2, U2;
      (U2 = (s2 = u2.current) == null ? void 0 : s2.scrollIntoView) == null || U2.call(s2, { block: "nearest" });
    });
  }, [C2, u2]);
  let x2 = o$5((s2) => {
    s2.preventDefault(), s2.button === g$1.Left && (b2 || (G2(), n$2() || requestAnimationFrame(() => n2()), e2.mode === k.Single && o4.actions.closeCombobox()));
  }), v2 = o$5(() => {
    if (b2) return o4.actions.goToOption({ focus: c$3.Nothing });
    let s2 = e2.calculateIndex(y2);
    o4.actions.goToOption({ focus: c$3.Specific, idx: s2 });
  }), c2 = u$4(), z = o$5((s2) => c2.update(s2)), D2 = o$5((s2) => {
    if (!c2.wasMoved(s2) || b2 || m2 && o4.state.activationTrigger === _.Pointer) return;
    let U2 = e2.calculateIndex(y2);
    o4.actions.goToOption({ focus: c$3.Specific, idx: U2 }, _.Pointer);
  }), K$1 = o$5((s2) => {
    c2.wasMoved(s2) && (b2 || m2 && (e2.optionsPropsRef.current.hold || o4.state.activationTrigger === _.Pointer && o4.actions.goToOption({ focus: c$3.Nothing })));
  }), W = n$5({ active: m2, focus: m2, selected: a3, disabled: b2 }), S2 = { id: R, ref: X2, role: "option", tabIndex: b2 === true ? void 0 : -1, "aria-disabled": b2 === true ? true : void 0, "aria-selected": a3, disabled: void 0, onMouseDown: x2, onFocus: v2, onPointerEnter: z, onMouseEnter: z, onPointerMove: D2, onMouseMove: D2, onPointerLeave: K$1, onMouseLeave: K$1 };
  return K()({ ourProps: S2, theirProps: p$12, slot: W, defaultTag: Lo, name: "Combobox.Option" });
}
let wo = Y(Ao), Bo = Y(Fo), ko = Y(Ro), No = Z, Uo = Y(Mo), Ho = Y(Vo), Ht = Object.assign(wo, { Input: ko, Button: Bo, Label: No, Options: Uo, Option: Ho });
export {
  Bo as B,
  Ht as H,
  Uo as U,
  Ho as a,
  ko as k
};
