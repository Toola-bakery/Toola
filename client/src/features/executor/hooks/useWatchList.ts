import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnMountedEffect } from '../../../hooks/useOnMounted';
import { usePrevious } from '../../../hooks/usePrevious';
import { useBlock } from '../../editor/hooks/useBlock';
import { useEditor } from '../../editor/hooks/useEditor';
import { usePageContext } from './useReferences';

export type WatchListObj = { [key: string]: string[] };
export type WatchList = string[][];

export const populateKeys = (keys: string[]) =>
	keys[0] === 'globals' || keys[0] === 'blocks' ? keys : ['blocks', ...keys];

export const watchListKeyGetter = (keys: string[]) => keys.map((p1) => `["${p1}"]`).join('');

export type WatchListProps = {
	initialList?: WatchList;
	onListChanged?: (newList: WatchList) => void;
	watchUpdates?: boolean;
	onUpdate?: () => void;
	onLoading?: (isLoading: boolean) => void;
	syncWithBlockProps?: boolean;
};

export function evalGet(anyTopLevel: { globals: any; blocks: any }, keys: string[]) {
	return populateKeys(keys).reduce<any>((acc, key) => {
		if (typeof acc === 'object' && key in acc) return acc[key];
		return undefined;
	}, anyTopLevel);
}

export function useWatchList({
	initialList,
	onListChanged,
	onUpdate: onUpdateInitial,
	syncWithBlockProps,
}: WatchListProps = {}) {
	const { blocks, pageId, globals } = usePageContext();
	const [watchListObj, setWatchListObj] = useState<WatchListObj>(() => ({}));
	const [onUpdate, setOnUpdate] = useState<(() => void) | undefined>(onUpdateInitial);
	useOnMountedEffect(() => {
		if (initialList)
			setWatchListObj(initialList.reduce((acc, v) => ({ ...acc, [watchListKeyGetter([v[0], v[1]])]: v }), {}));
	});

	const watchList = useMemo(() => Object.values(watchListObj), [watchListObj]);

	const block = useBlock(true);
	const id = block?.id;

	const { updateBlockProps } = useEditor();

	useEffect(() => {
		if (syncWithBlockProps && id) updateBlockProps({ id, watchList });
	}, [id, syncWithBlockProps, updateBlockProps, watchList]);

	const addToWatchList = useCallback(
		(_keys: string[]) => {
			const keys = populateKeys(_keys);
			const key = watchListKeyGetter(keys);
			if (!(key in watchListObj))
				setWatchListObj((wl) => {
					if (!(key in wl)) {
						const newObj = { ...wl, [key]: keys };
						onListChanged?.(Object.values(newObj));
						return newObj;
					}
					return wl;
				});
		},
		[onListChanged, watchListObj],
	);

	const topLevel = useMemo(() => ({ blocks, globals, pageId }), [blocks, globals, pageId]);
	const previousTopLevel = usePrevious(topLevel);

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (
			!previousTopLevel ||
			!previousTopLevel.blocks ||
			previousTopLevel.pageId !== pageId ||
			(previousTopLevel.blocks === blocks && previousTopLevel.globals === globals)
		)
			return;
		let isUpdated = false;
		let newIsLoading = false;

		watchList.forEach((_keys) => {
			const keys = populateKeys(_keys);

			const newValue = evalGet(topLevel, keys);
			const oldValue = evalGet(previousTopLevel, keys);

			isUpdated = isUpdated || newValue !== oldValue;

			newIsLoading = newIsLoading || (keys[0] === 'blocks' && (blocks[keys[1]] as any)?.loading);
		}, false);

		setLoading(newIsLoading);
		if (isUpdated) onUpdate?.();
	}, [blocks, globals, onUpdate, pageId, previousTopLevel, topLevel, watchList]);

	return { watchList, addToWatchList, isLoading, setOnUpdate };
}
