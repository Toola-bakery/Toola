import { show } from '@blueprintjs/core/lib/esnext/components/context-menu/contextMenu';
import React, { useMemo } from 'react';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useEditor } from '../../editor/hooks/useEditor';
import { BasicBlock } from '../../editor/types/basicBlock';
import { useReferences } from '../../executor/hooks/useReferences';

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
	const { showInspector } = useBlockContext();

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			{Object.entries(state || {}).map(([key, valueOfKey]) => (
				<div key={key} style={{ wordBreak: 'break-word' }}>
					<b>{key}</b>: {`${valueOfKey}`}
				</div>
			))}
		</div>
	);
}
