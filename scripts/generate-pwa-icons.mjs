import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates the PWA icon set from the wordmark logo.
 *
 * Builds a single square SVG icon (dark background + white "AutoFin"
 * wordmark with the red dot) and rasterizes it to the sizes referenced by
 * public/manifest.json using macOS `qlmanage`. Requires macOS.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const tmpDir = path.join(root, ".pwa-icons");

const wordmark = readFileSync(path.join(publicDir, "logo-dark.svg"), "utf8");
const inner = wordmark.replace(/^<svg[^>]*>/, "").replace(/<\/svg>/, "").trim();

const SIZE = 512;
const WORDMARK_WIDTH = 152;
const WORDMARK_HEIGHT = 48;

// Scale the wordmark to ~72% of the canvas width, centered.
const scale = (SIZE * 0.72) / WORDMARK_WIDTH;
const w = WORDMARK_WIDTH * scale;
const h = WORDMARK_HEIGHT * scale;
const x = (SIZE - w) / 2;
const y = (SIZE - h) / 2;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none">
<rect width="${SIZE}" height="${SIZE}" fill="#0a0a0a"/>
<g transform="translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${scale.toFixed(4)})">
${inner}
</g>
</svg>`;

writeFileSync(path.join(publicDir, "icon.svg"), iconSvg);

mkdirSync(tmpDir, { recursive: true });
execSync(`qlmanage -t -s ${SIZE} -o "${tmpDir}" "${publicDir}/icon.svg"`, {
	stdio: "inherit",
});

const targets = [
	["logo512.png", 512],
	["logo192.png", 192],
	["apple-touch-icon.png", 180],
];

for (const [name, size] of targets) {
	if (size !== SIZE) {
		execSync(`qlmanage -t -s ${size} -o "${tmpDir}" "${publicDir}/icon.svg"`, {
			stdio: "inherit",
		});
	}
	const src = path.join(tmpDir, `icon.svg.png`);
	const dest = path.join(publicDir, name);
	writeFileSync(dest, readFileSync(src));
	console.log(`wrote ${name} (${size}x${size})`);
}

execSync(`rm -rf "${tmpDir}"`);
console.log("done");
