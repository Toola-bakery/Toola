import { Button, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, Select } from '@blueprintjs/select';
import React, { useCallback, useMemo, useState } from 'react';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockState } from '../../../editor/hooks/useBlockProperty';
import { InputLabel } from '../../components/InputLabel';
import { useInitialValue } from '../../hooks/useInitialValue';
import { ItemWithLabel, useSelectInputItems } from './hooks/useSelectInputItems';

const ItemSelect = Select.ofType<ItemWithLabel>();

export function SelectBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { showInspector } = useBlockContext();
	const { calculateInitialValue } = useInitialValue(0);

	const [selectedKey, setSelectedKey] = useBlockState<unknown | null>('value', calculateInitialValue);

	const { items } = useSelectInputItems(1);

	const selectedItem = useMemo(
		() => (Array.isArray(items) && items.find((i) => i.value === String(selectedKey))) || null,
		[items, selectedKey],
	);

	const onRemove = useCallback(() => {
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
					key={String(item.value)}
					icon={selectedKey === item.value ? 'tick' : 'blank'}
					onClick={handleClick}
					text={String(typeof item.label === 'undefined' ? item.value : item.label)}
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
						if (selectedKey === item.value) return onRemove();
						setSelectedKey(item.value);
					}}
					itemsEqual="value"
					popoverProps={{ minimal: true }}
					itemPredicate={(query, item) =>
						String(item.label)?.toLowerCase().includes(query.toLowerCase()) ||
						String(item.value).toLowerCase().includes(query.toLowerCase())
					}
				>
					<Button
						fill
						text={String(selectedItem?.label || selectedItem?.value || selectedKey || 'Not selected')}
						rightIcon="double-caret-vertical"
					/>
				</ItemSelect>
			</InputLabel>
		</div>
	);
}
