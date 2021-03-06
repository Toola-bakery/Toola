import { useCallback } from 'react';
import { usePageContext } from '../../executor/hooks/useReferences';
import { evalGet } from '../../executor/hooks/useWatchList';
import { useWS } from '../../ws/hooks/useWS';
import { useCurrent } from './useCurrent';
import { useEventListener } from './useEvents';

export type SateGetEvent = {
	keys: string[];
	redirectedFrom: string;
	reqId: string;
	messageId: string;
};

export type PageCallEvent = {
	callArgs?: unknown[];
	method: string;
	blockId: string;
	pageId: string;
	redirectedFrom: string;
	reqId: string;
	messageId: string;
};

export function useStateToWS() {
	const { sendWS } = useWS();
	const { globals, pageId } = usePageContext();
	const { blocks, blocksMethods } = useCurrent();
	useEventListener<SateGetEvent>(
		`ws/page.getState`,
		(event) => {
			const { keys, redirectedFrom, messageId } = event;
			const topLevelObject = { blocks, globals };

			if (pageId && redirectedFrom) {
				const value = evalGet(topLevelObject, keys);

				sendWS({
					action: 'state.getResponse',
					destinationId: redirectedFrom,
					value,
					messageId,
				});
			}
		},
		[blocks, globals, pageId, sendWS],
	);

	const pageCallCallback = useCallback(
		(event) => {
			const { method, pageId: pageIdReq, callArgs = [], blockId, redirectedFrom, messageId } = event;
			if (method && pageId && blockId && redirectedFrom) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const resp = blocksMethods?.[blockId]?.[method]?.(...callArgs);
				sendWS({
					action: 'state.callResponse',
					destinationId: redirectedFrom,
					value: resp,
					messageId,
				});
			}
		},
		[blocksMethods, pageId, sendWS],
	);
	useEventListener<PageCallEvent>(`ws/page.call`, pageCallCallback, [pageCallCallback]);
}
