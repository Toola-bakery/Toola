import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useEvents } from '../../editor/hooks/useEvents';

export type ExecutorProviderContextType = {
	ws?: WebSocket;
	sendWS: (data: unknown) => void;
};

export const ExecutorProviderContext = React.createContext<ExecutorProviderContextType>({
	sendWS: () => {},
});

export function ExecutorProvider({ children }: React.PropsWithChildren<{ a?: false }>): JSX.Element {
	const [ws] = useState(() => new WebSocket('ws://localhost:8080'));
	const { send } = useEvents();

	useEffect(() => {
		ws.onmessage = (event) => {
			const jsonEvent = JSON.parse(event.data);
			send(jsonEvent.id || 'ws', { eventName: jsonEvent.type, ...jsonEvent });
		};
	}, [send, ws]);

	const sendWS = useCallback((data: unknown) => ws.send(JSON.stringify(data)), [ws]);

	const value = useMemo<ExecutorProviderContextType>(() => ({ ws, sendWS }), [ws, sendWS]);

	return (
		<ExecutorProviderContext.Provider value={value}>
			<>{children}</>
		</ExecutorProviderContext.Provider>
	);
}
