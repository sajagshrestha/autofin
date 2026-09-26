import type { ChatTransport, UIMessage } from "ai";
import { createContext, useContext } from "react";

export const DemoContext = createContext<{
	requestAccess: () => void;
	advisorTransport: ChatTransport<UIMessage>;
} | null>(null);
export const useDemo = () => useContext(DemoContext);
