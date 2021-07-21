import { useMemo, useRef } from 'react';
import JSONTree from 'react-json-tree';
import { JSONViewBlockType } from '../../types';
import { BlockInspector, BlockInspectorProps } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { UpdateProperties } from '../Inspector/UpdateProperties';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';
import { useEditor } from '../../hooks/useEditor';

export type JSONViewBlockProps = {
	block: JSONViewBlockType;
};

export function JSONViewBlock({ block }: JSONViewBlockProps): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);
	const { deleteBlock } = useEditor();

	const { onContextMenu, isOpen, close, menu } = useBlockInspectorState(
		[
			{
				key: 'Data Source',
				next: ({ block: _block, id: _id }) => (
					<UpdateProperties block={_block} properties={[{ propertyName: 'value', type: 'code' }]} />
				),
			},
			{
				key: 'Delete',
				call: () => deleteBlock(id),
			},
		],
		[deleteBlock, id],
	);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<div onContextMenu={onContextMenu}>
				<JSONTree data={state} />
			</div>
		</>
	);
}
