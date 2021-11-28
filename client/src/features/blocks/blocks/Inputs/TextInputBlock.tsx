import { InputGroup } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../../editor/hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../editor/hooks/useDeclareBlockMethods';
import { InputLabel } from '../../components/InputLabel';
import { useValuePlaceholderInitialController } from './hooks/useValuePlaceholderInitialController';

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
		<div onContextMenu={showInspector}>
			<InputLabel>
				<InputGroup
					fill
					value={value}
					autoComplete="off"
					placeholder={placeholder}
					onChange={(e) => {
						setValue(e.target.value);
					}}
				/>
			</InputLabel>
		</div>
	);
}
