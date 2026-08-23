/** A category as returned by the API (dates are ISO strings). */
export interface Category {
	id: string;
	userId: string | null;
	name: string;
	icon: string | null;
	isDefault: boolean;
	isAiCreated: boolean;
	createdAt: string;
}

export type CategoryFormBody = { name: string; icon?: string };
