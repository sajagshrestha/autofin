import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
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
	const pushedRef = useRef(false);

	const openChat = useCallback(() => {
		// Push a history entry so the browser back button (mobile) closes the
		// chat instead of navigating away.
		if (!pushedRef.current) {
			window.history.pushState({ advisorChat: true }, "");
			pushedRef.current = true;
		}
		setIsOpen(true);
	}, []);

	const closeChat = useCallback(() => {
		setIsOpen(false);
		setIsFullscreen(false);
		// Undo the pushed history entry so back doesn't land on a dead state.
		if (pushedRef.current) {
			pushedRef.current = false;
			window.history.back();
		}
	}, []);
	const toggleChat = useCallback(() => setIsOpen((open) => !open), []);
	const toggleFullscreen = useCallback(
		() => setIsFullscreen((full) => !full),
		[],
	);

	// Back button closes the chat when it's open (mobile).
	useEffect(() => {
		const onPopState = () => {
			if (isOpen) {
				pushedRef.current = false;
				setIsOpen(false);
				setIsFullscreen(false);
			}
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [isOpen]);

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
