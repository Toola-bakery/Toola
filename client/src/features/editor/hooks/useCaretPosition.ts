import { useCallback, useEffect, useRef, useState } from 'react';

export function useCaretPosition<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>() {
	const node = useRef<T>(null);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(0);

	const updateCaret = useCallback(() => {
		// Get the updated caret postions from the ref passed in
		if (node && node.current) {
			const { selectionStart, selectionEnd } = node.current;

			if (selectionStart !== null) setStart(selectionStart);
			if (selectionEnd !== null) setEnd(selectionEnd);
		}
	}, []);

	useEffect(() => {
		// Set the caret position by setting the selection range with the
		// most current start and end values
		if (node && node.current) {
			node.current.setSelectionRange(start, end);
		}
	});

	return { start, end, ref: node, updateCaret };
}
