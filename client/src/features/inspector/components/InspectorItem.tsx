import { IconName } from '@blueprintjs/core';
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
	icon?: IconName;
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
	Wrapper,
}: {
	item: MenuItemProps;
	close?: () => void;
	setPath?: BlockInspectorProps['setPath'];
	Wrapper?: typeof React.Component | React.FC<any>;
}) {
	if (item.type === 'item') return <SimpleMenuItem Wrapper={Wrapper} item={item} close={close} />;
	if (item.type === 'switch') return <SwitchMenuItem Wrapper={Wrapper} item={item} />;
	if (item.type === 'nested' && setPath) return <NestedMenuItem Wrapper={Wrapper} setPath={setPath} item={item} />;
	if (item.type === 'view') return <ViewMenuItem item={item} />;
	if (item.type === 'input') return <InputMenuItem Wrapper={Wrapper} item={item} />;
	if (item.type === 'select') return <SelectMenuItem Wrapper={Wrapper} item={item} />;
	return <></>;
}
