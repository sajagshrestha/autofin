import { createFileRoute } from "@tanstack/react-router";
import { McpSection } from "@/components/settings/McpSection";
import {
	getSettingsSection,
	SettingsSectionPage,
} from "@/components/settings/SettingsSectionPage";

export const Route = createFileRoute("/_authenticated/settings/mcp")({
	component: McpSettingsPage,
});

function McpSettingsPage() {
	const section = getSettingsSection("/settings/mcp");
	return (
		<SettingsSectionPage section={section}>
			<McpSection />
		</SettingsSectionPage>
	);
}
