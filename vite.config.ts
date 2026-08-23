import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// Load all env vars (with or without the VITE_ prefix) into process.env
	// so that server-side code (drizzle, supabase admin, gmail, ai) can read them.
	const env = loadEnv(mode, process.cwd(), "");
	Object.assign(process.env, env);

	return {
		server: {
			port: 3000,
		},
		optimizeDeps: {
			include: ["react-markdown"],
		},
		plugins: [
			tanstackStart(),
			// react's vite plugin must come after start's vite plugin
			viteReact(),
			tailwindcss(),
			tsconfigPaths(),
		],
	};
});
