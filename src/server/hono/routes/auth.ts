import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ensureAppUser } from "@/server/auth/session";
import { getSupabaseServerClient } from "@/server/auth/supabase.server";

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

/**
 * Public auth endpoints. Password flows run here so the Supabase refresh
 * cookies are written onto the same-origin response.
 */
export const authRouter = new Hono()
	.post("/login", zv("json", credentialsSchema), async (c) => {
		const { email, password } = c.req.valid("json");
		const supabase = getSupabaseServerClient(c);

		const { data: result, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) return c.json({ error: error.message });

		if (result.user) {
			await ensureAppUser({
				id: result.user.id,
				email: result.user.email ?? "",
			});
		}

		return c.json({ error: null });
	})
	.post("/signup", zv("json", credentialsSchema), async (c) => {
		const { email, password } = c.req.valid("json");
		const supabase = getSupabaseServerClient(c);

		const { data: result, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) return c.json({ error: error.message });

		if (result.session?.user) {
			await ensureAppUser({
				id: result.session.user.id,
				email: result.session.user.email ?? "",
			});
			return c.json({ error: null, needsEmailConfirmation: false });
		}

		return c.json({ error: null, needsEmailConfirmation: true });
	})
	.post("/logout", async (c) => {
		const supabase = getSupabaseServerClient(c);
		await supabase.auth.signOut();
		return c.json({ success: true });
	})
	.get("/session", async (c) => {
		const supabase = getSupabaseServerClient(c);
		const {
			data: { user },
		} = await supabase.auth.getUser();

		return c.json({
			user: user ? { id: user.id, email: user.email ?? "" } : null,
		});
	})
	.post("/ensure-user", async (c) => {
		const supabase = getSupabaseServerClient(c);
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return c.json({ error: "Not authenticated" }, 401);
		}

		await ensureAppUser({ id: user.id, email: user.email ?? "" });
		return c.json({ error: null });
	});
