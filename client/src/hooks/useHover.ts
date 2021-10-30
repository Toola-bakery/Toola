import { EventHandler, MouseEvent, MutableRefObject, useEffect, useRef, useState } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(): { ref: MutableRefObject<T | null>; isHover: boolean } {
	const [value, setValue] = useState<boolean>(false);
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const handleMouseOver: EventHandler<MouseEvent<T>> = (event): void => {
			setValue(true);
		};
		const handleMouseOut: EventHandler<MouseEvent<T>> = (event): void => {
			const isPointOnChild = ref?.current?.contains(event.target as Node);
			setValue(false);
		};
		const node: any = ref.current;
		if (node) {
			node.addEventListener('mouseover', handleMouseOver);
			node.addEventListener('mouseout', handleMouseOut);
			return () => {
				node.removeEventListener('mouseover', handleMouseOver);
				node.removeEventListener('mouseout', handleMouseOut);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);
	return { ref, isHover: value };
}
