import TextField from '@material-ui/core/TextField';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';
import { useEditor } from '../../hooks/useEditor';
import { useOnMountedEffect } from '../../../../hooks/useOnMounted';

export type InputBlockType = InputBlockProps & InputBlockState;
export type InputBlockProps = {
	type: 'input';
	initialValue: string;
	label: string;
};
export type InputBlockState = {
	value?: string;
};

export function InputBlock({ block }: { block: BasicBlock & InputBlockType }): JSX.Element {
	const { id, value, pageId, label, initialValue } = block;

	const { updateBlockState, updateBlockProps } = useEditor();

	useOnMountedEffect(() => {
		updateBlockState({ id, value: initialValue });
	});

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			key: 'Label',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, label: v }),
			value: label,
		},
		{
			key: 'Initial Value',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, initialValue: v }),
			value: label,
		},
	]);

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
						updateBlockState({ id, value: e.target.value });
					}}
				/>
			</div>
		</>
	);
}
