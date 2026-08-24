import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-CvFqzVfm.mjs";
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
export {
  Skeleton as S
};
