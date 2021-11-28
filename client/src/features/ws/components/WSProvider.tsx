import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useWindowFocus } from '../../../hooks/useWindowFocus';
import { useEventListener, useEvents } from '../../editor/hooks/useEvents';
import { Config } from '../../../Config';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { useUser } from '../../usersAndProjects/hooks/useUser';

export type WSProviderContextType = {
	ws?: WebSocket;
	sendWS: (data: unknown) => void;
};

export const WSProviderContext = React.createContext<WSProviderContextType>({
	sendWS: () => {},
});

const resolve = { current: () => {} };
const isResolved = { current: false };

const getNewPromise = () => {
	const promise = new Promise<void>((_resolve) => {
		resolve.current = _resolve;
		isResolved.current = false;
	});
	promise.then(() => {
		isResolved.current = true;
	});

	return promise;
};

const isWsReadyPromise = { current: getNewPromise() };

export function WSProvider({ children }: React.PropsWithChildren<{ a?: false }>): JSX.Element {
	const { send } = useEvents();
	const { authToken } = useUser();
	const { currentProjectId } = useProjects();

	const [ws, setWs] = useState(
		() =>
			new ReconnectingWebSocket(Config.websocket, [], {
				maxReconnectionDelay: 6000,
				minReconnectionDelay: 1000,
				reconnectionDelayGrowFactor: 1.3,
				minUptime: 5000,
				connectionTimeout: 4000,
				maxRetries: Infinity,
				maxEnqueuedMessages: Infinity,
				startClosed: false,
			}),
	);

	const windowFocus = useWindowFocus();
	useEffect(() => {
		const closeListener = () => {
			if (isResolved.current) isWsReadyPromise.current = getNewPromise();
		};
		ws.addEventListener('close', closeListener);
		if (windowFocus && ws.readyState !== ws.OPEN) {
			ws.close();
			ws.reconnect();
		}
		return () => ws.removeEventListener('close', closeListener);
	}, [ws, windowFocus]);

	const sendWS = useCallback(
		async (data: unknown, skipReady = false) => {
			if (!skipReady) await isWsReadyPromise.current;
			if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(data));
		},
		[ws],
	);

	useEffect(() => {
		const onMessage = (event: any) => {
			const jsonEvent = JSON.parse(event.data);
			if (jsonEvent.id) send(`ws/${jsonEvent.id}`, jsonEvent);
			if (jsonEvent.action) send(`ws/${jsonEvent.action}`, jsonEvent);
		};

		ws.addEventListener('message', onMessage);
		return () => ws.removeEventListener('message', onMessage);
	}, [send, ws]);

	useEventListener(
		'ws/init',
		(event) => {
			if (event.action === 'init')
				sendWS({ action: 'init', id: event.id, token: authToken, projectId: currentProjectId }, true);
		},
		[sendWS],
	);

	useEventListener('ws/auth.success', () => resolve.current(), [sendWS]);

	const value = useMemo<WSProviderContextType>(() => ({ ws: ws as WebSocket, sendWS }), [ws, sendWS]);

	return (
		<WSProviderContext.Provider value={value}>
			<>{children}</>
		</WSProviderContext.Provider>
	);
}
