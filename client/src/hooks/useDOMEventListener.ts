import { RefObject, useEffect, useRef } from 'react';

export function useDOMEventListener<T extends HTMLElement = HTMLDivElement>(
	eventName: keyof WindowEventMap,
	handler: (event: Event) => void,
	element?: RefObject<T>,
) {
	// Create a ref that stores handler
	const savedHandler = useRef<(event: Event) => void>();

	useEffect(() => {
		// Define the listening target
		const targetElement: T | Window = element?.current || window;
		if (!(targetElement && targetElement.addEventListener)) {
			return;
		}

		// Update saved handler if necessary
		if (savedHandler.current !== handler) {
			savedHandler.current = handler;
		}

		// Create event listener that calls handler function stored in ref
		const eventListener = (event: Event) => {
			// eslint-disable-next-line no-extra-boolean-cast
			if (!!savedHandler?.current) {
				savedHandler.current(event);
			}
		};

		targetElement.addEventListener(eventName, eventListener);

		// Remove event listener on cleanup
		return () => {
			targetElement.removeEventListener(eventName, eventListener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventName, element, handler]);
}
