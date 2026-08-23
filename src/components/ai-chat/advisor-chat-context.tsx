import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface AdvisorChatContextValue {
	isOpen: boolean;
	isFullscreen: boolean;
	openChat: () => void;
	closeChat: () => void;
	toggleChat: () => void;
	toggleFullscreen: () => void;
}

const AdvisorChatContext = createContext<AdvisorChatContextValue | undefined>(
	undefined,
);

export function AdvisorChatProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const openChat = useCallback(() => setIsOpen(true), []);
	const closeChat = useCallback(() => {
		setIsOpen(false);
		setIsFullscreen(false);
	}, []);
	const toggleChat = useCallback(() => setIsOpen((open) => !open), []);
	const toggleFullscreen = useCallback(
		() => setIsFullscreen((full) => !full),
		[],
	);

	// Escape closes fullscreen first, then the panel.
	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			if (isFullscreen) setIsFullscreen(false);
			else setIsOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, isFullscreen]);

	const value = useMemo(
		() => ({
			isOpen,
			isFullscreen,
			openChat,
			closeChat,
			toggleChat,
			toggleFullscreen,
		}),
		[isOpen, isFullscreen, openChat, closeChat, toggleChat, toggleFullscreen],
	);

	return (
		<AdvisorChatContext.Provider value={value}>
			{children}
		</AdvisorChatContext.Provider>
	);
}

export function useAdvisorChat(): AdvisorChatContextValue {
	const context = useContext(AdvisorChatContext);
	if (!context) {
		throw new Error("useAdvisorChat must be used within AdvisorChatProvider");
	}
	return context;
}
