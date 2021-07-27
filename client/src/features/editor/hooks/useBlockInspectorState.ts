import React, { MouseEventHandler, useCallback, useState } from 'react';
import { BlockInspectorProps, MenuItemProps } from '../components/Inspector/BlockInspector';
import { useEditor } from './useEditor';

export function useBlockInspectorState(id: string, menuConfig: BlockInspectorProps['menu']) {
	const [path, setPath] = useState<string[]>([]);
	const [isOpen, setOpen] = useState<[number, number] | false>(false);

	const open = useCallback((x: number, y: number) => {
		setOpen([x, y]);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const onContextMenu = useCallback(
		(e: React.MouseEvent, _path: string[] = []) => {
			setPath(_path);
			open(e.pageX - window.scrollX, e.pageY - window.scrollY);
			e.preventDefault();
		},
		[open],
	);

	const { deleteBlock } = useEditor();

	const menu = [
		...menuConfig,
		{
			type: 'item',
			key: 'Delete',
			call: () => deleteBlock(id),
		},
	] as unknown as MenuItemProps[];

	return { onContextMenu, inspectorProps: { menu, close, open, isOpen, path } };
}
