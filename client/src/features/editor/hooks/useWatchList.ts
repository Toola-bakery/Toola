import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnMountedEffect } from '../../../hooks/useOnMounted';
import { usePrevious } from '../../../hooks/usePrevious';
import { usePageContext } from './useReferences';

type WatchListObj = { [key: string]: [string, string] };
type List = [string, string][];

const keyFromProps = (p1: string, p2: string) => `["${p1}"]["${p2}"]`;

export function useWatchList({
	initialList,
	onListChanged,
	onUpdate,
}: {
	initialList?: List;
	onListChanged?: (newList: List) => void;
	watchUpdates?: boolean;
	onUpdate?: () => void;
	onLoading?: (isLoading: boolean) => void;
} = {}) {
	const { blocks, pageId } = usePageContext();
	const [watchListObj, setWatchListObj] = useState<WatchListObj>(() => ({}));

	useOnMountedEffect(() => {
		if (initialList) setWatchListObj(initialList.reduce((acc, v) => ({ ...acc, [keyFromProps(v[0], v[1])]: v }), {}));
	});

	const watchList = useMemo(() => Object.values(watchListObj), [watchListObj]);

	const addToWatchList = useCallback(
		(blockId: string, property: string) => {
			const key = keyFromProps(blockId, property);
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

	return { watchList, addToWatchList, isLoading };
}
