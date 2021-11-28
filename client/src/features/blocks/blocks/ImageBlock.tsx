import React, { useMemo } from 'react';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useEditor } from '../../editor/hooks/useEditor';
import { BasicBlock } from '../../editor/types/basicBlock';
import { useReferences } from '../../executor/hooks/useReferences';

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
	const { showInspector } = useBlockContext();

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			{state ? <img src={state} style={{ width: '100%' }} /> : <div>Set Source</div>}
		</div>
	);
}
