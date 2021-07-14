import { useCallback, useMemo } from "react";

export type EventStorage = {
  [channel: string]: EventChannelStorage;
};
export type EventListeners = {
  [channel: string]: ((event: Event) => void)[];
};

export type EventChannelStorage = Event[];

export type Event = { eventName: string; waitListener?: boolean } & {
  [key: string]: string | undefined | boolean | never;
};

const events: EventStorage = {};
const eventListeners: EventListeners = {};

export type UseEventsResponse = {
  addEventListener: (channel: string, callback: (event: Event) => void) => void;
  deleteEventListener: (
    channel: string,
    callback: (event: Event) => void
  ) => void;
  send: (channel: string, event: Event) => void;
};

export function useEvents(): UseEventsResponse {
  const deleteEventListener = useCallback<
    UseEventsResponse["deleteEventListener"]
  >((channel, callback) => {
    eventListeners[channel] = eventListeners[channel].filter(
      (cb) => cb !== callback
    );
  }, []);
  const addEventListener = useCallback<UseEventsResponse["addEventListener"]>(
    (channel, callback) => {
      if (!eventListeners[channel]) eventListeners[channel] = [callback];
      else eventListeners[channel].push(callback);

      const eventsInQueue = events[channel];
      console.log({ eventsInQueue });
      events[channel] = [];
      eventsInQueue?.map(callback);

      return () => deleteEventListener(channel, callback);
    },
    [deleteEventListener]
  );

  const send = useCallback<UseEventsResponse["send"]>(
    (channel: string, event: Event) => {
      if (!eventListeners[channel]?.length && event.waitListener) {
        if (events[channel]) events[channel].push(event);
        else events[channel] = [event];
      } else eventListeners[channel]?.map((listener) => listener(event));
    },
    []
  );

  return useMemo<UseEventsResponse>(
    () => ({ addEventListener, deleteEventListener, send }),
    [addEventListener, deleteEventListener, send]
  );
}
