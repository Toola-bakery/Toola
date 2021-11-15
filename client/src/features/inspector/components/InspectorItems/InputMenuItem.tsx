import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';
import { CodeInput } from '../CodeInput';

export type InputMenuItemProps = BasicItemProps & {
	type: 'input';
	value: string;
	codeType?: 'string' | 'object';
	onChange: (v: string) => void;
	multiline?: boolean;
};

const CSSFix = styled.div<{ hasIcon: boolean }>`
	.bp4-text-overflow-ellipsis {
		overflow: visible;
	}
`;

export function InputMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<InputMenuItemProps>) {
	return (
		<CSSFix hasIcon={!!item.icon}>
			<Wrapper
				shouldDismissPopover={false}
				icon={item.icon}
				text={
					<CodeInput
						multiline={item.multiline}
						inline={inline}
						label={item.label}
						value={item.value}
						type={item.codeType}
						onChange={item.onChange}
					/>
				}
			/>
		</CSSFix>
	);
}
