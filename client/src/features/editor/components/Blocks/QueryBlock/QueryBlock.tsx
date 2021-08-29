import { Button, Card } from '@blueprintjs/core';
import React, { useCallback, useEffect, useState } from 'react';
import safeStringify from 'json-stringify-safe';
import { useNextRenderHook } from '../../../../../hooks/useNextRenderHook';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useDatabaseAction } from '../../../../inspector/api/api';
import { useQueryConstructor } from '../../../../inspector/hooks/useQueryConstructor';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { BasicBlock } from '../../../types/basicBlock';
import { FunctionExecutorAction, useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { CodeBlockState } from '../CodeBlock/CodeBlock';

export type QueryBlockType = QueryBlockProps & QueryBlockState & QueryBlockMethods;
export type QueryBlockProps = {
	type: 'query';
	values: { databaseValues?: { id?: string; action?: string }; actionValues?: any };
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
	const { id, manualControl, values } = block;
	const { updateBlockProps, updateBlockState } = useEditor();

	const [showLogs, setShowLogs] = useState(false);

	const [databaseId, setDatabaseId] = useState<string>();

	const { component, value: databaseValues } = useQueryConstructor(
		[
			{ type: 'database', label: 'Database', id: 'id' },
			{ type: 'queryAction', label: 'Action type', id: 'action', databaseId },
		],
		values.databaseValues,
	);

	const { data: databaseAction } = useDatabaseAction(databaseValues.id, databaseValues.action);

	const {
		component: component2,
		value: actionValues,
		result: qResult,
		setOnUpdate,
	} = useQueryConstructor(databaseAction?.fields || [], values.actionValues);

	useEffect(() => {
		if (databaseId !== databaseValues.id) setDatabaseId(databaseValues.id);
	}, [databaseValues, updateBlockProps, databaseId]);

	useEffect(() => {
		updateBlockProps({ id, values: { databaseValues, actionValues } });
	}, [id, databaseValues, actionValues, updateBlockProps]);

	const {
		page: { editing },
	} = usePageContext();

	const code = `const axios = require('axios');
const { getProperty } = require('page-state');

async function main () {
  const resp = await axios.post('http://localhost:8080/mongo/find', ${JSON.stringify(
		{ ...qResult, ...databaseValues },
		null,
		'\t',
	)}).catch(e=>console.log(e.response.data));
  return resp.data;
}`;

	const { trigger, result, loading, logs } = useFunctionExecutor({
		value: code,
	});

	useBlockSetState<CodeBlockState>('result', result);
	useBlockSetState<CodeBlockState>('logs', logs);
	useBlockSetState<CodeBlockState>('loading', loading);

	useDeclareBlockMethods<QueryBlockMethods>(id, { trigger }, [trigger]);

	const { callNextTime } = useNextRenderHook(trigger);

	useEffect(() => {
		setOnUpdate(() => callNextTime);
	}, [callNextTime, setOnUpdate]);

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
		<Card>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{component}
				{component2}
				<Button onClick={() => setShowLogs((v) => !v)}>{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}</Button>
				<Button loading={loading} onClick={() => trigger()}>
					Run CODE
				</Button>
				{showLogs ? (
					<pre style={{ wordBreak: 'break-word', overflow: 'scroll' }}>
						{code}
						{'\n'}
						{logs.join('')}
						{'\n'}
						{safeStringify(result)}
					</pre>
				) : null}
			</div>
		</Card>
	);
}
