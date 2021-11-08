import { IconName } from '@blueprintjs/core';
import React from 'react';
import { BlockInspectorProps } from './BlockInspector';
import { BlockNameMenuItem, BlockNameMenuItemProps } from './InspectorItems/BlockNameMenuItem';
import { DatabaseMenuItem, DatabaseMenuItemProps } from './InspectorItems/DatabaseMenuItem';
import { InputMenuItem, InputMenuItemProps } from './InspectorItems/InputMenuItem';
import { NestedMenuItem, NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { PageMenuItem, PageMenuItemProps } from './InspectorItems/PageMenuItem';
import { PgSQLMenuItem, PgSQLMenuItemProps } from './InspectorItems/PgSQLMenuItem';
import { QueryActionMenuItem, QueryActionMenuItemProps } from './InspectorItems/QueryActionMenuItem';
import { QuerySelectorMenuItem, QuerySelectorMenuItemProps } from './InspectorItems/QuerySelectorMenuItem';
import { SelectMenuItem, SelectMenuItemProps } from './InspectorItems/SelectMenuItem';
import { SimpleMenuItem, SimpleMenuItemProps } from './InspectorItems/SimpleMenuItem';
import { SwitchMenuItem, SwitchMenuItemProps } from './InspectorItems/SwitchMenuItem';
import { ViewMenuItem, ViewMenuItemProps } from './InspectorItems/ViewItem';

export type BasicItemProps = {
	label: string;
	icon?: IconName;
	hide?: boolean;
};

export type MenuItemProps =
	| NestedMenuItemProps
	| SimpleMenuItemProps
	| ViewMenuItemProps
	| InputMenuItemProps
	| SelectMenuItemProps
	| QuerySelectorMenuItemProps
	| DatabaseMenuItemProps
	| QueryActionMenuItemProps
	| PageMenuItemProps
	| BlockNameMenuItemProps
	| PgSQLMenuItemProps
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
	if (item.type === 'blockName')
		return <BlockNameMenuItem {...(props as InspectorItemProps<BlockNameMenuItemProps>)} />;
	if (item.type === 'item') return <SimpleMenuItem {...(props as InspectorItemProps<SimpleMenuItemProps>)} />;
	if (item.type === 'querySelector')
		return <QuerySelectorMenuItem {...(props as InspectorItemProps<QuerySelectorMenuItemProps>)} />;
	if (item.type === 'switch') return <SwitchMenuItem {...(props as InspectorItemProps<SwitchMenuItemProps>)} />;
	if (item.type === 'nested') return <NestedMenuItem {...(props as InspectorItemProps<NestedMenuItemProps>)} />;
	if (item.type === 'view') return <ViewMenuItem {...(props as InspectorItemProps<ViewMenuItemProps>)} />;
	if (item.type === 'pgSQL') return <PgSQLMenuItem {...(props as InspectorItemProps<PgSQLMenuItemProps>)} />;
	if (item.type === 'input') return <InputMenuItem {...(props as InspectorItemProps<InputMenuItemProps>)} />;
	if (item.type === 'pages') return <PageMenuItem {...(props as InspectorItemProps<PageMenuItemProps>)} />;
	if (item.type === 'database') return <DatabaseMenuItem {...(props as InspectorItemProps<DatabaseMenuItemProps>)} />;
	if (item.type === 'select') return <SelectMenuItem {...(props as InspectorItemProps<SelectMenuItemProps>)} />;
	if (item.type === 'queryAction')
		return <QueryActionMenuItem {...(props as InspectorItemProps<QueryActionMenuItemProps>)} />;
	return null;
}
