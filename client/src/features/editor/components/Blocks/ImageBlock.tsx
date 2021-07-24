import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { UpdateProperties } from '../Inspector/UpdateProperties';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type ImageBlockType = ImageBlockProps;
export type ImageBlockProps = {
	type: 'image';
	value: string;
};

export function ImageBlock({ block }: { block: BasicBlock & ImageBlockType }): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);

	const { onContextMenu, isOpen, close, menu } = useBlockInspectorState(
		id,
		[
			{
				key: 'Data Source',
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
				{state ? <img src={state} style={{ width: '100%' }} /> : <div>Set Source</div>}
			</div>
		</>
	);
}
