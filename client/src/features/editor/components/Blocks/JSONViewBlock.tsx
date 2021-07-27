import JSONTree from 'react-json-tree';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	value: string;
};

export function JSONViewBlock({ block }: { block: BasicBlock & JSONViewBlockType }): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			key: 'Data Source',
			type: 'input',
			onChange: (v) => {},
			value,
		},
	]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<JSONTree data={state} />
			</div>
		</>
	);
}
