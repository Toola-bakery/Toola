import { Overlay } from '@blueprintjs/core';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Page } from '../../editor/components/Page/Page';

export type PageModalContextType = {
	push(pageId: string, params?: unknown): void;
	back(): void;
	replace(pageId: string, params?: unknown): void; // replaces last page in history
	close(): void;
};
export const PageModalContext = React.createContext<PageModalContextType>({
	close() {},
	back() {},
	push() {},
	replace() {},
});

export function PageModalProvider({ disabled, children }: PropsWithChildren<{ disabled?: boolean }>) {
	const [modalHistory, setModalHistory] = useState<MemoryHistory>(() => createMemoryHistory());
	const [key, setKey] = useState(() => modalHistory.location.key);

	const close = useCallback(() => setModalHistory(() => createMemoryHistory()), []);

	const isModalOpen = modalHistory.location.pathname !== '/' && !disabled;

	useEffect(() => {
		return modalHistory.listen((e) => setKey(e.key));
	}, [modalHistory]);

	const push = useCallback(
		(pageId: string, params: unknown) => modalHistory.push(`/${pageId}`, params),
		[modalHistory],
	);
	const replace = useCallback(
		(pageId: string, params: unknown) => modalHistory.replace(`/${pageId}`, params),
		[modalHistory],
	);
	const back = useCallback(() => modalHistory.goBack(), [modalHistory]);

	const routerHistory = useHistory();

	useEffect(() => {
		return routerHistory.block((tx, action) => {
			if (!isModalOpen) {
				return;
			}

			// if (action === 'POP') {
			// 	modalHistory.goBack();
			// 	return false;
			// }

			close();
		});
	}, [close, isModalOpen, modalHistory, routerHistory]);

	return (
		<PageModalContext.Provider value={{ close, back, push, replace }}>
			<Overlay isOpen={isModalOpen} onClose={close}>
				{isModalOpen ? (
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
						<Page pageId={modalHistory.location.pathname.slice(1)} pageParams={modalHistory.location.state} />
					</div>
				) : null}
			</Overlay>
			{children}
		</PageModalContext.Provider>
	);
}
