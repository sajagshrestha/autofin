import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "node",
		include: ["src/**/*.test.{ts,tsx}"],
 exclude: [...configDefaults.exclude, "**/*.integration.test.ts"],
	},
});
