import React, { useCallback, useState } from 'react';
import { MenuItemProps } from '../components/Inspector/BlockInspector';
import { useEditor } from './useEditor';
import { usePageContext } from './useReferences';

export function useBlockInspectorState(
	id: string,
	menuConfig: ((defaultMenu: MenuItemProps[]) => MenuItemProps[]) | MenuItemProps[],
) {
	const {
		page: { editing },
	} = usePageContext();

	const [path, setPath] = useState<string[]>([]);
	const [isOpen, setOpen] = useState<[number, number] | false>(false);

	const open = useCallback(
		(x: number, y: number) => {
			if (!editing) return;
			setOpen([x, y]);
		},
		[editing],
	);

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
	const defaultMenu: MenuItemProps[] = [
		{
			type: 'item',
			label: 'Delete',
			closeAfterCall: true,
			call: () => deleteBlock(id),
		},
	];

	const menu: MenuItemProps[] = [
		...(typeof menuConfig === 'function' ? menuConfig(defaultMenu) : menuConfig),
		...(typeof menuConfig === 'function' ? [] : defaultMenu),
	];

	return { onContextMenu, inspectorProps: { menu, close, open, isOpen, path } };
}
