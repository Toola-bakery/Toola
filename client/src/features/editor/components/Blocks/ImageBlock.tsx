import React, { useMemo } from 'react';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/blockInspector/useBlockInspectorState';

export type ImageBlockType = ImageBlockProps;
export type ImageBlockProps = {
	type: 'image';
	value: string;
};

export function ImageBlock({ block, hide }: { block: BasicBlock & ImageBlockType; hide: boolean }) {
	const { id, value } = block;

	const state = useReferences(value);
	const { updateBlockProps } = useEditor();

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) => updateBlockProps({ id, value: v }),
				value,
			},
		],
		[id, updateBlockProps, value],
	);
	useAppendBlockMenu(menu, 1);
	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{state ? <img src={state} style={{ width: '100%' }} /> : <div>Set Source</div>}
			</div>
		</>
	);
}
