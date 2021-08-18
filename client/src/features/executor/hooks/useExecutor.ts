import { useCallback, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { useRefLatest } from '../../../hooks/useRefLatest';
import { useAppSelector } from '../../../redux/hooks';
import { useBlocks } from '../../editor/hooks/useBlocks';
import { useEventListener } from '../../editor/hooks/useEvents';
import { usePageContext } from '../../editor/hooks/useReferences';
import { useWatchList, watchListKeyGetter, WatchListProps } from '../../editor/hooks/useWatchList';
import { selectBlocksState } from '../../editor/redux/editor';
import { useWS } from '../../ws/hooks/useWS';

export type FunctionExecutorAction = {
	id: string;
	result: unknown;
	data: string;
	eventName: 'function.end' | 'function.output' | 'function.start';
};

export function useFunctionExecutor(listener: (event: FunctionExecutorAction) => void) {
	const { sendWS } = useWS();

	const [UUID, setUUID] = useState(v4());
	const [lastEvent, setLastEvent] = useState<FunctionExecutorAction['eventName']>();

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
		(code: string, watchList?: [string, string][]) => {
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
		[blocksRef, sendWS],
	);

	return { runCode, lastEvent, UUID };
}
