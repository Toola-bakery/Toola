import React from 'react';
import { InspectorItem, MenuItemProps } from './InspectorItem';

export type QueryInspectorProps = {
	menu: MenuItemProps[];
};

function Wrapper({ text }: { text: React.ReactElement }) {
	return text;
}
export function QueryInspector({ menu }: QueryInspectorProps) {
	return (
		<>
			{Array.isArray(menu)
				? menu.map((item) => <InspectorItem Wrapper={Wrapper} key={item.label} item={item} />)
				: null}
		</>
	);
}
