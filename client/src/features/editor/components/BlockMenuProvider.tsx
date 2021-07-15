import React, { useCallback, useMemo, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { usePromise } from '../../../hooks/usePromise';

export type BlockMenuContextType = {
	isOpen: boolean;
	anchorEl?: HTMLElement;
	open: (anchorEl: NonNullable<BlockMenuContextType['anchorEl']>) => Promise<string | void | unknown>;
};

export const BlockMenuContext = React.createContext<BlockMenuContextType>({
	isOpen: false,
	open: () => new Promise(() => {}),
});

export function BlockMenuProvider({ children }: React.PropsWithChildren<{ a?: false }>): JSX.Element {
	const [isOpen, setOpen] = useState<BlockMenuContextType['isOpen']>(false);

	const { cleanPromise, resolve } = usePromise();

	const [anchorEl, setAnchorEl] = useState<NonNullable<BlockMenuContextType['anchorEl']>>();

	const open = useCallback<BlockMenuContextType['open']>(
		_anchorEl => {
			setOpen(true);
			setAnchorEl(_anchorEl);
			return cleanPromise();
		},
		[cleanPromise],
	);

	const value = useMemo<BlockMenuContextType>(() => ({ isOpen, anchorEl, open }), [isOpen, anchorEl, open]);

	const close = useCallback(
		result => {
			resolve(result);
			setOpen(false);
			setAnchorEl(undefined);
		},
		[resolve],
	);

	return (
		<BlockMenuContext.Provider value={value}>
			<>
				{children}

				<Menu anchorEl={anchorEl} keepMounted open={isOpen}>
					<MenuItem onClick={() => close('text')}>Text</MenuItem>
					<MenuItem onClick={() => close('code')}>Code</MenuItem>
				</Menu>
			</>
		</BlockMenuContext.Provider>
	);
}
