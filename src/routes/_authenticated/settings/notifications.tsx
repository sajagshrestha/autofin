import { createFileRoute } from "@tanstack/react-router";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import {
	getSettingsSection,
	SettingsSectionPage,
} from "@/components/settings/SettingsSectionPage";

export const Route = createFileRoute("/_authenticated/settings/notifications")({
	component: NotificationsSettingsPage,
});

function NotificationsSettingsPage() {
	const section = getSettingsSection("/settings/notifications");
	return (
		<SettingsSectionPage section={section}>
			<NotificationsSection />
		</SettingsSectionPage>
	);
}
