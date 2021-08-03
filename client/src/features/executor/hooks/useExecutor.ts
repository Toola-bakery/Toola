import { useCallback, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { useEventListener } from '../../editor/hooks/useEvents';
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

	useEventListener<FunctionExecutorAction>(
		`ws/${UUID}`,
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
				action: 'functions.run',
				reqId: newUUID,
				code,
				callArgs: code.includes('main') ? [] : undefined,
			});
			return code;
		},
		[sendWS],
	);

	return { runCode, lastEvent, UUID };
}
