import { Button, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, Select } from '@blueprintjs/select';
import React, { useCallback, useState } from 'react';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockState } from '../../../editor/hooks/useBlockProperty';
import { InputLabel } from '../../components/InputLabel';
import { useSelectInputItems } from './hooks/useSelectInputItems';

type ItemWithLabel = {
	value: string;
	label?: string;
};

const ItemSelect = Select.ofType<ItemWithLabel>();

export function SelectBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { showInspector } = useBlockContext();
	const [selectedKey, setSelectedKey] = useBlockState<string | null>('value', null);
	const [selectedItem, setSelectedItem] = useState<ItemWithLabel | null>(null);

	const { items } = useSelectInputItems();

	const onRemove = useCallback(() => {
		setSelectedItem(null);
		setSelectedKey(null);
	}, [setSelectedKey]);

	const renderItem = useCallback<ItemRenderer<ItemWithLabel>>(
		(item, { handleClick, modifiers }) => {
			if (!modifiers.matchesPredicate) {
				return null;
			}
			return (
				<MenuItem
					active={modifiers.active}
					disabled={modifiers.disabled}
					key={item.value}
					icon={selectedKey === item.value ? 'tick' : 'blank'}
					onClick={handleClick}
					text={typeof item.label === 'undefined' ? item.value : item.label}
				/>
			);
		},
		[selectedKey],
	);

	if (hide || !show) return null;

	// TODO "helperText" Helper text with details...
	return (
		<div onContextMenu={showInspector}>
			<InputLabel>
				<ItemSelect
					fill
					items={items}
					itemRenderer={renderItem}
					noResults={<MenuItem disabled text="No results." />}
					onItemSelect={(item) => {
						if (selectedKey === item.value) return onRemove(item);
						setSelectedItem(item);
						setSelectedKey(item.value);
					}}
					itemsEqual="value"
					popoverProps={{ minimal: true }}
					itemPredicate={(query, item) =>
						item.label?.toLowerCase().includes(query.toLowerCase()) ||
						item.value.toLowerCase().includes(query.toLowerCase())
					}
				>
					<Button
						fill
						text={selectedItem?.label || selectedItem?.value || 'Not selected'}
						rightIcon="double-caret-vertical"
					/>
				</ItemSelect>
			</InputLabel>
		</div>
	);
}
