import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePreferences } from "@/hooks/preferences/mutations";
import { useGetPreferences } from "@/hooks/preferences/queries";

export function AiPreferencesSection() {
	const { data: preferences, isLoading } = useGetPreferences();
	const updateMutation = useUpdatePreferences();
	const [prompt, setPrompt] = useState<string | null>(null);

	const value = prompt ?? preferences?.categoryMappingPrompt ?? "";
	const dirty =
		prompt !== null && prompt !== (preferences?.categoryMappingPrompt ?? "");

	const handleSave = () => {
		updateMutation.mutate(
			{ categoryMappingPrompt: value.trim() || null },
			{
				onSuccess: () => {
					toast.success("AI preferences saved");
					setPrompt(null);
				},
				onError: (err: Error) => {
					toast.error("Failed to save preferences", {
						description: err.message,
					});
				},
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Sparkles className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Custom category mapping</CardTitle>
							<CardDescription>
								Personal rules the AI follows when categorizing your
								transactions — across SMS/email extraction, statement imports,
								and the advisor chat.
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<div className="space-y-2">
							<Label htmlFor="category-mapping-prompt">
								Category mapping instructions
							</Label>
							<Textarea
								id="category-mapping-prompt"
								placeholder={
									"Examples:\n- Treat every SWIGGY or PATHAO charge as Food & Delivery\n- AWS and Google Cloud charges are always Business Expenses\n- Ignore anything from my landlord (track manually)"
								}
								rows={7}
								maxLength={4000}
								value={value}
								onChange={(e) => setPrompt(e.target.value)}
								className="font-mono text-sm"
							/>
							<p className="text-right text-xs text-muted-foreground">
								{value.length}/4000 characters
							</p>
						</div>
						<div className="flex justify-end gap-2">
							{dirty && (
								<Button variant="ghost" onClick={() => setPrompt(null)}>
									Discard
								</Button>
							)}
							<Button
								onClick={handleSave}
								disabled={updateMutation.isPending || !dirty}
							>
								{updateMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Save preferences
							</Button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
