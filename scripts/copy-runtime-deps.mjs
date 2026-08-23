/**
 * Ships packages that are externalized into Vercel's "_libs/*.mjs" chunks but
 * whose own transitive dependencies never get traced into the deployment
 * (pnpm does not hoist them). Copied straight into the server output's
 * node_modules so runtime resolution succeeds.
 *
 * Add more package names here if a similar ERR_MODULE_NOT_FOUND appears for
 * another externalized dependency.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const PACKAGES = ["tslib"];

const require_ = createRequire(import.meta.url);
const serverOutDir = join(process.cwd(), "dist", "server");

for (const name of PACKAGES) {
	const entryPath = require_.resolve(name);
	// Walk up from the resolved entry to the directory containing its package.json
	let dir = dirname(entryPath);
	while (dir !== "/" && !existsSync(join(dir, "package.json"))) {
		dir = dirname(dir);
	}
	const target = join(serverOutDir, "node_modules", name);
	mkdirSync(dirname(target), { recursive: true });
	cpSync(dir, target, { recursive: true });
	console.log(`[copy-runtime-deps] ${name} -> ${target}`);
}
