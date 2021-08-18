export function getCaretIndex(element: HTMLElement) {
	let position = 0;
	const isSupported = typeof window.getSelection !== 'undefined';
	if (isSupported) {
		const selection = window.getSelection();
		if (selection && selection?.rangeCount !== 0) {
			const range = selection.getRangeAt(0);
			if (range) {
				const preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				position = preCaretRange.toString().length;
			}
		}
	}
	return position;
}

export function getCaretGlobalPosition() {
	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return null;
	const r = selection.getRangeAt(0);
	const node = r.startContainer;
	const offset = r.startOffset;
	const pageOffset = { x: window.pageXOffset, y: window.pageYOffset };

	if (offset > 0) {
		const r2 = document.createRange();
		r2.setStart(node, offset - 1);
		r2.setEnd(node, offset);
		const rect = r2.getBoundingClientRect();
		return { left: rect.right + pageOffset.x, top: rect.bottom + pageOffset.y };
	}

	const rect = (selection.anchorNode as Element).getBoundingClientRect?.();
	return { left: rect.left, top: rect.bottom };
}