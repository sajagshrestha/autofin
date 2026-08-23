import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./router-DlfOSAQe.mjs";
import { s as ArrowLeft } from "../_libs/lucide-react.mjs";
function BackButton({
  fallback,
  children = "Back",
  onClick,
  ...buttonProps
}) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: fallback });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleClick, ...buttonProps, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
    children
  ] });
}
export {
  BackButton as B
};
