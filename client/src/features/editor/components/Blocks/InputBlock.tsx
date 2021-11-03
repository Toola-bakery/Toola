import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TextInput } from '../../../ui/components/TextInput';
import { useDeclareBlockMethods } from '../../hooks/useDeclareBlockMethods';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';
import { useEditor } from '../../hooks/useEditor';
import { useOnMountedEffect } from '../../../../hooks/useOnMounted';

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

export function InputBlock({ block, hide }: { block: BasicBlock & InputBlockType; hide: boolean }) {
	const { id, value, pageId, label, initialValue } = block;

	const { updateBlockState, updateBlockProps } = useEditor();

	const { evaluate } = useReferenceEvaluator();

	useOnMountedEffect(() => {
		updateBlockState({ id, value: evaluate(initialValue) });
	});

	const setValue = useCallback<InputBlockMethods['setValue']>(
		(v) => {
			updateBlockState({ id, value: v });
		},
		[id, updateBlockState],
	);

	useDeclareBlockMethods<InputBlockMethods>(id, { setValue }, [setValue]);
	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Label',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, label: v }),
			value: label,
		},
		{
			label: 'Initial Value',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, initialValue: v }),
			value: initialValue,
		},
	]);

	if (hide || !block.show) return <></>;

	// TODO "helperText" Helper text with details...
	return (
		<>
			<BlockInspector {...inspectorProps} />
			<StyledInput onContextMenu={onContextMenu}>
				<TextInput
					label={label}
					fill
					value={value}
					inline
					autoComplete="off"
					onChange={(e) => {
						setValue(e.target.value);
					}}
				/>
			</StyledInput>
		</>
	);
}
