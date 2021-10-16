import { Button } from '@blueprintjs/core';
import React from 'react';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferenceEvaluator, useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';

export type ButtonBlockType = ButtonBlockProps;
export type ButtonBlockProps = {
	type: 'button';
	value: string;
	name: string;
};

export function ButtonBlock({ block, hide }: { block: BasicBlock & ButtonBlockType; hide: boolean }) {
	const { id, value, name } = block;
	const { updateBlockProps } = useEditor();
	const { evaluate } = useReferenceEvaluator();
	const nameRef = useReferences(name);

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
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

	if (hide || !block.show) return <></>;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Button
					fill
					onClick={() => {
						evaluate(value);
					}}
					text={nameRef}
				/>
			</div>
		</>
	);
}
