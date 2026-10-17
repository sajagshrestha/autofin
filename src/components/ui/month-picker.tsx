import {
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const monthNames = Array.from({ length: 12 }, (_, index) =>
	new Intl.DateTimeFormat("en", { month: "short" }).format(
		new Date(2000, index, 1),
	),
);

export function MonthPicker({
	value,
	onChange,
	min,
	max,
}: {
	value: string;
	onChange: (month: string) => void;
	min?: string;
	max?: string;
}) {
	const [open, setOpen] = useState(false);
	const [year, setYear] = useState(Number(value.slice(0, 4)));
	const label = new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
	}).format(new Date(`${value}-01T00:00:00`));

	return (
		<Popover
			open={open}
			onOpenChange={(nextOpen) => {
				if (nextOpen) setYear(Number(value.slice(0, 4)));
				setOpen(nextOpen);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className="min-w-0 flex-1 justify-between gap-2 px-3 font-medium"
					aria-label={`Budget month (AD): ${label}`}
				>
					<CalendarDays
						aria-hidden="true"
						className="size-4 shrink-0 text-muted-foreground"
					/>
					<span className="truncate">{label}</span>
					<ChevronDown
						aria-hidden="true"
						className="size-3.5 shrink-0 text-muted-foreground"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="center"
				className="w-72 rounded-xl p-3"
				aria-label="Choose budget month (AD)"
			>
				<div className="mb-3 flex items-center justify-between">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Previous year"
						disabled={!!min && year <= Number(min.slice(0, 4))}
						onClick={() => setYear(year - 1)}
					>
						<ChevronLeft aria-hidden="true" className="size-4" />
					</Button>
					<span
						className="text-sm font-semibold tabular-nums"
						aria-live="polite"
					>
						{year}
					</span>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Next year"
						disabled={!!max && year >= Number(max.slice(0, 4))}
						onClick={() => setYear(year + 1)}
					>
						<ChevronRight aria-hidden="true" className="size-4" />
					</Button>
				</div>
				<div className="grid grid-cols-3 gap-1.5">
					{monthNames.map((name, index) => {
						const month = `${year}-${String(index + 1).padStart(2, "0")}`;
						return (
							<Button
								key={name}
								variant={value === month ? "default" : "ghost"}
								className="h-10"
								aria-label={`${name} ${year}`}
								aria-pressed={value === month}
								disabled={(!!min && month < min) || (!!max && month > max)}
								onClick={() => {
									onChange(month);
									setOpen(false);
								}}
							>
								{name}
							</Button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
