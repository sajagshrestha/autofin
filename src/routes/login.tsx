import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { GoogleIcon } from "@/components/GoogleIcon";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { rpc, unwrap } from "@/lib/api-client";
import { type LoginFormData, loginSchema } from "@/schemas/auth";

const searchParamsSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: searchParamsSchema,
	component: LoginPage,
});

function LoginPage() {
	const [serverError, setServerError] = useState<string | null>(null);
	const [googleLoading, setGoogleLoading] = useState(false);
	const { signInWithGoogle } = useAuth();
	const navigate = useNavigate();
	const { redirect: redirectTo } = Route.useSearch();

	const login = async (email: string, password: string) => {
		setServerError(null);
		try {
			const res = await rpc.api.auth.login.$post({
				json: { email, password },
			});
			const result = await unwrap<{ error: string | null }>(res);
			if (result.error) {
				setServerError(result.error);
				return;
			}
			navigate({ href: redirectTo || "/dashboard" });
		} catch (error) {
			setServerError(
				error instanceof Error ? error.message : "Something went wrong",
			);
		}
	};

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} as LoginFormData,
		onSubmit: ({ value }) => login(value.email, value.password),
		validators: {
			onChange: loginSchema,
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="items-center text-center">
					<Logo className="h-12" />
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Enter your email and password to sign in
					</CardDescription>
				</CardHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<CardContent>
						<FieldGroup>
							{serverError && (
								<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
									{serverError}
								</div>
							)}
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												placeholder="you@example.com"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={form.state.isSubmitting}
												aria-invalid={isInvalid}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={form.state.isSubmitting}
												aria-invalid={isInvalid}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button
							type="submit"
							className="w-full"
							disabled={form.state.isSubmitting}
						>
							{form.state.isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
						<div className="relative w-full">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						<Button
							type="button"
							variant="outline"
							className="w-full"
							disabled={googleLoading}
							onClick={async () => {
								setGoogleLoading(true);
								setServerError(null);
								const { error } = await signInWithGoogle();
								if (error) {
									setServerError(error.message);
									setGoogleLoading(false);
								}
							}}
						>
							<GoogleIcon className="mr-2 h-4 w-4" />
							{googleLoading ? "Signing in..." : "Continue with Google"}
						</Button>
						<p className="text-center text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-primary hover:underline font-medium"
							>
								Sign up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
