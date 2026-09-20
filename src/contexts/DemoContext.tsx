import { createContext, useContext } from "react";

export const DemoContext = createContext<{ requestAccess: () => void } | null>(
	null,
);
export const useDemo = () => useContext(DemoContext);
