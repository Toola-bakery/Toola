import { IconName } from '@blueprintjs/core';
import React from 'react';
import { BlockInspectorProps } from './BlockInspector';
import { DatabaseMenuItem, DatabaseMenuItemProps } from './InspectorItems/DatabaseMenuItem';
import { InputMenuItem, InputMenuItemProps } from './InspectorItems/InputMenuItem';
import { NestedMenuItem, NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { PageMenuItem, PageMenuItemProps } from './InspectorItems/PageMenuItem';
import { QueryActionMenuItem, QueryActionMenuItemProps } from './InspectorItems/QueryActionMenuItem';
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
	| DatabaseMenuItemProps
	| QueryActionMenuItemProps
	| PageMenuItemProps
	| SwitchMenuItemProps;

export type InspectorItemProps<Item = MenuItemProps> = {
	item: Item;
	close?: () => void;
	setPath?: BlockInspectorProps['setPath'];
	Wrapper?: typeof React.Component | React.FC<any>;
	inline?: boolean;
};

export function InspectorItem(props: InspectorItemProps) {
	const { item } = props;
	if (item.type === 'item') return <SimpleMenuItem {...(props as InspectorItemProps<SimpleMenuItemProps>)} />;
	if (item.type === 'switch') return <SwitchMenuItem {...(props as InspectorItemProps<SwitchMenuItemProps>)} />;
	if (item.type === 'nested') return <NestedMenuItem {...(props as InspectorItemProps<NestedMenuItemProps>)} />;
	if (item.type === 'view') return <ViewMenuItem {...(props as InspectorItemProps<ViewMenuItemProps>)} />;
	if (item.type === 'input') return <InputMenuItem {...(props as InspectorItemProps<InputMenuItemProps>)} />;
	if (item.type === 'pages') return <PageMenuItem {...(props as InspectorItemProps<PageMenuItemProps>)} />;
	if (item.type === 'database') return <DatabaseMenuItem {...(props as InspectorItemProps<DatabaseMenuItemProps>)} />;
	if (item.type === 'select') return <SelectMenuItem {...(props as InspectorItemProps<SelectMenuItemProps>)} />;
	if (item.type === 'queryAction')
		return <QueryActionMenuItem {...(props as InspectorItemProps<QueryActionMenuItemProps>)} />;
	return null;
}
