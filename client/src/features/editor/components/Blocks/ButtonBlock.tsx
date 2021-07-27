import Button from '@material-ui/core/Button';
import JSONTree from 'react-json-tree';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferenceEvaluator, useReferences } from '../../hooks/useReferences';
import { UpdateProperties } from '../Inspector/UpdateProperties';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type ButtonBlockType = ButtonBlockProps;
export type ButtonBlockProps = {
	type: 'button';
	value: string;
	name: string;
};

export function ButtonBlock({ block }: { block: BasicBlock & ButtonBlockType }): JSX.Element {
	const { id, value, name } = block;

	const { evaluate } = useReferenceEvaluator();
	const nameRef = useReferences(name);

	const { onContextMenu, isOpen, close, menu } = useBlockInspectorState(
		id,
		[
			{
				key: 'Name',
				next: ({ block: _block }) => (
					<UpdateProperties block={_block} properties={[{ propertyName: 'name', type: 'code' }]} />
				),
			},
			{
				key: 'Trigger',
				next: ({ block: _block }) => (
					<UpdateProperties block={_block} properties={[{ propertyName: 'value', type: 'code' }]} />
				),
			},
		],
		[],
	);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
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
