import React from 'react';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import { usePageContext } from '../../hooks/useReferences';
import { InputMenuItem, InputMenuItemProps } from './InspectorItems/InputMenuItem';
import { NestedMenuItem, NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { SelectMenuItem, SelectMenuItemProps } from './InspectorItems/SelectMenuItem';
import { SimpleMenuItem, SimpleMenuItemProps } from './InspectorItems/SimpleMenuItem';
import { SwitchMenuItem, SwitchMenuItemProps } from './InspectorItems/SwitchMenuItem';
import { ViewMenuItem, ViewMenuItemProps } from './InspectorItems/ViewItem';

export type BasicItemProps = {
	label: string;
	icon?: string;
};

export type MenuItemProps =
	| NestedMenuItemProps
	| SimpleMenuItemProps
	| ViewMenuItemProps
	| InputMenuItemProps
	| SelectMenuItemProps
	| SwitchMenuItemProps;

export type BlockInspectorProps = {
	menu: MenuItemProps[];
	isOpen: [number, number] | false;
	close: () => void;
	path: string[];
	setPath: (state: ((oldPath: string[]) => string[]) | string[]) => void;
};

export function InspectorItem({
	item,
	close,
	setPath,
}: {
	item: MenuItemProps;
	close: () => void;
	setPath: BlockInspectorProps['setPath'];
}) {
	if (item.type === 'item') return <SimpleMenuItem item={item} close={close} />;
	if (item.type === 'switch') return <SwitchMenuItem item={item} />;
	if (item.type === 'nested') return <NestedMenuItem setPath={setPath} item={item} />;
	if (item.type === 'view') return <ViewMenuItem item={item} />;
	if (item.type === 'input') return <InputMenuItem item={item} />;
	if (item.type === 'select') return <SelectMenuItem item={item} />;
	return <></>;
}

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
