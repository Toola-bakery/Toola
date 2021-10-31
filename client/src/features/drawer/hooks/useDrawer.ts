import { useCallback, useEffect, useRef } from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useImmerState, useSessionImmerState } from '../../../redux/hooks';

const MIN_DRAWER_SIZE = 150;
const MAX_DRAWER_SIZE = 300;

export function useDrawer({
	name,
	defaultSize = 240,
	maxSize = MAX_DRAWER_SIZE,
	minSize = MIN_DRAWER_SIZE,
}: {
	name: string;
	defaultSize?: number;
	minSize?: number;
	maxSize?: number;
}) {
	const [data = {}, immer] = useImmerState<{
		size?: number;
		show?: boolean;
	}>(`drawer:${name}`);

	const [{ isOpen } = { isOpen: false }, sessionImmer] = useSessionImmerState<{
		isOpen?: boolean;
	}>(`drawer:${name}`);

	const { show = true, size = defaultSize } = data;

	const setSize = useCallback(
		(newWidth: number) =>
			immer((draft) => {
				draft.size = Math.min(Math.max(newWidth, minSize), maxSize);
			}),
		[immer, maxSize, minSize],
	);
	const setOpen = useCallback(
		(nextIsOpen: boolean) =>
			sessionImmer((draft) => {
				draft.isOpen = nextIsOpen;
			}),
		[sessionImmer],
	);

	return { show, setOpen, isOpen, size, setSize };
}

export function useDrawerResizable({
	axis = 'x',
	reverse = false,
	setSize,
}: {
	axis?: 'x' | 'y';
	reverse?: boolean;
	setSize: (newWidth: number) => void;
}) {
	const { height, width } = useWindowSize({ height: 1000, width: 1000 });

	const isMovingRef = useRef(false);
	const resizableRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleCursor(event: MouseEvent) {
			if (!isMovingRef.current) return;
			resizableRef.current?.classList.add('move');
			const position = axis === 'x' ? event.pageX + 1 : event.pageY + 1;
			const windowSize = axis === 'x' ? width : height;
			setSize(reverse ? windowSize - position : position);
			event.preventDefault();
		}
		function handleMouseUp() {
			resizableRef.current?.classList.remove('move');
			isMovingRef.current = false;
		}

		document.addEventListener('mousemove', handleCursor);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleCursor);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	return { isMovingRef, resizableRef };
}
