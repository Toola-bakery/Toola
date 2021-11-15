import { InputGroup, TextArea } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { useBlock } from '../../../hooks/useBlock';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../hooks/blockInspector/useBlockInspectorState';
import { InputLabel } from '../../componentsWithLogic/InputLabel';
import { useValuePlaceholderInitialController } from './hooks';

export type InputBlockType = InputBlockProps & InputBlockState & InputBlockMethods;
export type InputBlockProps = {
	type: 'input';
	initialValue: string;
	label: string;
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

export function TextAreaBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { value, setValue } = useValuePlaceholderInitialController();
	useDeclareBlockMethods<InputBlockMethods>({ setValue: (newValue: string) => setValue(newValue) }, [setValue]);

	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !show) return <></>;

	// TODO "helperText" Helper text with details...
	return (
		<>
			<BlockInspector {...inspectorProps} />
			<StyledInput style={{ display: 'flex', flexDirection: 'row' }} onContextMenu={onContextMenu}>
				<InputLabel />
				<TextArea
					fill
					value={value}
					autoComplete="off"
					onChange={(e) => {
						setValue(e.target.value);
					}}
				/>
			</StyledInput>
		</>
	);
}
