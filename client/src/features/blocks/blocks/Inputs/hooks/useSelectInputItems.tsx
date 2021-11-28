import { MenuItem } from '@blueprintjs/core';
import { ItemRenderer } from '@blueprintjs/select';
import React, { useCallback, useMemo } from 'react';
import { useAppendBlockMenu } from '../../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../../../editor/hooks/useBlockProperty';
import { useReferences } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';

export type ItemWithLabel = {
	value: unknown;
	label?: unknown;
};

export function useSelectInputItems(menuIndex = 0) {
	// eslint-disable-next-line no-template-curly-in-string
	const [values, setValues] = useBlockProperty<string>('values', "${['apple', 'banana', 'watermelon']}");
	const valuesCalculated = useReferences(values);
	// eslint-disable-next-line no-template-curly-in-string
	const [labels, setLabels] = useBlockProperty<string>('labels', '${self.values.map(v=>v.toUpperCase())}');
	const labelsCalculated = useReferences(labels);

	const items = useMemo<ItemWithLabel[]>(() => {
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

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{ type: 'input', label: 'Values', value: values, onChange: setValues },
			{ type: 'input', label: 'Labels', value: labels, onChange: setLabels },
		],
		[labels, setLabels, setValues, values],
	);

	useAppendBlockMenu(menu, menuIndex);

	return { items };
}
