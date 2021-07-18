import { useCallback, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { ExecutorProviderContext } from '../components/ExecutorProvider';
import { useEventListener } from '../../editor/hooks/useEvents';

export function useExecutor() {
	const { ws, sendWS } = useContext(ExecutorProviderContext);
	return { ws, sendWS };
}

export type FunctionExecutorAction = {
	id: string;
	result: unknown;
	data: string;
	eventName: 'function.end' | 'function.output' | 'function.start';
};

export function useFunctionExecutor(listener: (event: FunctionExecutorAction) => void) {
	const { sendWS } = useExecutor();

	const [UUID, setUUID] = useState(v4());
	const [lastEvent, setLastEvent] = useState<FunctionExecutorAction['eventName']>();

	useEventListener<FunctionExecutorAction>(
		UUID,
		(event) => {
			listener(event);
			setLastEvent(event.eventName);
		},
		[listener],
	);

	const runCode = useCallback(
		(code: string) => {
			const newUUID = v4();
			setUUID(newUUID);
			setLastEvent(undefined);
			sendWS({
				type: 'function',
				id: newUUID,
				code,
				callArgs: code.includes('main') ? [] : undefined,
			});
			return code;
		},
		[sendWS],
	);

	return { runCode, lastEvent, UUID };
}
