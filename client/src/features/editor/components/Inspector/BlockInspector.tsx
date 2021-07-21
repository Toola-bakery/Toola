import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ClickAwayListener } from '@material-ui/core';
import { BasicBlock, Blocks } from '../../types';

export type MenuItemProps = {
	key: string;
	icon?: string;
	call?: () => void;
	next?: React.FunctionComponent<BlockInspectorProps['context']> | MenuItemProps[];
};

export type BlockInspectorProps = {
	menu: MenuItemProps[];
	context: { id: string; block: BasicBlock & Blocks };
	isOpen: [number, number] | false;
	close: (value: unknown) => void;
};

export function BlockInspector({ isOpen, menu, close, context }: BlockInspectorProps) {
	const [state, setState] = useState<NonNullable<MenuItemProps['next']>>(menu);

	useEffect(() => {
		if (isOpen) return;
		setState(menu);
	}, [isOpen, menu]);

	if (!isOpen) return null;
	return (
		<>
			<ClickAwayListener
				onClickAway={() => {
					console.log('onClickAway');
					close(null);
				}}
			>
				<div>
					<Menu
						anchorReference="anchorPosition"
						anchorPosition={isOpen ? { top: isOpen[1], left: isOpen[0] } : undefined}
						open={!!isOpen}
						onClose={() => close(null)}
					>
						{Array.isArray(state)
							? state.map(({ next, key, call }) => (
									<MenuItem
										key={key}
										onClick={() => {
											if (typeof next !== 'undefined') setState(() => next);
											else close(null);
											call?.();
										}}
									>
										{key}
									</MenuItem>
							  ))
							: state(context)}
					</Menu>
				</div>
			</ClickAwayListener>
		</>
	);
}
