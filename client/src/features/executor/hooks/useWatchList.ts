import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnMountedEffect } from '../../../hooks/useOnMounted';
import { usePrevious } from '../../../hooks/usePrevious';
import { useBlock } from '../../editor/hooks/useBlock';
import { useEditor } from '../../editor/hooks/useEditor';
import { usePageContext } from './useReferences';

export type WatchListObj = { [key: string]: [string, string] };
export type WatchList = [string, string][];

export const watchListKeyGetter = (p1: string, p2: string) => `["${p1}"]["${p2}"]`;

export type WatchListProps = {
	initialList?: WatchList;
	onListChanged?: (newList: WatchList) => void;
	watchUpdates?: boolean;
	onUpdate?: () => void;
	onLoading?: (isLoading: boolean) => void;
	syncWithBlockProps?: boolean;
};

export function useWatchList({
	initialList,
	onListChanged,
	onUpdate: onUpdateInitial,
	syncWithBlockProps,
}: WatchListProps = {}) {
	const { blocks, pageId } = usePageContext();
	const [watchListObj, setWatchListObj] = useState<WatchListObj>(() => ({}));
	const [onUpdate, setOnUpdate] = useState<(() => void) | undefined>(onUpdateInitial);
	useOnMountedEffect(() => {
		if (initialList)
			setWatchListObj(initialList.reduce((acc, v) => ({ ...acc, [watchListKeyGetter(v[0], v[1])]: v }), {}));
	});

	const watchList = useMemo(() => Object.values(watchListObj), [watchListObj]);

	const block = useBlock(true);
	const id = block?.id;

	const { updateBlockProps } = useEditor();

	useEffect(() => {
		if (syncWithBlockProps && id) updateBlockProps({ id, watchList });
	}, [id, syncWithBlockProps, updateBlockProps, watchList]);

	const addToWatchList = useCallback(
		(blockId: string, property: string) => {
			const key = watchListKeyGetter(blockId, property);
			setWatchListObj((wl) => {
				const newObj = { ...wl, [key]: [blockId, property] as [string, string] };
				if (!(key in wl)) onListChanged?.(Object.values(newObj));
				return newObj;
			});
		},
		[onListChanged],
	);

	const previousBlocks = usePrevious(blocks);
	const previousPageId = usePrevious(pageId);

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (previousPageId !== pageId || !previousBlocks || previousBlocks === blocks) return;
		let isUpdated = false;
		let newIsLoading = false;

		watchList.forEach(([blockId, property]) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const newValue = blocks?.[blockId]?.[property];
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const oldValue = previousBlocks?.[blockId]?.[property];

			isUpdated = isUpdated || newValue !== oldValue;

			newIsLoading = (blocks[blockId] as any)?.loading || newIsLoading;
		}, false);

		setLoading(newIsLoading);
		if (isUpdated) onUpdate?.();
	}, [blocks, onUpdate, pageId, previousBlocks, previousPageId, watchList]);

	return { watchList, addToWatchList, isLoading, setOnUpdate };
}
