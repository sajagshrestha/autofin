import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	THEME_NAMES,
	type ThemeMode,
	type ThemeName,
	useTheme,
} from "@/contexts/ThemeContext";

const MODE_OPTIONS: ReadonlyArray<{
	value: ThemeMode;
	label: string;
	icon: typeof Sun;
}> = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
];

/** Representative light-mode palette per theme, used for preview swatches. */
const THEME_PREVIEWS: Record<ThemeName, string[]> = {
	default: ["hsl(0 0% 100%)", "hsl(212 100% 48%)", "hsl(0 0% 9%)"],
	midnight: ["hsl(0 0% 100%)", "hsl(262 83% 58%)", "hsl(245 25% 15%)"],
	ocean: ["hsl(0 0% 100%)", "hsl(187 75% 38%)", "hsl(210 25% 15%)"],
	forest: ["hsl(0 0% 100%)", "hsl(142 60% 42%)", "hsl(150 25% 15%)"],
};

export function AppearanceSection() {
	const { mode, setMode, theme, setTheme } = useTheme();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Palette className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Appearance</CardTitle>
							<CardDescription>
								Pick a color theme and whether to use light or dark mode.
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="space-y-3">
					<Label>Themes</Label>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{THEME_NAMES.map(({ name, label, description }) => (
							<button
								key={name}
								type="button"
								onClick={() => setTheme(name)}
								className={`group relative flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors ${
									theme === name
										? "border-primary ring-2 ring-ring/50"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-1.5">
										{THEME_PREVIEWS[name].map((color) => (
											<span
												key={color}
												className="h-4 w-4 rounded-full border border-border"
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
									{theme === name && <Check className="h-4 w-4 text-primary" />}
								</div>
								<div>
									<p className="text-sm font-semibold">{label}</p>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{description}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-3">
					<Label>Mode</Label>
					<div className="grid grid-cols-3 gap-2">
						{MODE_OPTIONS.map(({ value, label, icon: Icon }) => (
							<Button
								key={value}
								type="button"
								variant={mode === value ? "default" : "outline"}
								onClick={() => setMode(value)}
								className="justify-center"
							>
								<Icon className="mr-2 h-4 w-4" />
								{label}
							</Button>
						))}
					</div>
					<p className="text-xs text-muted-foreground">
						System follows your device&apos;s light or dark preference.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
