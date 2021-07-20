import { DependencyList, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { usePromise } from '../../../hooks/usePromise';
import { BlockInspectorProps } from '../components/Inspector/BlockInspector';

export function useBlockInspectorState(menuConfig: BlockInspectorProps['menu'], deps: DependencyList) {
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
			open(e.pageX, e.pageY - window.scrollY);
			e.preventDefault();
		},
		[open],
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const menu = useMemo<BlockInspectorProps['menu']>(() => menuConfig, deps);

	return { menu, onContextMenu, close, open, isOpen };
}
