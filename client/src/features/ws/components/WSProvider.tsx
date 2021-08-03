import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useEvents } from '../../editor/hooks/useEvents';
import { Config } from '../../../config';

export type WSProviderContextType = {
	ws?: WebSocket;
	sendWS: (data: unknown) => void;
};

export const WSProviderContext = React.createContext<WSProviderContextType>({
	sendWS: () => {},
});

export function WSProvider({ children }: React.PropsWithChildren<{ a?: false }>): JSX.Element {
	const [ws] = useState(() => new WebSocket(Config.websocket));
	const { send } = useEvents();

	useEffect(() => {
		ws.onmessage = (event) => {
			const jsonEvent = JSON.parse(event.data);
			if (jsonEvent.id) send(`ws/${jsonEvent.id}`, jsonEvent);
			if (jsonEvent.action) send(`ws/${jsonEvent.action}`, jsonEvent);
		};
	}, [send, ws]);

	const sendWS = useCallback((data: unknown) => ws.send(JSON.stringify(data)), [ws]);

	const value = useMemo<WSProviderContextType>(() => ({ ws, sendWS }), [ws, sendWS]);

	return (
		<WSProviderContext.Provider value={value}>
			<>{children}</>
		</WSProviderContext.Provider>
	);
}
