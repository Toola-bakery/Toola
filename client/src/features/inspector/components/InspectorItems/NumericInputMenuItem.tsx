import { MenuItem, NumericInput } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { parseIntSafe } from '../../../blocks/helpers/parsers';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type NumericInputMenuItemProps = BasicItemProps & {
	type: 'numericInput';
	value: number | '';
	onChange: (v: number | '') => void;
};

const CSSFix = styled.div<{ hasIcon: boolean }>`
	.bp4-text-overflow-ellipsis {
		overflow: visible;
	}
`;

export function NumericInputMenuItem({ item, Wrapper = MenuItem }: InspectorItemProps<NumericInputMenuItemProps>) {
	return (
		<CSSFix hasIcon={!!item.icon}>
			<Wrapper
				shouldDismissPopover={false}
				icon={item.icon}
				text={
					<NumericInput
						value={parseIntSafe(item.value)}
						onValueChange={(valueAsNumber) => {
							item.onChange(valueAsNumber);
						}}
					/>
				}
			/>
		</CSSFix>
	);
}
