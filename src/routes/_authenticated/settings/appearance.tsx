import { createFileRoute } from "@tanstack/react-router";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import {
	getSettingsSection,
	SettingsSectionPage,
} from "@/components/settings/SettingsSectionPage";

export const Route = createFileRoute("/_authenticated/settings/appearance")({
	component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
	const section = getSettingsSection("/settings/appearance");
	return (
		<SettingsSectionPage section={section}>
			<AppearanceSection />
		</SettingsSectionPage>
	);
}
