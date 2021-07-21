import { useMemo, useRef } from 'react';
import JSONTree from 'react-json-tree';
import { BasicBlock, JSONViewBlockType } from '../../types';
import { BlockInspector, BlockInspectorProps } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { UpdateProperties } from '../Inspector/UpdateProperties';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type JSONViewBlockProps = {
	block: BasicBlock & JSONViewBlockType;
};

export function JSONViewBlock({ block }: JSONViewBlockProps): JSX.Element {
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
				<JSONTree data={state} />
			</div>
		</>
	);
}
