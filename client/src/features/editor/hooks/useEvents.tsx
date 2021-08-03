import { DependencyList, useCallback, useEffect, useMemo } from 'react';

export type EventStorage = {
	[channel: string]: EventChannelStorage;
};
export type EventListeners = {
	[channel: string]: ((event: Event) => void)[];
};

export type EventChannelStorage = Event[];

export type Event = { action: string; waitListener?: boolean } & unknown;

const events: EventStorage = {};
const eventListeners: EventListeners = {};

export type UseEventsResponse = {
	addEventListener: (channel: string, callback: (event: Event) => void) => () => void;
	deleteEventListener: (channel: string, callback: (event: Event) => void) => void;
	send: (channel: string, event: Event) => void;
};

export function useEvents(): UseEventsResponse {
	const deleteEventListener = useCallback<UseEventsResponse['deleteEventListener']>((channel, callback) => {
		eventListeners[channel] = eventListeners[channel].filter((cb) => cb !== callback);
	}, []);
	const addEventListener = useCallback<UseEventsResponse['addEventListener']>(
		(channel, callback) => {
			if (!eventListeners[channel]) eventListeners[channel] = [callback];
			else eventListeners[channel].push(callback);

			const eventsInQueue = events[channel];

			events[channel] = [];
			eventsInQueue?.map(callback);

			return () => deleteEventListener(channel, callback);
		},
		[deleteEventListener],
	);

	const send = useCallback<UseEventsResponse['send']>((channel: string, event: Event) => {
		if (!eventListeners[channel]?.length && event.waitListener) {
			if (events[channel]) events[channel].push(event);
			else events[channel] = [event];
		} else eventListeners[channel]?.map((listener) => listener(event));
	}, []);

	return useMemo<UseEventsResponse>(
		() => ({ addEventListener, deleteEventListener, send }),
		[addEventListener, deleteEventListener, send],
	);
}

export function useEventListener<U = Record<string, never>>(
	id: string,
	effect: (event: U & Event) => void,
	deps: DependencyList,
) {
	const { addEventListener, send } = useEvents();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const cb = useCallback(effect as (event: Event) => void, deps);
	useEffect(() => addEventListener(id, cb), [addEventListener, cb, id]);

	return { send };
}
