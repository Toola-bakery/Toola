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
	inline,
}: {
	item: MenuItemProps;
	close?: () => void;
	setPath?: BlockInspectorProps['setPath'];
	Wrapper?: typeof React.Component | React.FC<any>;
	inline?: boolean;
}) {
	if (item.type === 'item') return <SimpleMenuItem Wrapper={Wrapper} item={item} close={close} />;
	if (item.type === 'switch') return <SwitchMenuItem inline={inline} Wrapper={Wrapper} item={item} />;
	if (item.type === 'nested' && setPath) return <NestedMenuItem Wrapper={Wrapper} setPath={setPath} item={item} />;
	if (item.type === 'view') return <ViewMenuItem item={item} />;
	if (item.type === 'input') return <InputMenuItem inline={inline} Wrapper={Wrapper} item={item} />;
	if (item.type === 'select') return <SelectMenuItem inline={inline} Wrapper={Wrapper} item={item} />;
	return <></>;
}
