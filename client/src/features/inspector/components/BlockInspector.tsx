import React from 'react';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import { InspectorItem, MenuItemProps } from './InspectorItem';
import { NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { ViewMenuItemProps } from './InspectorItems/ViewItem';

export type BlockInspectorProps = {
	menu: MenuItemProps[];
	isOpen: [number, number] | false;
	close: () => void;
	path: string[];
	setPath: (state: ((oldPath: string[]) => string[]) | string[]) => void;
};

export function BlockInspector({ isOpen, menu, close, path, setPath }: BlockInspectorProps) {
	const state = path.reduce<(NestedMenuItemProps | ViewMenuItemProps)['next']>((acc, key) => {
		if (!Array.isArray(acc)) return acc;
		const nextItem = acc.find((item) => item.label === key) as NestedMenuItemProps | ViewMenuItemProps;
		return nextItem?.next;
	}, menu);

	if (!isOpen || !state) return null;

	return (
		<>
			<Popover
				anchorReference="anchorPosition"
				anchorPosition={isOpen ? { top: isOpen[1], left: isOpen[0] } : undefined}
				open={!!isOpen}
				onClose={() => close()}
				sx={{ '& .MuiPaper-root': { width: 290 } }}
			>
				{Array.isArray(state) ? (
					<List>
						{state.map((item) => (
							<InspectorItem key={item.label} close={close} item={item} setPath={setPath} />
						))}
					</List>
				) : (
					state({})
				)}
			</Popover>
		</>
	);
}
