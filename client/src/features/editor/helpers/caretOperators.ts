export function getRange() {
	const isSupported = typeof window.getSelection !== 'undefined';
	if (isSupported) {
		const selection = window.getSelection();
		if (selection && selection?.rangeCount !== 0) {
			return selection.getRangeAt(0);
		}
	}
}

export function getSelection(element: HTMLElement): [number, number] {
	const range = getRange();
	if (range) {
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		const endPosition = preCaretRange.toString().length;

		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.startContainer, range.startOffset);
		const startPosition = preCaretRange.toString().length;

		return [startPosition, endPosition];
	}

	return [0, 0];
}

export function getCaretIndex(element: HTMLElement) {
	let position = 0;
	const range = getRange();
	if (range) {
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		position = preCaretRange.toString().length;
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

function findNodeAtPositionRecursive(
	element: Node,
	position: number,
	current = 0,
): { container: Node; offset: number } | number {
	const nodes = element.childNodes.values();
	return Array.from(nodes).reduce((acc: { container: Node; offset: number } | number, node) => {
		if (typeof acc !== 'number') return acc;
		if (node.nodeName === '#text') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const len = node.length;
			if (acc + len >= position) return { container: node, offset: position - acc };
			return acc + len;
		}
		return findNodeAtPositionRecursive(node, position, acc);
	}, current);
}

export function findNodeAtPosition(
	element: Node,
	position: number,
	current = 0,
): { container: Node; offset: number } | undefined {
	const result = findNodeAtPositionRecursive(element, position, current);
	if (typeof result !== 'number') return result;
}

export function setCaretPosition(el: Node, start: number, end = start) {
	const range = document.createRange();
	const startContainerAndOffset = findNodeAtPosition(el, start);
	const encContainerAndOffset = end === start ? startContainerAndOffset : findNodeAtPosition(el, end);
	if (!startContainerAndOffset || !encContainerAndOffset) return;
	const sel = window.getSelection();
	range.setStart(startContainerAndOffset.container, startContainerAndOffset.offset);
	range.setEnd(encContainerAndOffset.container, encContainerAndOffset.offset);
	sel?.removeAllRanges();
	sel?.addRange(range);
}
