import { useState } from "react";
import { useGetCounterparties } from "@/hooks/loans";
import { Input } from "./input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

export type CounterpartySelection =
	| { kind: "existing"; id: string; name: string }
	| { kind: "new"; name: string };

const NEW_VALUE = "__new__";

interface CounterpartySelectProps {
	value: CounterpartySelection | null;
	onChange: (value: CounterpartySelection | null) => void;
	/** Prefills "new counterparty" mode (e.g. with the merchant name). */
	defaultName?: string;
	placeholder?: string;
	id?: string;
}

/**
 * Select-or-create counterparty picker: choose an existing counterparty from
 * the dropdown or pick "New counterparty…" and type a name. Fully
 * controlled via `value`/`onChange`, so opening the parent dialog never pops
 * anything open and typing can't desync from the submitted value.
 */
export function CounterpartySelect({
	value,
	onChange,
	defaultName = "",
	placeholder = "Select counterparty",
	id,
}: CounterpartySelectProps) {
	const { data, isLoading } = useGetCounterparties();
	const options = data?.counterparties ?? [];
	const [newName, setNewName] = useState(
		value?.kind === "new" ? value.name : defaultName,
	);

	const selectValue =
		value?.kind === "existing"
			? value.id
			: value?.kind === "new"
				? NEW_VALUE
				: "";

	return (
		<div className="space-y-2">
			<Select
				value={selectValue}
				onValueChange={(next) => {
					if (next === NEW_VALUE) {
						onChange({ kind: "new", name: newName });
					} else {
						const match = options.find((option) => option.id === next);
						onChange(
							match
								? { kind: "existing", id: match.id, name: match.name }
								: null,
						);
					}
				}}
			>
				<SelectTrigger id={id} className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{isLoading ? (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							Loading counterparties…
						</div>
					) : (
						<>
							{options.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{option.name}
									{option.totalLoans > 0 &&
										` (${option.totalLoans} loan${option.totalLoans !== 1 ? "s" : ""})`}
								</SelectItem>
							))}
							<SelectItem value={NEW_VALUE}>+ New counterparty…</SelectItem>
						</>
					)}
				</SelectContent>
			</Select>
			{value?.kind === "new" && (
				<Input
					placeholder="New counterparty name"
					value={newName}
					onChange={(e) => {
						setNewName(e.target.value);
						onChange({ kind: "new", name: e.target.value });
					}}
				/>
			)}
		</div>
	);
}
