import { R as React, r as reactExports } from "./react.mjs";
import "./react-dom.mjs";
import { $ as $6a20a7989e6c817a$export$98658e8c59125e6a } from "./react-stately.mjs";
const $d447af545b77c9f1$export$b204af158042fbac = (target) => {
  if ($d447af545b77c9f1$var$isWindow(target)) return target.document;
  if ($d447af545b77c9f1$export$62858bae88b53fd0(target)) return target;
  return target?.ownerDocument ?? (typeof document !== "undefined" ? document : void 0);
};
const $d447af545b77c9f1$export$f21a1ffae260145a = (target) => {
  let ownerDocument = $d447af545b77c9f1$export$b204af158042fbac(target);
  return ownerDocument?.defaultView ?? (typeof window !== "undefined" ? window : void 0);
};
function $d447af545b77c9f1$export$8ee0fc9ee280b4ee(value) {
  return value !== null && typeof value === "object" && "nodeType" in value && typeof value.nodeType === "number";
}
function $d447af545b77c9f1$var$isWindow(value) {
  return typeof value === "object" && value != null && "window" in value && value.window === value;
}
function $d447af545b77c9f1$export$62858bae88b53fd0(value) {
  return $d447af545b77c9f1$export$8ee0fc9ee280b4ee(value) && value.nodeType === 9;
}
function $d447af545b77c9f1$export$af51f0f06c0f328a(value) {
  return $d447af545b77c9f1$export$8ee0fc9ee280b4ee(value) && value.nodeType === 11 && "host" in value;
}
function $23f2114a1b82827e$export$4282f70798064fe0(node, otherNode) {
  if (!$6a20a7989e6c817a$export$98658e8c59125e6a()) return otherNode && node ? node.contains(otherNode) : false;
  if (!node || !otherNode) return false;
  let currentNode = otherNode;
  while (currentNode !== null) {
    if (currentNode === node) return true;
    if (typeof currentNode.assignedElements !== "function" && currentNode.assignedSlot?.parentNode)
      currentNode = currentNode.assignedSlot.parentNode;
    else if ($d447af545b77c9f1$export$af51f0f06c0f328a(currentNode))
      currentNode = currentNode.host;
    else currentNode = currentNode.parentNode;
  }
  return false;
}
const $23f2114a1b82827e$export$cd4e5573fbe2b576 = (doc = document) => {
  if (!$6a20a7989e6c817a$export$98658e8c59125e6a()) return doc.activeElement;
  let activeElement = doc.activeElement;
  while (activeElement && "shadowRoot" in activeElement && activeElement.shadowRoot?.activeElement) activeElement = activeElement.shadowRoot.activeElement;
  return activeElement;
};
function $23f2114a1b82827e$export$e58f029f0fbfdb29(event) {
  if ($6a20a7989e6c817a$export$98658e8c59125e6a() && event.target instanceof Element && event.target.shadowRoot) {
    if ("composedPath" in event) return event.composedPath()[0] ?? null;
    else if ("composedPath" in event.nativeEvent) return event.nativeEvent.composedPath()[0] ?? null;
  }
  return event.target;
}
function $1969ac565cfec8d0$export$de79e2c695e052f3(element) {
  if ($1969ac565cfec8d0$var$supportsPreventScroll()) element.focus({
    preventScroll: true
  });
  else {
    let scrollableElements = $1969ac565cfec8d0$var$getScrollableElements(element);
    element.focus();
    $1969ac565cfec8d0$var$restoreScrollPosition(scrollableElements);
  }
}
let $1969ac565cfec8d0$var$supportsPreventScrollCached = null;
function $1969ac565cfec8d0$var$supportsPreventScroll() {
  if ($1969ac565cfec8d0$var$supportsPreventScrollCached == null) {
    $1969ac565cfec8d0$var$supportsPreventScrollCached = false;
    try {
      let focusElem = document.createElement("div");
      focusElem.focus({
        get preventScroll() {
          $1969ac565cfec8d0$var$supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch {
    }
  }
  return $1969ac565cfec8d0$var$supportsPreventScrollCached;
}
function $1969ac565cfec8d0$var$getScrollableElements(element) {
  let parent = element.parentNode;
  let scrollableElements = [];
  let rootScrollingElement = document.scrollingElement || document.documentElement;
  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
      element: parent,
      scrollTop: parent.scrollTop,
      scrollLeft: parent.scrollLeft
    });
    parent = parent.parentNode;
  }
  if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
    element: rootScrollingElement,
    scrollTop: rootScrollingElement.scrollTop,
    scrollLeft: rootScrollingElement.scrollLeft
  });
  return scrollableElements;
}
function $1969ac565cfec8d0$var$restoreScrollPosition(scrollableElements) {
  for (let { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}
const $c4867b2f328c2698$export$e5c5a5f917a5871c = typeof document !== "undefined" ? React.useLayoutEffect : () => {
};
function $a92dc41f639950be$export$525bc4921d56d4a(nativeEvent) {
  let event = nativeEvent;
  event.nativeEvent = nativeEvent;
  event.isDefaultPrevented = () => event.defaultPrevented;
  event.isPropagationStopped = () => event.cancelBubble;
  event.persist = () => {
  };
  return event;
}
function $a92dc41f639950be$export$c2b7abe5d61ec696(event, target) {
  Object.defineProperty(event, "target", {
    value: target
  });
  Object.defineProperty(event, "currentTarget", {
    value: target
  });
}
function $a92dc41f639950be$export$715c682d09d639cc(onBlur) {
  let stateRef = reactExports.useRef({
    isFocused: false,
    observer: null
  });
  $c4867b2f328c2698$export$e5c5a5f917a5871c(() => {
    const state = stateRef.current;
    return () => {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    };
  }, []);
  return reactExports.useCallback((e) => {
    let eventTarget = $23f2114a1b82827e$export$e58f029f0fbfdb29(e);
    if (eventTarget instanceof HTMLButtonElement || eventTarget instanceof HTMLInputElement || eventTarget instanceof HTMLTextAreaElement || eventTarget instanceof HTMLSelectElement) {
      stateRef.current.isFocused = true;
      let target = eventTarget;
      let onBlurHandler = (e2) => {
        stateRef.current.isFocused = false;
        if (target.disabled) {
          let event = $a92dc41f639950be$export$525bc4921d56d4a(e2);
          onBlur?.(event);
        }
        if (stateRef.current.observer) {
          stateRef.current.observer.disconnect();
          stateRef.current.observer = null;
        }
      };
      target.addEventListener("focusout", onBlurHandler, {
        once: true
      });
      stateRef.current.observer = new MutationObserver(() => {
        if (stateRef.current.isFocused && target.disabled) {
          stateRef.current.observer?.disconnect();
          let relatedTargetEl = target === $23f2114a1b82827e$export$cd4e5573fbe2b576() ? null : $23f2114a1b82827e$export$cd4e5573fbe2b576();
          target.dispatchEvent(new FocusEvent("blur", {
            relatedTarget: relatedTargetEl
          }));
          target.dispatchEvent(new FocusEvent("focusout", {
            bubbles: true,
            relatedTarget: relatedTargetEl
          }));
        }
      });
      stateRef.current.observer.observe(target, {
        attributes: true,
        attributeFilter: [
          "disabled"
        ]
      });
    }
  }, [
    onBlur
  ]);
}
let $a92dc41f639950be$export$fda7da73ab5d4c48 = false;
function $2add3ce32c6007eb$var$testUserAgent(re) {
  if (typeof window === "undefined" || window.navigator == null) return false;
  let brands = window.navigator["userAgentData"]?.brands;
  return Array.isArray(brands) && brands.some((brand) => re.test(brand.brand)) || re.test(window.navigator.userAgent);
}
function $2add3ce32c6007eb$var$testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator["userAgentData"]?.platform || window.navigator.platform) : false;
}
function $2add3ce32c6007eb$var$cached(fn) {
  let res = null;
  return () => {
    if (res == null) res = fn();
    return res;
  };
}
const $2add3ce32c6007eb$export$9ac100e40613ea10 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testPlatform(/^Mac/i);
});
const $2add3ce32c6007eb$export$186c6964ca17d99 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testPlatform(/^iPhone/i);
});
const $2add3ce32c6007eb$export$7bef049ce92e4224 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testPlatform(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  $2add3ce32c6007eb$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
});
const $2add3ce32c6007eb$export$fedb369cb70207f1 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$export$186c6964ca17d99() || $2add3ce32c6007eb$export$7bef049ce92e4224();
});
const $2add3ce32c6007eb$export$78551043582a6a98 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testUserAgent(/AppleWebKit/i) && ($2add3ce32c6007eb$export$fedb369cb70207f1() || !$2add3ce32c6007eb$export$6446a186d09e379e());
});
const $2add3ce32c6007eb$export$6446a186d09e379e = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testUserAgent(/Chrome|CriOS|CrMo/i);
});
const $2add3ce32c6007eb$export$a11b0059900ceec8 = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testUserAgent(/Android/i);
});
const $2add3ce32c6007eb$export$b7d78993b74f766d = $2add3ce32c6007eb$var$cached(function() {
  return $2add3ce32c6007eb$var$testUserAgent(/(Firefox|FxiOS)/i);
});
function $b5c62b033c25b96d$export$60278871457622de(event) {
  if (event.pointerType === "" && event.isTrusted) return true;
  if ($2add3ce32c6007eb$export$a11b0059900ceec8() && event.pointerType) return event.type === "click" && event.buttons === 1;
  return event.detail === 0 && !event.pointerType;
}
function $caaf0dd3060ed57c$export$95185d699e05d4d7(target, modifiers, setOpening = true) {
  let { metaKey, ctrlKey, altKey, shiftKey } = modifiers;
  if (!$2add3ce32c6007eb$export$78551043582a6a98() && $2add3ce32c6007eb$export$b7d78993b74f766d() && window.event?.type?.startsWith("key") && target.target === "_blank") {
    if ($2add3ce32c6007eb$export$9ac100e40613ea10()) metaKey = true;
    else ctrlKey = true;
  }
  let event = $2add3ce32c6007eb$export$78551043582a6a98() && $2add3ce32c6007eb$export$9ac100e40613ea10() && !$2add3ce32c6007eb$export$7bef049ce92e4224() && true ? new KeyboardEvent("keydown", {
    keyIdentifier: "Enter",
    metaKey,
    ctrlKey,
    altKey,
    shiftKey
  }) : new MouseEvent("click", {
    metaKey,
    ctrlKey,
    altKey,
    shiftKey,
    detail: 1,
    bubbles: true,
    cancelable: true
  });
  $caaf0dd3060ed57c$export$95185d699e05d4d7.isOpening = setOpening;
  $1969ac565cfec8d0$export$de79e2c695e052f3(target);
  target.dispatchEvent(event);
  $caaf0dd3060ed57c$export$95185d699e05d4d7.isOpening = false;
}
$caaf0dd3060ed57c$export$95185d699e05d4d7.isOpening = false;
let $8f5a2122b0992be3$var$currentModality = null;
const $8f5a2122b0992be3$export$901e90a13c50a14e = /* @__PURE__ */ new Set();
let $8f5a2122b0992be3$export$d90243b58daecda7 = /* @__PURE__ */ new Map();
let $8f5a2122b0992be3$var$hasEventBeforeFocus = false;
let $8f5a2122b0992be3$var$hasBlurredWindowRecently = false;
const $8f5a2122b0992be3$var$FOCUS_VISIBLE_INPUT_KEYS = {
  Tab: true,
  Escape: true
};
function $8f5a2122b0992be3$var$triggerChangeHandlers(modality, e) {
  for (let handler of $8f5a2122b0992be3$export$901e90a13c50a14e) handler(modality, e);
}
function $8f5a2122b0992be3$var$isValidKey(e) {
  return !(e.metaKey || !$2add3ce32c6007eb$export$9ac100e40613ea10() && e.altKey || e.ctrlKey || e.key === "Control" || e.key === "Shift" || e.key === "Meta");
}
function $8f5a2122b0992be3$var$handleKeyboardEvent(e) {
  $8f5a2122b0992be3$var$hasEventBeforeFocus = true;
  if (!$caaf0dd3060ed57c$export$95185d699e05d4d7.isOpening && $8f5a2122b0992be3$var$isValidKey(e)) {
    $8f5a2122b0992be3$var$currentModality = "keyboard";
    $8f5a2122b0992be3$var$triggerChangeHandlers("keyboard", e);
  }
}
function $8f5a2122b0992be3$var$handlePointerEvent(e) {
  $8f5a2122b0992be3$var$currentModality = "pointer";
  "pointerType" in e ? e.pointerType : "mouse";
  if (e.type === "mousedown" || e.type === "pointerdown") {
    $8f5a2122b0992be3$var$hasEventBeforeFocus = true;
    $8f5a2122b0992be3$var$triggerChangeHandlers("pointer", e);
  }
}
function $8f5a2122b0992be3$var$handleClickEvent(e) {
  if (!$caaf0dd3060ed57c$export$95185d699e05d4d7.isOpening && $b5c62b033c25b96d$export$60278871457622de(e)) {
    $8f5a2122b0992be3$var$hasEventBeforeFocus = true;
    $8f5a2122b0992be3$var$currentModality = "virtual";
  }
}
function $8f5a2122b0992be3$var$handleFocusEvent(e) {
  let ownerWindow = $d447af545b77c9f1$export$f21a1ffae260145a($23f2114a1b82827e$export$e58f029f0fbfdb29(e));
  let ownerDocument = $d447af545b77c9f1$export$b204af158042fbac($23f2114a1b82827e$export$e58f029f0fbfdb29(e));
  if ($23f2114a1b82827e$export$e58f029f0fbfdb29(e) === ownerWindow || $23f2114a1b82827e$export$e58f029f0fbfdb29(e) === ownerDocument || $a92dc41f639950be$export$fda7da73ab5d4c48 || !e.isTrusted) return;
  if (!$8f5a2122b0992be3$var$hasEventBeforeFocus && !$8f5a2122b0992be3$var$hasBlurredWindowRecently) {
    $8f5a2122b0992be3$var$currentModality = "virtual";
    $8f5a2122b0992be3$var$triggerChangeHandlers("virtual", e);
  }
  $8f5a2122b0992be3$var$hasEventBeforeFocus = false;
  $8f5a2122b0992be3$var$hasBlurredWindowRecently = false;
}
function $8f5a2122b0992be3$var$handleWindowBlur() {
  $8f5a2122b0992be3$var$hasEventBeforeFocus = false;
  $8f5a2122b0992be3$var$hasBlurredWindowRecently = true;
}
function $8f5a2122b0992be3$var$setupGlobalFocusEvents(element) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const windowObject = $d447af545b77c9f1$export$f21a1ffae260145a(element);
  const documentObject = $d447af545b77c9f1$export$b204af158042fbac(element);
  if ($8f5a2122b0992be3$export$d90243b58daecda7.get(windowObject)) return;
  let focus = windowObject.HTMLElement.prototype.focus;
  Reflect.defineProperty(windowObject.HTMLElement.prototype, "focus", {
    configurable: true,
    writable: true,
    value: function() {
      $8f5a2122b0992be3$var$hasEventBeforeFocus = true;
      focus.apply(this, arguments);
    }
  });
  documentObject.addEventListener("keydown", $8f5a2122b0992be3$var$handleKeyboardEvent, true);
  documentObject.addEventListener("keyup", $8f5a2122b0992be3$var$handleKeyboardEvent, true);
  documentObject.addEventListener("click", $8f5a2122b0992be3$var$handleClickEvent, true);
  windowObject.addEventListener("focus", $8f5a2122b0992be3$var$handleFocusEvent, true);
  windowObject.addEventListener("blur", $8f5a2122b0992be3$var$handleWindowBlur, false);
  if (typeof PointerEvent !== "undefined") {
    documentObject.addEventListener("pointerdown", $8f5a2122b0992be3$var$handlePointerEvent, true);
    documentObject.addEventListener("pointermove", $8f5a2122b0992be3$var$handlePointerEvent, true);
    documentObject.addEventListener("pointerup", $8f5a2122b0992be3$var$handlePointerEvent, true);
  }
  windowObject.addEventListener("beforeunload", () => {
    $8f5a2122b0992be3$var$tearDownWindowFocusTracking(element);
  }, {
    once: true
  });
  $8f5a2122b0992be3$export$d90243b58daecda7.set(windowObject, {
    focus
  });
}
const $8f5a2122b0992be3$var$tearDownWindowFocusTracking = (element, loadListener) => {
  const windowObject = $d447af545b77c9f1$export$f21a1ffae260145a(element);
  const documentObject = $d447af545b77c9f1$export$b204af158042fbac(element);
  if (loadListener) documentObject.removeEventListener("DOMContentLoaded", loadListener);
  if (!$8f5a2122b0992be3$export$d90243b58daecda7.has(windowObject)) return;
  Reflect.defineProperty(windowObject.HTMLElement.prototype, "focus", {
    configurable: true,
    writable: true,
    value: $8f5a2122b0992be3$export$d90243b58daecda7.get(windowObject).focus
  });
  documentObject.removeEventListener("keydown", $8f5a2122b0992be3$var$handleKeyboardEvent, true);
  documentObject.removeEventListener("keyup", $8f5a2122b0992be3$var$handleKeyboardEvent, true);
  documentObject.removeEventListener("click", $8f5a2122b0992be3$var$handleClickEvent, true);
  windowObject.removeEventListener("focus", $8f5a2122b0992be3$var$handleFocusEvent, true);
  windowObject.removeEventListener("blur", $8f5a2122b0992be3$var$handleWindowBlur, false);
  if (typeof PointerEvent !== "undefined") {
    documentObject.removeEventListener("pointerdown", $8f5a2122b0992be3$var$handlePointerEvent, true);
    documentObject.removeEventListener("pointermove", $8f5a2122b0992be3$var$handlePointerEvent, true);
    documentObject.removeEventListener("pointerup", $8f5a2122b0992be3$var$handlePointerEvent, true);
  }
  $8f5a2122b0992be3$export$d90243b58daecda7.delete(windowObject);
};
function $8f5a2122b0992be3$export$2f1888112f558a7d(element) {
  const documentObject = $d447af545b77c9f1$export$b204af158042fbac(element);
  let loadListener;
  if (documentObject.readyState !== "loading") $8f5a2122b0992be3$var$setupGlobalFocusEvents(element);
  else {
    loadListener = () => {
      $8f5a2122b0992be3$var$setupGlobalFocusEvents(element);
    };
    documentObject.addEventListener("DOMContentLoaded", loadListener);
  }
  return () => $8f5a2122b0992be3$var$tearDownWindowFocusTracking(element, loadListener);
}
if (typeof document !== "undefined") $8f5a2122b0992be3$export$2f1888112f558a7d();
function $8f5a2122b0992be3$export$b9b3dfddab17db27() {
  return $8f5a2122b0992be3$var$currentModality !== "pointer";
}
const $8f5a2122b0992be3$var$nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
function $8f5a2122b0992be3$var$isKeyboardFocusEvent(isTextInput, modality, e) {
  let eventTarget = e ? $23f2114a1b82827e$export$e58f029f0fbfdb29(e) : void 0;
  let ownerDocument = $d447af545b77c9f1$export$b204af158042fbac(eventTarget);
  let ownerWindow = $d447af545b77c9f1$export$f21a1ffae260145a(eventTarget);
  const IHTMLInputElement = typeof ownerWindow !== "undefined" ? ownerWindow.HTMLInputElement : HTMLInputElement;
  const IHTMLTextAreaElement = typeof ownerWindow !== "undefined" ? ownerWindow.HTMLTextAreaElement : HTMLTextAreaElement;
  const IHTMLElement = typeof ownerWindow !== "undefined" ? ownerWindow.HTMLElement : HTMLElement;
  const IKeyboardEvent = typeof ownerWindow !== "undefined" ? ownerWindow.KeyboardEvent : KeyboardEvent;
  let activeElement = $23f2114a1b82827e$export$cd4e5573fbe2b576(ownerDocument);
  isTextInput = isTextInput || activeElement instanceof IHTMLInputElement && !$8f5a2122b0992be3$var$nonTextInputTypes.has(activeElement.type) || activeElement instanceof IHTMLTextAreaElement || activeElement instanceof IHTMLElement && activeElement.isContentEditable;
  return !(isTextInput && modality === "keyboard" && e instanceof IKeyboardEvent && !$8f5a2122b0992be3$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}
function $8f5a2122b0992be3$export$ec71b4b83ac08ec3(fn, deps, opts) {
  $8f5a2122b0992be3$var$setupGlobalFocusEvents();
  reactExports.useEffect(() => {
    if (opts?.enabled === false) return;
    let handler = (modality, e) => {
      if (!$8f5a2122b0992be3$var$isKeyboardFocusEvent(!!opts?.isTextInput, modality, e)) return;
      fn($8f5a2122b0992be3$export$b9b3dfddab17db27());
    };
    $8f5a2122b0992be3$export$901e90a13c50a14e.add(handler);
    return () => {
      $8f5a2122b0992be3$export$901e90a13c50a14e.delete(handler);
    };
  }, deps);
}
function $1e74c67db218ce67$export$f8168d8dd8fd66e6(props) {
  let { isDisabled, onFocus: onFocusProp, onBlur: onBlurProp, onFocusChange } = props;
  const onBlur = reactExports.useCallback((e) => {
    if ($23f2114a1b82827e$export$e58f029f0fbfdb29(e) === e.currentTarget) {
      if (onBlurProp) onBlurProp(e);
      if (onFocusChange) onFocusChange(false);
      return true;
    }
  }, [
    onBlurProp,
    onFocusChange
  ]);
  const onSyntheticFocus = $a92dc41f639950be$export$715c682d09d639cc(onBlur);
  const onFocus = reactExports.useCallback((e) => {
    let eventTarget = $23f2114a1b82827e$export$e58f029f0fbfdb29(e);
    const ownerDocument = $d447af545b77c9f1$export$b204af158042fbac(eventTarget);
    const activeElement = ownerDocument ? $23f2114a1b82827e$export$cd4e5573fbe2b576(ownerDocument) : $23f2114a1b82827e$export$cd4e5573fbe2b576();
    if (eventTarget === e.currentTarget && eventTarget === activeElement) {
      if (onFocusProp) onFocusProp(e);
      if (onFocusChange) onFocusChange(true);
      onSyntheticFocus(e);
    }
  }, [
    onFocusChange,
    onFocusProp,
    onSyntheticFocus
  ]);
  return {
    focusProps: {
      onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : void 0,
      onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : void 0
    }
  };
}
function $48a7d519b337145d$export$4eaf04e54aa8eed6() {
  let globalListeners = reactExports.useRef(/* @__PURE__ */ new Map());
  let addGlobalListener = reactExports.useCallback((eventTarget, type, listener, options) => {
    let fn = options?.once ? (...args) => {
      globalListeners.current.delete(listener);
      listener(...args);
    } : listener;
    globalListeners.current.set(listener, {
      type,
      eventTarget,
      fn,
      options
    });
    eventTarget.addEventListener(type, fn, options);
  }, []);
  let removeGlobalListener = reactExports.useCallback((eventTarget, type, listener, options) => {
    let fn = globalListeners.current.get(listener)?.fn || listener;
    eventTarget.removeEventListener(type, fn, options);
    globalListeners.current.delete(listener);
  }, []);
  let removeAllGlobalListeners = reactExports.useCallback(() => {
    globalListeners.current.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options);
    });
  }, [
    removeGlobalListener
  ]);
  reactExports.useEffect(() => {
    return removeAllGlobalListeners;
  }, [
    removeAllGlobalListeners
  ]);
  return {
    addGlobalListener,
    removeGlobalListener,
    removeAllGlobalListeners
  };
}
function $2c9edc598a03d523$export$420e68273165f4ec(props) {
  let { isDisabled, onBlurWithin, onFocusWithin, onFocusWithinChange } = props;
  let state = reactExports.useRef({
    isFocusWithin: false
  });
  let { addGlobalListener, removeAllGlobalListeners } = $48a7d519b337145d$export$4eaf04e54aa8eed6();
  let onBlur = reactExports.useCallback((e) => {
    if (!$23f2114a1b82827e$export$4282f70798064fe0(e.currentTarget, $23f2114a1b82827e$export$e58f029f0fbfdb29(e))) return;
    if (state.current.isFocusWithin && !$23f2114a1b82827e$export$4282f70798064fe0(e.currentTarget, e.relatedTarget)) {
      state.current.isFocusWithin = false;
      removeAllGlobalListeners();
      if (onBlurWithin) onBlurWithin(e);
      if (onFocusWithinChange) onFocusWithinChange(false);
    }
  }, [
    onBlurWithin,
    onFocusWithinChange,
    state,
    removeAllGlobalListeners
  ]);
  let onSyntheticFocus = $a92dc41f639950be$export$715c682d09d639cc(onBlur);
  let onFocus = reactExports.useCallback((e) => {
    if (!$23f2114a1b82827e$export$4282f70798064fe0(e.currentTarget, $23f2114a1b82827e$export$e58f029f0fbfdb29(e))) return;
    let eventTarget = $23f2114a1b82827e$export$e58f029f0fbfdb29(e);
    const ownerDocument = $d447af545b77c9f1$export$b204af158042fbac(eventTarget);
    const activeElement = $23f2114a1b82827e$export$cd4e5573fbe2b576(ownerDocument);
    if (!state.current.isFocusWithin && activeElement === eventTarget) {
      if (onFocusWithin) onFocusWithin(e);
      if (onFocusWithinChange) onFocusWithinChange(true);
      state.current.isFocusWithin = true;
      onSyntheticFocus(e);
      let currentTarget = e.currentTarget;
      addGlobalListener(ownerDocument, "focus", (e2) => {
        let eventTarget2 = $23f2114a1b82827e$export$e58f029f0fbfdb29(e2);
        if (state.current.isFocusWithin && !$23f2114a1b82827e$export$4282f70798064fe0(currentTarget, eventTarget2)) {
          let nativeEvent = new ownerDocument.defaultView.FocusEvent("blur", {
            relatedTarget: eventTarget2
          });
          $a92dc41f639950be$export$c2b7abe5d61ec696(nativeEvent, currentTarget);
          let event = $a92dc41f639950be$export$525bc4921d56d4a(nativeEvent);
          onBlur(event);
        }
      }, {
        capture: true
      });
    }
  }, [
    onFocusWithin,
    onFocusWithinChange,
    onSyntheticFocus,
    addGlobalListener,
    onBlur
  ]);
  if (isDisabled) return {
    focusWithinProps: {
      // These cannot be null, that would conflict in mergeProps
      onFocus: void 0,
      onBlur: void 0
    }
  };
  return {
    focusWithinProps: {
      onFocus,
      onBlur
    }
  };
}
function $0c4a58759813079a$export$4e328f61c538687f(props = {}) {
  let { autoFocus = false, isTextInput, within } = props;
  let state = reactExports.useRef({
    isFocused: false,
    isFocusVisible: autoFocus || $8f5a2122b0992be3$export$b9b3dfddab17db27()
  });
  let [isFocused, setFocused] = reactExports.useState(false);
  let [isFocusVisibleState, setFocusVisible] = reactExports.useState(
    // oxlint-disable-next-line react/react-compiler
    () => state.current.isFocused && state.current.isFocusVisible
  );
  let updateState = reactExports.useCallback(() => setFocusVisible(state.current.isFocused && state.current.isFocusVisible), []);
  let onFocusChange = reactExports.useCallback((isFocused2) => {
    state.current.isFocused = isFocused2;
    state.current.isFocusVisible = $8f5a2122b0992be3$export$b9b3dfddab17db27();
    setFocused(isFocused2);
    updateState();
  }, [
    updateState
  ]);
  $8f5a2122b0992be3$export$ec71b4b83ac08ec3((isFocusVisible) => {
    state.current.isFocusVisible = isFocusVisible;
    updateState();
  }, [
    isTextInput,
    isFocused
  ], {
    enabled: isFocused,
    isTextInput
  });
  let { focusProps } = $1e74c67db218ce67$export$f8168d8dd8fd66e6({
    isDisabled: within,
    onFocusChange
  });
  let { focusWithinProps } = $2c9edc598a03d523$export$420e68273165f4ec({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });
  return {
    isFocused,
    isFocusVisible: isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}
let $e969f22b6713ca4a$var$globalIgnoreEmulatedMouseEvents = false;
let $e969f22b6713ca4a$var$hoverCount = 0;
function $e969f22b6713ca4a$var$setGlobalIgnoreEmulatedMouseEvents() {
  $e969f22b6713ca4a$var$globalIgnoreEmulatedMouseEvents = true;
  setTimeout(() => {
    $e969f22b6713ca4a$var$globalIgnoreEmulatedMouseEvents = false;
  }, 500);
}
function $e969f22b6713ca4a$var$handleGlobalPointerEvent(e) {
  if (e.pointerType === "touch") $e969f22b6713ca4a$var$setGlobalIgnoreEmulatedMouseEvents();
}
function $e969f22b6713ca4a$var$setupGlobalTouchEvents() {
  let ownerDocument = $d447af545b77c9f1$export$b204af158042fbac(null);
  if (typeof ownerDocument === "undefined") return;
  if ($e969f22b6713ca4a$var$hoverCount === 0) {
    if (typeof PointerEvent !== "undefined") ownerDocument.addEventListener("pointerup", $e969f22b6713ca4a$var$handleGlobalPointerEvent);
  }
  $e969f22b6713ca4a$var$hoverCount++;
  return () => {
    $e969f22b6713ca4a$var$hoverCount--;
    if ($e969f22b6713ca4a$var$hoverCount > 0) return;
    if (typeof PointerEvent !== "undefined") ownerDocument.removeEventListener("pointerup", $e969f22b6713ca4a$var$handleGlobalPointerEvent);
  };
}
function $e969f22b6713ca4a$export$ae780daf29e6d456(props) {
  let { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props;
  let [isHovered, setHovered] = reactExports.useState(false);
  let state = reactExports.useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: "",
    target: null
  }).current;
  reactExports.useEffect($e969f22b6713ca4a$var$setupGlobalTouchEvents, []);
  let { addGlobalListener, removeAllGlobalListeners } = $48a7d519b337145d$export$4eaf04e54aa8eed6();
  let { hoverProps, triggerHoverEnd } = reactExports.useMemo(() => {
    let triggerHoverStart = (event, pointerType) => {
      state.pointerType = pointerType;
      if (isDisabled || pointerType === "touch" || state.isHovered || !$23f2114a1b82827e$export$4282f70798064fe0(event.currentTarget, $23f2114a1b82827e$export$e58f029f0fbfdb29(event))) return;
      state.isHovered = true;
      let target = event.currentTarget;
      state.target = target;
      addGlobalListener($d447af545b77c9f1$export$b204af158042fbac($23f2114a1b82827e$export$e58f029f0fbfdb29(event)), "pointerover", (e) => {
        if (state.isHovered && state.target && !$23f2114a1b82827e$export$4282f70798064fe0(state.target, $23f2114a1b82827e$export$e58f029f0fbfdb29(e)))
          triggerHoverEnd2(e, e.pointerType);
      }, {
        capture: true
      });
      if (onHoverStart) onHoverStart({
        type: "hoverstart",
        target,
        pointerType
      });
      if (onHoverChange) onHoverChange(true);
      setHovered(true);
    };
    let triggerHoverEnd2 = (event, pointerType) => {
      let target = state.target;
      state.pointerType = "";
      state.target = null;
      if (pointerType === "touch" || !state.isHovered || !target) return;
      state.isHovered = false;
      removeAllGlobalListeners();
      if (onHoverEnd) onHoverEnd({
        type: "hoverend",
        target,
        pointerType
      });
      if (onHoverChange) onHoverChange(false);
      setHovered(false);
    };
    let hoverProps2 = {};
    if (typeof PointerEvent !== "undefined") {
      hoverProps2.onPointerEnter = (e) => {
        if ($e969f22b6713ca4a$var$globalIgnoreEmulatedMouseEvents && e.pointerType === "mouse") return;
        triggerHoverStart(e, e.pointerType);
      };
      hoverProps2.onPointerLeave = (e) => {
        if (!isDisabled && $23f2114a1b82827e$export$4282f70798064fe0(e.currentTarget, $23f2114a1b82827e$export$e58f029f0fbfdb29(e))) triggerHoverEnd2(e, e.pointerType);
      };
    }
    return {
      hoverProps: hoverProps2,
      triggerHoverEnd: triggerHoverEnd2
    };
  }, [
    onHoverStart,
    onHoverChange,
    onHoverEnd,
    isDisabled,
    state,
    addGlobalListener,
    removeAllGlobalListeners
  ]);
  reactExports.useEffect(() => {
    if (isDisabled) triggerHoverEnd({
      currentTarget: state.target
    }, state.pointerType);
  }, [
    isDisabled
  ]);
  return {
    hoverProps,
    isHovered
  };
}
export {
  $0c4a58759813079a$export$4e328f61c538687f as $,
  $e969f22b6713ca4a$export$ae780daf29e6d456 as a
};
