import React from 'react';
import { BlockInspectorProps } from './BlockInspector';
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

export function InspectorItem({
	item,
	close,
	setPath,
}: {
	item: MenuItemProps;
	close?: () => void;
	setPath?: BlockInspectorProps['setPath'];
}) {
	if (item.type === 'item') return <SimpleMenuItem item={item} close={close} />;
	if (item.type === 'switch') return <SwitchMenuItem item={item} />;
	if (item.type === 'nested' && setPath) return <NestedMenuItem setPath={setPath} item={item} />;
	if (item.type === 'view') return <ViewMenuItem item={item} />;
	if (item.type === 'input') return <InputMenuItem item={item} />;
	if (item.type === 'select') return <SelectMenuItem item={item} />;
	return <></>;
}
