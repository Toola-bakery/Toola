import TextField from '@material-ui/core/TextField';
import React, { useCallback } from 'react';
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

export function InputBlock({ block }: { block: BasicBlock & InputBlockType }): JSX.Element {
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

	if (!block.show) return <></>;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<TextField
					id="outlined-basic"
					sx={{ width: '100%' }}
					label={label || id}
					variant="outlined"
					value={value}
					autoComplete="off"
					onChange={(e) => {
						setValue(e.target.value);
					}}
				/>
			</div>
		</>
	);
}
