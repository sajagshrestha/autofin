import { createFileRoute } from "@tanstack/react-router";
import { GmailSection } from "@/components/settings/GmailSection";
import {
	getSettingsSection,
	SettingsSectionPage,
} from "@/components/settings/SettingsSectionPage";

export const Route = createFileRoute("/_authenticated/settings/gmail")({
	component: GmailSettingsPage,
});

function GmailSettingsPage() {
	const section = getSettingsSection("/settings/gmail");
	return (
		<SettingsSectionPage section={section}>
			<GmailSection />
		</SettingsSectionPage>
	);
}
