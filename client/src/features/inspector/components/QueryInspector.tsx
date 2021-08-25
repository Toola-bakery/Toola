import React from 'react';
import { InspectorItem, MenuItemProps } from './InspectorItem';

export type QueryInspectorProps = {
	menu: MenuItemProps[];
};

export function QueryInspector({ menu }: QueryInspectorProps) {
	return <>{Array.isArray(menu) ? menu.map((item) => <InspectorItem key={item.label} item={item} />) : null}</>;
}
