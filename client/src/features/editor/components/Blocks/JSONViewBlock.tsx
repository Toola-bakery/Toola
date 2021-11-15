import React, { useMemo } from 'react';
import JSONTree from 'react-json-tree';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/blockInspector/useBlockInspectorState';

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	value: string;
};

export function JSONViewBlock({ block, hide }: { block: BasicBlock & JSONViewBlockType; hide: boolean }) {
	const { id, value } = block;

	const state = useReferences(value);
	const { immerBlockProps } = useEditor();

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<JSONViewBlockProps>(id, (draft) => {
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
				<JSONTree data={state} />
			</div>
		</>
	);
}
