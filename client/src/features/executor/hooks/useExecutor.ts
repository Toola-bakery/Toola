import { parse } from 'flatted';
import { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useRefsLatest } from '../../../hooks/useRefLatest';
import { useCurrent } from '../../editor/hooks/useCurrent';
import { useEventListener } from '../../editor/hooks/useEvents';
import { usePageContext } from './useReferences';
import { SateGetEvent } from '../../editor/hooks/useStateToWS';
import { evalGet, useWatchList, WatchList, watchListKeyGetter } from './useWatchList';
import { useWS } from '../../ws/hooks/useWS';

export type FunctionExecutorAction = {
	id: string;
	result: unknown;
	data: string;
	action: 'function.end' | 'function.output' | 'function.start';
};

export type FunctionExecutor = {
	listener?: (event: FunctionExecutorAction) => void;
	watchListProp?: WatchList;
	onTrigger?: () => void | Promise<void>;
	value: string;
	disabled?: boolean;
};

export function useFunctionExecutor({ watchListProp, listener, onTrigger, value, disabled = false }: FunctionExecutor) {
	const { sendWS } = useWS();

	const [UUID, setUUID] = useState(v4());
	const [result, setResult] = useState<unknown>();
	const [logs, setLogs] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [lastEvent, setLastEvent] = useState<FunctionExecutorAction['action']>();

	const { addToWatchList, watchList, setOnUpdate } = useWatchList({
		initialList: watchListProp,
		syncWithBlockProps: true,
	});

	const { globals } = usePageContext();
	const { blocks } = useCurrent();
	useEventListener<FunctionExecutorAction>(
		`ws/${UUID}`,
		(event) => {
			if (event.action === 'function.end') {
				try {
					if (event.result !== 'error') setResult(parse(event.result as string));
				} catch (e) {
					console.error(e);
				}
				setLoading(false);
			} else setLogs((oldLogs) => [...oldLogs, event.data]);

			listener?.(event);
			setLastEvent(event.action);
		},
		[listener],
	);

	const { blocksRef, globalsRef } = useRefsLatest({ blocks, globals });

	const runCode = useCallback(
		(code: string) => {
			if (disabled) return;

			setLoading(true);
			setLogs([]);
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
		[blocksRef, disabled, globalsRef, sendWS, watchList],
	);

	const trigger = useCallback(async () => {
		if (disabled) return;
		await onTrigger?.();
		runCode(value);
	}, [disabled, onTrigger, runCode, value]);

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

	return { runCode, lastEvent, UUID, trigger, loading, result, logs };
}
