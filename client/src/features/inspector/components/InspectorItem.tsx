import { IconName } from '@blueprintjs/core';
import React from 'react';
import { InspectorPropsType } from '../hooks/useInspectorState';
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
import { TextAlignItemProps, TextAlignMenuItem } from './InspectorItems/TextAlignMenuItem';
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
	| TextAlignItemProps
	| SwitchMenuItemProps;

export type InspectorItemProps<Item = MenuItemProps> = {
	item: Item;
	close?: () => void;
	setPath?: InspectorPropsType['setPath'];
	Wrapper?: typeof React.Component | React.FC<any>;
	inline?: boolean;
};

const inspectorList: { [key in MenuItemProps['type']]: React.ReactNode } = {
	blockName: BlockNameMenuItem,
	item: SimpleMenuItem,
	querySelector: QuerySelectorMenuItem,
	switch: SwitchMenuItem,
	nested: NestedMenuItem,
	view: ViewMenuItem,
	pgSQL: PgSQLMenuItem,
	input: InputMenuItem,
	pages: PageMenuItem,
	database: DatabaseMenuItem,
	select: SelectMenuItem,
	queryAction: QueryActionMenuItem,
	textAlign: TextAlignMenuItem,
};

export const InspectorItem = React.memo((props: InspectorItemProps) => {
	const { item } = props;
	const Inspector = inspectorList[item.type as keyof typeof inspectorList];
	if (!Inspector) return null;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return <Inspector {...props} />;
});
