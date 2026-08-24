import { useQuery } from "@tanstack/react-query";
import { Check, Copy, ExternalLink, Plug } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rpc, unwrap } from "@/lib/api-client";

export function McpSection() {
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const { data: mcpTokenData, isLoading: isMcpLoading } = useQuery({
		queryKey: ["integrations", "mcp-token"],
		queryFn: async () => {
			const res = await rpc.api.integrations.mcp.token.$get();
			return unwrap<{ token: string; url: string }>(res);
		},
	});

	const copyValue = (key: string, value: string) => {
		void navigator.clipboard.writeText(value);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 1500);
	};

	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const serverUrl = `${origin}/api/mcp`;

	return (
		<Card className="border-dashed">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Plug className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Connect AI assistants (MCP)</CardTitle>
							<CardDescription>
								Let Claude Desktop, Cursor, or any MCP client read your finances
								through the same tools the advisor uses.
							</CardDescription>
						</div>
					</div>
					<Badge variant="outline">Advanced</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="mcp-url">Server URL</Label>
					<div className="flex gap-2">
						<Input
							id="mcp-url"
							readOnly
							value={serverUrl}
							className="font-mono text-xs"
						/>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 shrink-0"
							aria-label="Copy server URL"
							onClick={() => copyValue("url", serverUrl)}
						>
							{copiedKey === "url" ? (
								<Check className="h-4 w-4 text-ds-green-700" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="mcp-token">Personal access token</Label>
					<div className="flex gap-2">
						<Input
							id="mcp-token"
							readOnly
							value={mcpTokenData?.token ?? ""}
							placeholder={isMcpLoading ? "Loading…" : ""}
							className="font-mono text-xs"
						/>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 shrink-0"
							disabled={!mcpTokenData?.token}
							aria-label="Copy access token"
							onClick={() => copyValue("token", mcpTokenData?.token ?? "")}
						>
							{copiedKey === "token" ? (
								<Check className="h-4 w-4 text-ds-green-700" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
					<p className="text-xs text-muted-foreground">
						Treat it like a password — it grants read access to your
						transactions. Rotating MCP_TOKEN_SECRET revokes all tokens.
					</p>
				</div>

				<div className="space-y-1.5">
					<Label>Example client configuration</Label>
					<pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
						{JSON.stringify(
							{
								mcpServers: {
									autofin: {
										type: "http",
										url: serverUrl,
										headers: {
											Authorization: `Bearer ${mcpTokenData?.token ?? "<your-token>"}`,
										},
									},
								},
							},
							null,
							2,
						)}
					</pre>
					<a
						href="https://modelcontextprotocol.io/clients"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
					>
						Compatible MCP clients <ExternalLink className="h-3 w-3" />
					</a>
				</div>
			</CardContent>
		</Card>
	);
}
