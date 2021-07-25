import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';

export type InspectorContext<Block> = { id: string; block: BasicBlock & Block };
export type MenuItemProps<Block extends Blocks = Blocks> = {
	key: string;
	icon?: string;
	secondaryAction?: React.FunctionComponent<InspectorContext<Block>>;
	call?: (context: InspectorContext<Block>) => void;
	next?: React.FunctionComponent<InspectorContext<Block>> | MenuItemProps[];
};

export type BlockInspectorProps<Block extends Blocks = Blocks> = {
	menu: MenuItemProps<Block>[];
	context: InspectorContext<Block>;
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
			<ClickAwayListener onClickAway={() => close(null)}>
				<div>
					<Menu
						anchorReference="anchorPosition"
						anchorPosition={isOpen ? { top: isOpen[1], left: isOpen[0] } : undefined}
						open={!!isOpen}
						onClose={() => close(null)}
						sx={{ '& .MuiPaper-root': { width: 290 } }}
					>
						{Array.isArray(state)
							? state.map(({ secondaryAction, next, key, call }) => (
									<MenuItem
										key={key}
										onClick={() => {
											if (typeof next !== 'undefined') setState(() => next);
											else close(null);
											call?.(context);
										}}
									>
										<Typography variant="inherit">{key}</Typography>

										{secondaryAction ? (
											<ListItemSecondaryAction>{secondaryAction(context)}</ListItemSecondaryAction>
										) : null}
									</MenuItem>
							  ))
							: state(context)}
					</Menu>
				</div>
			</ClickAwayListener>
		</>
	);
}
