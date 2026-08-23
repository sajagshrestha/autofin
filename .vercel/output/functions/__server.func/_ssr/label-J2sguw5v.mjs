import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-CdED92sw.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
export {
  Label as L
};
