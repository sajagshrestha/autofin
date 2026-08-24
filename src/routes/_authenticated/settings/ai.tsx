import { createFileRoute } from "@tanstack/react-router";
import { AiPreferencesSection } from "@/components/settings/AiPreferencesSection";
import {
	getSettingsSection,
	SettingsSectionPage,
} from "@/components/settings/SettingsSectionPage";

export const Route = createFileRoute("/_authenticated/settings/ai")({
	component: AiSettingsPage,
});

function AiSettingsPage() {
	const section = getSettingsSection("/settings/ai");
	return (
		<SettingsSectionPage section={section}>
			<AiPreferencesSection />
		</SettingsSectionPage>
	);
}
