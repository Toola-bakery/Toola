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
		updateCaret();
	});

	return { start, end, ref: node, updateCaret };
}
