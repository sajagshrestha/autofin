/** A category as returned by the API (dates are ISO strings). */
export interface Category {
	id: string;
	userId: string | null;
	name: string;
	icon: string | null;
	bucket?: "needs" | "wants" | "unassigned";
	isDefault: boolean;
	isAiCreated: boolean;
	createdAt: string;
}

export type CategoryFormBody = {
	name: string;
	icon?: string;
	bucket?: "needs" | "wants" | "unassigned";
};
