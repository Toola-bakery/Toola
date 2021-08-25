import { useCallback, useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useRefLatest } from '../../../hooks/useRefLatest';
import { useAppSelector } from '../../../redux/hooks';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlocks } from '../../editor/hooks/useBlocks';
import { useEventListener } from '../../editor/hooks/useEvents';
import { usePageContext } from './useReferences';
import { SateGetEvent } from '../../editor/hooks/useStateToWS';
import { useWatchList, WatchList, watchListKeyGetter, WatchListProps } from './useWatchList';
import { selectBlocksState } from '../../editor/redux/editor';
import { useWS } from '../../ws/hooks/useWS';

export type FunctionExecutorAction = {
	id: string;
	result: unknown;
	data: string;
	eventName: 'function.end' | 'function.output' | 'function.start';
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
	const [lastEvent, setLastEvent] = useState<FunctionExecutorAction['eventName']>();

	const { addToWatchList, watchList, setOnUpdate } = useWatchList({
		initialList: watchListProp,
		syncWithBlockProps: true,
	});

	const { blocks } = usePageContext();

	useEventListener<FunctionExecutorAction>(
		`ws/${UUID}`,
		(event) => {
			listener(event);
			setLastEvent(event.eventName);
		},
		[listener],
	);

	const blocksRef = useRefLatest(blocks);

	const runCode = useCallback(
		(code: string) => {
			const preloadState = watchList?.reduce<{ [key: string]: unknown }>((state, item) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				state[watchListKeyGetter(item[0], item[1])] = blocksRef.current?.[item[0]]?.[item[1]];
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
		[blocksRef, sendWS, watchList],
	);

	const trigger = useCallback(async () => {
		await onTrigger?.();
		runCode(value);
	}, [onTrigger, runCode, value]);

	useEventListener<SateGetEvent>(
		`ws/page.getState`,
		(event) => {
			const { blockId, reqId, property } = event;
			if (UUID === reqId) addToWatchList(blockId, property);
		},
		[UUID],
	);

	useEffect(() => {
		setOnUpdate(() => trigger);
	}, [setOnUpdate, trigger]);

	return { runCode, lastEvent, UUID, trigger };
}
