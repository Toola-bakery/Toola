import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useQueryConstructor } from '../../../../inspector/hooks/useQueryConstructor';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { BasicBlock } from '../../../types/basicBlock';
import { FunctionExecutorAction, useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';

export type QueryBlockType = QueryBlockProps & QueryBlockState & QueryBlockMethods;
export type QueryBlockProps = {
	type: 'query';
	values: any;
	manualControl: boolean;
};

export type QueryBlockState = {
	result?: unknown;
	logs?: string[];
	loading?: boolean;
};

export type QueryBlockMethods = { trigger: () => void };

export type QueryBlockComponentProps = {
	block: BasicBlock & QueryBlockType;
};

export function QueryBlock({ block }: QueryBlockComponentProps) {
	const { id, logs = [], result, manualControl, values } = block;
	const { updateBlockProps, updateBlockState } = useEditor();

	const [showLogs, setShowLogs] = useState(false);

	const {
		component,
		value,
		result: qResult,
	} = useQueryConstructor(
		[
			{ type: 'string', label: 'Database Id', id: 'id' },
			{ type: 'string', label: 'Collection', id: 'collection' },
			{ type: 'object', label: 'Filter', id: 'filter' },
			{ type: 'object', label: 'Project', id: 'project' },
			{ type: 'object', label: 'Sort', id: 'sort' },
			{ type: 'number', label: 'Limit', id: 'limit' },
			{ type: 'number', label: 'Skip', id: 'skip' },
		],
		values,
	);

	useEffect(() => {
		updateBlockProps({ id, values: value });
	}, [id, value, updateBlockProps]);

	const {
		page: { editing },
	} = usePageContext();

	const listener = useCallback<(data: FunctionExecutorAction) => void>(
		(data) => {
			if (data.result) updateBlockState({ id, result: data.result, loading: false });
			else updateBlockState({ id, logs: [...logs, data.data] });
		},
		[id, logs, updateBlockState],
	);

	const onTrigger = useCallback(() => {
		updateBlockState({ id, logs: [], loading: true });
	}, [id, updateBlockState]);

	const code = `const axios = require('axios');
const { getProperty } = require('page-state');

async function main () {
  const resp = await axios.post('http://localhost:8080/mongo/find', ${JSON.stringify(
		qResult,
		null,
		'\t',
	)}).catch(e=>console.log(e.response.data));
  return resp.data;
}`;

	const { trigger } = useFunctionExecutor({
		listener,
		value: code,
		onTrigger,
	});

	useDeclareBlockMethods<QueryBlockMethods>(id, { trigger }, [trigger]);

	useOnMountedEffect(() => {
		if (!manualControl) trigger();
	});

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			type: 'switch',
			label: 'Manual control',
			onChange: (nextValue: boolean) => updateBlockProps({ id, manualControl: nextValue }),
			value: block.manualControl,
		},
	]);

	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{component}
				<Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => setShowLogs((v) => !v)}>
					{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}
				</Button>
				<Button variant="contained" color="primary" onClick={() => trigger()}>
					Run CODE
				</Button>
				{showLogs ? (
					<pre style={{ wordBreak: 'break-word', overflow: 'scroll' }}>
						{code}
						{'\n'}
						{logs.join('')}
						{'\n'}
						{JSON.stringify(result)}
					</pre>
				) : null}
			</div>
		</>
	);
}
