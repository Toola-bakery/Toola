import { Button, InputGroup, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';
import React, { useCallback, useMemo, useState } from 'react';
import { useReferences } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../../hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { InputLabel } from '../../componentsWithLogic/InputLabel';
import { useValuePlaceholderInitialController } from './hooks';

type ItemWithLabel = {
	value: string;
	label?: string;
};

const ItemSelect = MultiSelect.ofType<ItemWithLabel>();

const renderTag = (item: ItemWithLabel) => (typeof item.label === 'undefined' ? item.value : item.label);

export function MultiSelectBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { showInspector } = useBlockContext();
	const [selectedKeys, setSelectedKeys] = useBlockState<string[]>('value', []);
	const [selectedItems, setSelectedItems] = useState<ItemWithLabel[]>([]);

	// eslint-disable-next-line no-template-curly-in-string
	const [values, setValues] = useBlockProperty<string>('values', "${['apple', 'banana', 'watermelon']}");
	const valuesCalculated = useReferences(values);

	// eslint-disable-next-line no-template-curly-in-string
	const [labels, setLabels] = useBlockProperty<string>('labels', '${self.values.map(v=>v.toUpperCase())}');
	const labelsCalculated = useReferences(labels);

	const items = useMemo(() => {
		if (!Array.isArray(valuesCalculated)) return [];
		const stringedValues = valuesCalculated.map(String);

		if (!Array.isArray(labelsCalculated)) return stringedValues.map((value) => ({ value }));
		return stringedValues.map<ItemWithLabel>((value, i) => ({
			value,
			label:
				labelsCalculated[i] !== null && typeof labelsCalculated[i] !== 'undefined'
					? String(labelsCalculated[i])
					: labelsCalculated[i],
		}));
	}, [labelsCalculated, valuesCalculated]);

	// useDeclareBlockMethods({ setValue: (newValue: string) => setValue(newValue) }, [setValue]);
	const onRemove = useCallback(
		(item: ItemWithLabel) => {
			setSelectedItems((previousItems) => previousItems.filter((i) => i.value !== item.value));
			setSelectedKeys(selectedKeys.filter((v) => v !== item.value));
		},
		[selectedKeys, setSelectedKeys],
	);

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
					icon={selectedKeys.includes(item.value) ? 'tick' : 'blank'}
					onClick={handleClick}
					text={typeof item.label === 'undefined' ? item.value : item.label}
				/>
			);
		},
		[selectedKeys],
	);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{ type: 'input', label: 'Values', value: values, onChange: setValues },
			{ type: 'input', label: 'Labels', value: labels, onChange: setLabels },
		],
		[labels, setLabels, setValues, values],
	);

	useAppendBlockMenu(menu, 0);
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
						item.label?.toLowerCase().includes(query.toLowerCase()) ||
						item.value.toLowerCase().includes(query.toLowerCase())
					}
				/>
			</InputLabel>
		</div>
	);
}
