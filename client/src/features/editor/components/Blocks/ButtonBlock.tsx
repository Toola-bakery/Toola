import { Button } from '@blueprintjs/core';
import React from 'react';
import { useBlock } from '../../hooks/useBlock';
import { useBlockProperty } from '../../hooks/useBlockProperty';
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

export function ButtonBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const [value, setValue] = useBlockProperty('value', '');
	const [name, setName] = useBlockProperty('name', '');
	const { evaluate } = useReferenceEvaluator();
	const nameRef = useReferences(name);

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Name',
			type: 'input',
			onChange: (v: string) => setName(v),
			value: name,
		},
		{
			label: 'Trigger',
			type: 'input',
			onChange: (v: string) => setValue(v),
			value,
		},
	]);

	if (hide || !show) return null;

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
