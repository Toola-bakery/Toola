import { useAppSelector } from '../../../redux/hooks';
import { useWS } from '../../ws/hooks/useWS';
import { selectBlocksState } from '../redux/editor';
import { BlockMethods } from '../types/blocks';
import { useEventListener, useEvents } from './useEvents';

export type SateGetEvent = {
	property: string;
	blockId: string;
	pageId: string;
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

export function useStateToWS(pageId: string, blockMethods: { [p: string]: BlockMethods }) {
	const { sendWS } = useWS();
	const blocksState = useAppSelector((state) => selectBlocksState(state, pageId));
	useEventListener<SateGetEvent>(
		`ws/page.getState`,
		(event) => {
			const { property, pageId: pageIdReq, blockId, redirectedFrom, messageId } = event;
			if (property && pageId && blockId && redirectedFrom) {
				sendWS({
					action: 'state.getResponse',
					destinationId: redirectedFrom,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					value: blocksState?.[blockId]?.[property],
					messageId,
				});
			}
		},
		[blocksState],
	);

	useEventListener<PageCallEvent>(
		`ws/page.call`,
		(event) => {
			const { method, pageId: pageIdReq, callArgs = [], blockId, redirectedFrom, messageId } = event;
			if (method && pageId && blockId && redirectedFrom) {
				console.log(event);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const resp = blockMethods?.[blockId]?.[method]?.(...callArgs);
				sendWS({
					action: 'state.callResponse',
					destinationId: redirectedFrom,
					value: resp,
					messageId,
				});
			}
		},
		[blocksState],
	);
}
