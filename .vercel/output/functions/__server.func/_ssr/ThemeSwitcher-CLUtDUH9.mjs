import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useTheme, B as Button } from "./router-DlfOSAQe.mjs";
import { j as Sun, k as Moon } from "../_libs/lucide-react.mjs";
function Logo({ className }) {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "AutoFin", className });
}
function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: toggleTheme,
      "aria-label": "Toggle theme",
      className: "relative",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}
export {
  Logo as L,
  ThemeSwitcher as T
};
