import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Shell/CI variables take precedence over local files. Never print credentials.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "node",
		include: ["src/**/*.integration.test.ts"],
		testTimeout: 180_000,
		hookTimeout: 10_000,
		fileParallelism: false,
		retry: 0,
		reporters: ["verbose"],
	},
});
