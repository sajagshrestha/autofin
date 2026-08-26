import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export interface CategoryComboboxOption {
	id: string;
	label: string;
	searchLabel: string;
}

interface CategoryComboboxProps {
	value: string;
	onChange: (value: string) => void;
	options: CategoryComboboxOption[];
	placeholder?: string;
	className?: string;
}

export function CategoryCombobox({
	value,
	onChange,
	options,
	placeholder = "Select category",
	className,
}: CategoryComboboxProps) {
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const visibleOptions = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return options;
		return options.filter((option) => option.searchLabel.includes(normalized));
	}, [options, query]);

	const selected = options.find((option) => option.id === value);

	return (
		<Combobox
			value={value}
			onChange={(id) => {
				onChange(id ?? "");
				setQuery("");
				inputRef.current?.blur();
			}}
			immediate
		>
			<div className={`relative ${className}`}>
				<ComboboxInput
					ref={inputRef}
					className="h-8 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder={placeholder}
					displayValue={() => selected?.label ?? ""}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground">
					<ChevronsUpDown className="h-4 w-4" />
				</ComboboxButton>
				<ComboboxOptions
					modal={false}
					className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md empty:invisible"
				>
					{visibleOptions.length === 0 ? (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							No categories found
						</div>
					) : (
						visibleOptions.map((option) => (
							<ComboboxOption
								key={option.id}
								value={option.id}
								className="group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-[focus]:bg-accent data-[focus]:text-accent-foreground"
							>
								<span className="truncate">{option.label}</span>
								<Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
							</ComboboxOption>
						))
					)}
				</ComboboxOptions>
			</div>
		</Combobox>
	);
}
