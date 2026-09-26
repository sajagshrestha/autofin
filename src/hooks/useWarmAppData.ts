import { useQueryClient } from "@tanstack/react-query";
import { endOfYear, startOfYear } from "date-fns";
import { useEffect } from "react";
import { getDateRangeForPeriod } from "@/components/ui/date-filter";
import { useApiClient } from "@/lib/api-context";
import { categoriesQueryOptions } from "./categories/queries";
import { loansQueryOptions } from "./loans/queries";
import {
	allTransactionsQueryOptions,
	transactionHistoryQueryOptions,
} from "./transactions/queries";

/** Warm the primary tabs after the shell mounts, without blocking navigation. */
export function useWarmAppData() {
	const client = useQueryClient();
	const rpc = useApiClient();
	useEffect(() => {
		void client.prefetchQuery(
			transactionHistoryQueryOptions(rpc, getDateRangeForPeriod("last7d")),
		);
		void client.prefetchQuery(
			allTransactionsQueryOptions(rpc, getDateRangeForPeriod("monthly")),
		);
		void client.prefetchQuery(
			allTransactionsQueryOptions(rpc, {
				startDate: startOfYear(new Date()).toISOString(),
				endDate: endOfYear(new Date()).toISOString(),
			}),
		);
		void client.prefetchQuery(loansQueryOptions(rpc));
		void client.prefetchQuery(categoriesQueryOptions(rpc));
	}, [client, rpc]);
}
