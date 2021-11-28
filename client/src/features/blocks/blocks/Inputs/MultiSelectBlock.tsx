import { MenuItem } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';
import React, { useCallback, useState } from 'react';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockState } from '../../../editor/hooks/useBlockProperty';
import { InputLabel } from '../../components/InputLabel';
import { ItemWithLabel, useSelectInputItems } from './hooks/useSelectInputItems';

const ItemSelect = MultiSelect.ofType<ItemWithLabel>();

const renderTag = (item: ItemWithLabel) => String(typeof item.label === 'undefined' ? item.value : item.label);

export function MultiSelectBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { showInspector } = useBlockContext();
	const [selectedKeys, setSelectedKeys] = useBlockState<unknown[]>('value', []);
	const [selectedItems, setSelectedItems] = useState<ItemWithLabel[]>([]);

	const onRemove = useCallback(
		(item: ItemWithLabel) => {
			setSelectedItems((previousItems) => previousItems.filter((i) => i.value !== item.value));
			setSelectedKeys(selectedKeys.filter((v) => v !== item.value));
		},
		[selectedKeys, setSelectedKeys],
	);

	const { items } = useSelectInputItems();

	const renderItem = useCallback<ItemRenderer<ItemWithLabel>>(
		(item, { handleClick, modifiers }) => {
			if (!modifiers.matchesPredicate) {
				return null;
			}
			return (
				<MenuItem
					active={modifiers.active}
					disabled={modifiers.disabled}
					key={String(item.value)}
					icon={selectedKeys.includes(String(item.value)) ? 'tick' : 'blank'}
					onClick={handleClick}
					text={String(typeof item.label === 'undefined' ? item.value : item.label)}
				/>
			);
		},
		[selectedKeys],
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
					tagRenderer={renderTag}
					noResults={<MenuItem disabled text="No results." />}
					selectedItems={selectedItems}
					onItemSelect={(item) => {
						if (selectedKeys.includes(item.value)) return onRemove(item);
						setSelectedItems((previousItems) => [...previousItems, item]);
						setSelectedKeys([...selectedKeys, item.value]);
					}}
					itemsEqual="value"
					onRemove={onRemove}
					popoverProps={{ minimal: true }}
					itemPredicate={(query, item) =>
						String(item.label)?.toLowerCase().includes(query.toLowerCase()) ||
						String(item.value).toLowerCase().includes(query.toLowerCase())
					}
				/>
			</InputLabel>
		</div>
	);
}
