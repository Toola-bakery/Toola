import React, { useCallback, useRef, useState } from 'react';
import { useRefLatest } from '../../../hooks/useRefLatest';
import { MenuItemProps } from '../components/InspectorItem';

type UseInspectorStateOptions = {
	disabled?: boolean;
	menu: (() => MenuItemProps[]) | MenuItemProps[];
};

export function useInspectorState({ disabled = false, menu }: UseInspectorStateOptions) {
	const [path, setPath] = useState<string[]>([]);
	const [isOpen, setOpen] = useState<[number, number] | false>(false);
	const isOpenRef = useRefLatest(isOpen);

	const open = useCallback(
		(x: number, y: number, _path: string[] = []) => {
			if (disabled) return;
			setPath(_path);
			setOpen([x, y]);
		},
		[disabled],
	);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const onContextMenu = useCallback(
		(e: React.MouseEvent, _path: string[] = []) => {
			if (disabled) return;
			if (isOpenRef.current) return;
			open(e.pageX - window.scrollX, e.pageY - window.scrollY, _path);
			e.preventDefault();
			e.stopPropagation();
		},
		[disabled, isOpenRef, open],
	);

	return {
		onContextMenu,
		inspectorProps: { menu: typeof menu === 'function' ? menu() : menu, close, open, isOpen, path, setPath },
	};
}
