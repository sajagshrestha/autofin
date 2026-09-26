import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SETTINGS_SECTIONS, type SettingsSection } from "./sections";

/** Renders a standalone settings section page (breadcrumb + header + content),
 * used as the mobile target for each settings section. */
export function SettingsSectionPage({
	section,
	children,
}: {
	section: SettingsSection;
	children: ReactNode;
}) {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<Breadcrumbs
				items={[
					{ label: "Settings", to: "/settings" },
					{ label: section.label },
				]}
			/>
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="flex min-h-9 items-center text-xl sm:text-2xl font-semibold tracking-tight">
						{section.label}
					</h1>
				</div>
			</div>
			{children}
		</div>
	);
}

/** Looks up a settings section by its route path. */
export function getSettingsSection(to: string): SettingsSection {
	return (
		SETTINGS_SECTIONS.find((section) => section.to === to) ??
		SETTINGS_SECTIONS[0]
	);
}
