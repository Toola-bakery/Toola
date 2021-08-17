import React, { useCallback, useState } from 'react';
import { TableBlockProps } from '../components/Blocks/TableBlock/TableBlock';
import { MenuItemProps } from '../components/Inspector/BlockInspector';
import { useBlock } from './useBlock';
import { useEditor } from './useEditor';
import { usePageContext } from './useReferences';

export function useBlockInspectorState(
	menuConfig: ((defaultMenu: MenuItemProps[]) => MenuItemProps[]) | MenuItemProps[],
) {
	const {
		page: { editing },
	} = usePageContext();

	const { id, display } = useBlock();
	const { deleteBlock, immerBlockProps } = useEditor();

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

	const defaultMenu: MenuItemProps[] = [
		{
			type: 'nested',
			label: 'Display',
			next: [
				{
					label: 'Hide',
					type: 'switch',
					value: Boolean(display?.hide),
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							if (!draft.display) draft.display = {};
							draft.display.hide = v;
						}),
				},
			],
		},
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

	return { onContextMenu, inspectorProps: { menu, close, open, isOpen, path, setPath } };
}
