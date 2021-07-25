import { DependencyList, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { usePromise } from '../../../hooks/usePromise';
import { BlockInspectorProps, MenuItemProps } from '../components/Inspector/BlockInspector';
import { Blocks } from '../types/blocks';
import { useEditor } from './useEditor';

export function useBlockInspectorState<Block extends Blocks>(
	id: string,
	menuConfig: BlockInspectorProps<Block>['menu'],
	deps: DependencyList,
) {
	const [isOpen, setOpen] = useState<[number, number] | false>(false);
	const { cleanPromise, resolve } = usePromise();

	const open = useCallback(
		(x: number, y: number) => {
			setOpen([x, y]);
			return cleanPromise();
		},
		[cleanPromise],
	);

	const close = useCallback(
		(result) => {
			resolve(result);
			setOpen(false);
		},
		[resolve],
	);

	const onContextMenu = useCallback<MouseEventHandler<HTMLDivElement>>(
		(e) => {
			open(e.pageX - window.scrollX, e.pageY - window.scrollY);
			e.preventDefault();
		},
		[open],
	);

	const { deleteBlock } = useEditor();

	const menu = useMemo<BlockInspectorProps['menu']>(
		() => [
			...(menuConfig as unknown as MenuItemProps[]),
			{
				key: 'Delete',
				call: () => deleteBlock(id),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[...deps, deleteBlock, id],
	);

	return { menu, onContextMenu, close, open, isOpen };
}
