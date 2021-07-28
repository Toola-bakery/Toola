import Button from '@material-ui/core/Button';
import JSONTree from 'react-json-tree';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferenceEvaluator, useReferences } from '../../hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type ButtonBlockType = ButtonBlockProps;
export type ButtonBlockProps = {
	type: 'button';
	value: string;
	name: string;
};

export function ButtonBlock({ block }: { block: BasicBlock & ButtonBlockType }): JSX.Element {
	const { id, value, name } = block;
	const { updateBlockProps } = useEditor();
	const { evaluate } = useReferenceEvaluator();
	const nameRef = useReferences(name);

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			label: 'Name',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, name: v }),
			value: name,
		},
		{
			label: 'Trigger',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, value: v }),
			value,
		},
	]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Button
					variant="contained"
					color="primary"
					sx={{ width: '100%' }}
					onClick={() => {
						evaluate(value);
					}}
				>
					{nameRef}
				</Button>
			</div>
		</>
	);
}
