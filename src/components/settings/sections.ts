import { type LucideIcon, Mail, Palette, Plug, Sparkles } from "lucide-react";

export interface SettingsSection {
	to: string;
	label: string;
	description: string;
	icon: LucideIcon;
}

/** Ordered list of settings sections, shared by the desktop tabs and the
 * mobile intermediary list. */
export const SETTINGS_SECTIONS: SettingsSection[] = [
	{
		to: "/settings/gmail",
		label: "Gmail",
		description: "Connect Gmail, set filters, and start watching.",
		icon: Mail,
	},
	{
		to: "/settings/ai",
		label: "AI Preferences",
		description: "Custom rules the AI follows when categorizing.",
		icon: Sparkles,
	},
	{
		to: "/settings/mcp",
		label: "MCP",
		description: "Connect AI assistants to your finances.",
		icon: Plug,
	},
	{
		to: "/settings/appearance",
		label: "Appearance",
		description: "Pick a theme and light or dark mode.",
		icon: Palette,
	},
];
