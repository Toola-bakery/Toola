import React, { useEffect } from 'react';
import { useBlockContext } from '../useBlockContext';
import { useInspectorState } from '../../../inspector/hooks/useInspectorState';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { usePageContext } from '../../../executor/hooks/useReferences';

export type InspectorPropsType = {
	menu: MenuItemProps[];
	close: () => void;
	open: (x: number, y: number, _path?: string[]) => void;
	isOpen: false | [number, number];
	path: string[];
	setPath: React.Dispatch<React.SetStateAction<string[]>>;
};

export function useBlockInspectorState() {
	const { editing } = usePageContext();
	const { menu } = useBlockContext();
	const { setOnDragClick } = useBlockContext();

	const { onContextMenu, inspectorProps } = useInspectorState({
		disabled: !editing,
		menu: [],
	});

	useEffect(() => {
		setOnDragClick(onContextMenu);
	}, [onContextMenu, setOnDragClick]);

	return { onContextMenu, inspectorProps: { ...inspectorProps, menu } };
}
