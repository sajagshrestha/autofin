import { createCsrfMiddleware, createStart } from "@tanstack/react-start";

// A custom Start entry replaces the framework's default middleware list.
// Preserve its server-function protection; Hono guards its own API requests.
const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
	// Pages render in the browser unless they explicitly opt into SSR.
	defaultSsr: false,
	requestMiddleware: [csrfMiddleware],
}));
