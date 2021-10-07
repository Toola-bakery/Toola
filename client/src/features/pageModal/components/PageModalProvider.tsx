import { Overlay } from '@blueprintjs/core';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Page } from '../../editor/components/Page/Page';

export type PageModalContextType<T = unknown> = {
	push(pageId: string, params?: unknown): void;
	replace(pageId: string, params?: unknown): void; // replaces last page in history
	reset(pageId: string, params?: unknown): void; // removes all history
	params?: T;
	pageId?: string;
	close(): void;
};
export const PageModalContext = React.createContext<PageModalContextType>({
	close() {},
	push() {},
	replace() {},
	reset() {},
});

export function PageModalProvider({ disabled, children }: PropsWithChildren<{ disabled?: boolean }>) {
	const [history, setHistory] = useState<[pageId: string, params?: unknown][]>([]);

	const currentPage = useMemo(() => (history?.length ? history[history?.length - 1] : null), [history]);

	const close = useCallback(() => setHistory([]), []);
	const push = useCallback(
		(pageId: string, params: unknown) => setHistory((currentHistory) => [...currentHistory, [pageId, params]]),
		[],
	);

	const reset = useCallback((pageId: string, params: unknown) => setHistory(() => [[pageId, params]]), []);

	const replace = useCallback(
		(pageId: string, params: unknown) =>
			setHistory((currentHistory) => [...currentHistory.slice(0, -1), [pageId, params]]),
		[],
	);

	return (
		<PageModalContext.Provider
			value={{ close, pageId: currentPage?.[0], params: currentPage?.[1], reset, replace, push }}
		>
			<Overlay isOpen={!!currentPage && !disabled} onClose={close}>
				{currentPage ? (
					<div
						style={{
							overflow: 'scroll',
							width: '90vw',
							backgroundColor: 'white',
							marginLeft: '5vw',
							height: '90vh',
							marginTop: '5vh',
							borderRadius: 4,
						}}
					>
						<Page pageId={currentPage[0]} pageParams={currentPage[1]} />
					</div>
				) : null}
			</Overlay>
			{children}
		</PageModalContext.Provider>
	);
}
