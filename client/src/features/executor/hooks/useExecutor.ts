import { useCallback, useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useRefLatest, useRefsLatest } from '../../../hooks/useRefLatest';
import { useAppSelector } from '../../../redux/hooks';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlocks } from '../../editor/hooks/useBlocks';
import { useEventListener } from '../../editor/hooks/useEvents';
import { usePageContext } from './useReferences';
import { SateGetEvent } from '../../editor/hooks/useStateToWS';
import { evalGet, useWatchList, WatchList, watchListKeyGetter, WatchListProps } from './useWatchList';
import { selectBlocksState } from '../../editor/redux/editor';
import { useWS } from '../../ws/hooks/useWS';

export type FunctionExecutorAction = {
	id: string;
	result: unknown;
	data: string;
	action: 'function.end' | 'function.output' | 'function.start';
};

export type FunctionExecutor = {
	listener: (event: FunctionExecutorAction) => void;
	watchListProp?: WatchList;
	onTrigger?: () => void | Promise<void>;
	value: string;
};

export function useFunctionExecutor({ watchListProp, listener, onTrigger, value }: FunctionExecutor) {
	const { sendWS } = useWS();

	const [UUID, setUUID] = useState(v4());
	const [lastEvent, setLastEvent] = useState<FunctionExecutorAction['action']>();

	const { addToWatchList, watchList, setOnUpdate } = useWatchList({
		initialList: watchListProp,
		syncWithBlockProps: true,
	});

	const { blocks, globals } = usePageContext();

	useEventListener<FunctionExecutorAction>(
		`ws/${UUID}`,
		(event) => {
			listener(event);
			setLastEvent(event.action);
		},
		[listener],
	);

	const { blocksRef, globalsRef } = useRefsLatest({ blocks, globals });

	const runCode = useCallback(
		(code: string) => {
			const preloadState = watchList?.reduce<{ [key: string]: unknown }>((state, keys) => {
				const topLevel = { globals: globalsRef.current, blocks: blocksRef.current };
				state[watchListKeyGetter(keys)] = evalGet(topLevel, keys);
				return state;
			}, {});

			const newUUID = v4();
			setUUID(newUUID);
			setLastEvent(undefined);
			sendWS({
				action: 'functions.run',
				reqId: newUUID,
				code,
				callArgs: code.includes('main') ? [] : undefined,
				preloadState,
			});
			return newUUID;
		},
		[blocksRef, globalsRef, sendWS, watchList],
	);

	const trigger = useCallback(async () => {
		await onTrigger?.();
		runCode(value);
	}, [onTrigger, runCode, value]);

	useEventListener<SateGetEvent>(
		`ws/page.getState`,
		(event) => {
			const { keys, reqId } = event;
			if (UUID === reqId) addToWatchList(keys);
		},
		[UUID],
	);

	useEffect(() => {
		setOnUpdate(() => trigger);
	}, [setOnUpdate, trigger]);

	return { runCode, lastEvent, UUID, trigger };
}
