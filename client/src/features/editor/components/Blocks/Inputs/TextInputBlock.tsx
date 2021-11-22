import { InputGroup } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { InputLabel } from '../../componentsWithLogic/InputLabel';
import { useValuePlaceholderInitialController } from './hooks';

export type InputBlockType = InputBlockProps & InputBlockState & InputBlockMethods;
export type InputBlockProps = {
	type: 'textInput';
	initialValue?: string;
	placeholder?: string;
	label?: string;
};

export type InputBlockState = {
	value?: string;
};

export type InputBlockMethods = { setValue: (value: string) => void };

const StyledInput = styled.div`
	.bp4-form-group {
		margin-bottom: 0;
	}
`;

export function TextInputBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { value, setValue, placeholder } = useValuePlaceholderInitialController();
	const { showInspector } = useBlockContext();

	useDeclareBlockMethods<InputBlockMethods>({ setValue: (newValue: string) => setValue(newValue) }, [setValue]);

	if (hide || !show) return null;

	// TODO "helperText" Helper text with details...
	return (
		<StyledInput style={{ display: 'flex', flexDirection: 'row' }} onContextMenu={showInspector}>
			<InputLabel />
			<InputGroup
				fill
				value={value}
				autoComplete="off"
				placeholder={placeholder}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
		</StyledInput>
	);
}