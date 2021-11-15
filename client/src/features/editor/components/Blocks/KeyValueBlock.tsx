import React, { useMemo } from 'react';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/blockInspector/useBlockInspectorState';

export type KeyValueBlockType = KeyValueBlockProps;
export type KeyValueBlockProps = {
	type: 'keyValue';
	value: string;
};

export function KeyValueBlock({ block, hide }: { block: BasicBlock & KeyValueBlockType; hide: boolean }) {
	const { id, value } = block;

	const state = useReferences(value);
	const { immerBlockProps } = useEditor();

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<KeyValueBlockProps>(id, (draft) => {
						draft.value = v;
					}),
				value,
			},
		],
		[id, immerBlockProps, value],
	);
	useAppendBlockMenu(menu, 1);
	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{Object.entries(state || {}).map(([key, valueOfKey]) => (
					<div key={key} style={{ wordBreak: 'break-word' }}>
						<b>{key}</b>: {`${valueOfKey}`}
					</div>
				))}
			</div>
		</>
	);
}
