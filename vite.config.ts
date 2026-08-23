import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import {type PluginOption, defineConfig, loadEnv} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {nitro} from "nitro/vite";

/**
 * Force-bundle the supabase stack into the server chunk on all surfaces
 * (Vite SSR env + Nitro/Vercel externals). Externalized "_libs" chunks lose
 * their transitive deps (tslib) in some deployment tracers, which crashes
 * at runtime — bundling removes the entire class of failure.
 */
function bundleSupabaseOnServer(): PluginOption {
	return {
		name: "autofin:bundle-supabase-on-server",
		enforce: "post",
		config(config) {
			const targets = [
				"@supabase/ssr",
				"@supabase/supabase-js",
				"@supabase/auth-js",
			];

			const environments = (config.environments ??= {}) as Record<
				string,
				{ resolve?: { noExternal?: string[] } }
			>;
			const server = (environments.server ??= {});
			server.resolve ??= {};
			server.resolve.noExternal = [
				...new Set([...(server.resolve.noExternal ?? []), ...targets]),
			];

			const ssr = ((config as Record<string, unknown>).ssr ??= {}) as {
				noExternal?: string[];
			};
			ssr.noExternal = [...new Set([...(ssr.noExternal ?? []), ...targets])];
		},
	};
}

export default defineConfig(({mode}) => {
  // Load all env vars (with or without the VITE_ prefix) into process.env
  // so that server-side code (drizzle, supabase admin, gmail, ai) can read them.
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000
    },
    optimizeDeps: {
      include: ["react-markdown"]
    },
    plugins: [
      bundleSupabaseOnServer(),
      tanstackStart(),
      // react's vite plugin must come after start's vite plugin
      viteReact(),
      nitro({
        preset: "vercel"
      }),
      tailwindcss(),
      tsconfigPaths()
    ]
  };
});
