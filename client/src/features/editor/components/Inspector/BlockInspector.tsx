import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { InputMenuItem, InputMenuItemProps } from './InspectorItems/InputMenuItem';
import { NestedMenuItem, NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { SimpleMenuItem, SimpleMenuItemProps } from './InspectorItems/SimpleMenuItem';
import { SwitchMenuItem, SwitchMenuItemProps } from './InspectorItems/SwitchMenuItem';
import { ViewMenuItem, ViewMenuItemProps } from './InspectorItems/ViewItem';

export type BasicItemProps = {
	key: string;
	icon?: string;
};

export type MenuItemProps =
	| NestedMenuItemProps
	| SimpleMenuItemProps
	| ViewMenuItemProps
	| InputMenuItemProps
	| SwitchMenuItemProps;

export type BlockInspectorProps = {
	menu: MenuItemProps[];
	isOpen: [number, number] | false;
	close: () => void;
	path: string[];
};

export function InspectorItem({ item, close }: { item: MenuItemProps; close: () => void }) {
	if (item.type === 'item') return <SimpleMenuItem item={item} close={close} />;
	if (item.type === 'switch') return <SwitchMenuItem item={item} />;
	if (item.type === 'nested') return <NestedMenuItem item={item} />;
	if (item.type === 'view') return <ViewMenuItem item={item} />;
	if (item.type === 'input') return <InputMenuItem item={item} />;
	return <></>;
}

export function BlockInspector({ isOpen, menu, close, path }: BlockInspectorProps) {
	const state = path.reduce<(NestedMenuItemProps | ViewMenuItemProps)['next']>((acc, key) => {
		if (!Array.isArray(acc)) return acc;
		const nextItem = acc.find((item) => item.key === key) as NestedMenuItemProps | ViewMenuItemProps;
		return nextItem.next;
	}, menu);

	if (!isOpen) return null;
	return (
		<>
			<ClickAwayListener onClickAway={() => close()}>
				<div>
					<Menu
						anchorReference="anchorPosition"
						anchorPosition={isOpen ? { top: isOpen[1], left: isOpen[0] } : undefined}
						open={!!isOpen}
						onClose={() => close()}
						sx={{ '& .MuiPaper-root': { width: 290 } }}
					>
						{Array.isArray(state)
							? state.map((item) => <InspectorItem key={item.key} close={close} item={item} />)
							: state({})}
					</Menu>
				</div>
			</ClickAwayListener>
		</>
	);
}
