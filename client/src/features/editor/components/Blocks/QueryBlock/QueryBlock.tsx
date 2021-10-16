import { Button, Card, Pre } from '@blueprintjs/core';
import React, { useEffect, useMemo, useState } from 'react';
import safeStringify from 'json-stringify-safe';
import { useNextRenderHook } from '../../../../../hooks/useNextRenderHook';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { Database } from '../../../../resources/hooks/useDatabases';
import { useQueryConstructor } from '../../../../inspector/hooks/useQueryConstructor';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { BasicBlock } from '../../../types/basicBlock';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
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
	hide: boolean;
};

export function QueryBlock({ block, hide }: QueryBlockComponentProps) {
	const { id, manualControl, values } = block;
	const { updateBlockProps, updateBlockState } = useEditor();

	const [showLogs, setShowLogs] = useState(false);

	const [databaseId, setDatabaseId] = useState<string>();

	const { component, value: databaseValues } = useQueryConstructor<{ database?: Database; action?: string }>(
		[
			{ type: 'database', label: 'Database', id: 'database' },
			{ type: 'queryAction', label: 'Action type', id: 'action', databaseId },
		],
		values.databaseValues,
	);

	const databaseAction = useMemo(
		() => databaseValues.database?.actions?.find((action) => action.name === databaseValues.action),
		[databaseValues.database, databaseValues.action],
	);

	const {
		component: component2,
		value: actionValues,
		result: qResult,
		setOnUpdate,
	} = useQueryConstructor(databaseAction?.fields || [], values.actionValues);

	useEffect(() => {
		if (databaseId !== databaseValues.database?._id) setDatabaseId(databaseValues.database?._id);
	}, [databaseValues, updateBlockProps, databaseId]);

	useEffect(() => {
		updateBlockProps({ id, values: { databaseValues, actionValues } });
	}, [id, databaseValues, actionValues, updateBlockProps]);

	const { editing } = usePageContext();

	const code = `const SDK = require('@levankvirkvelia/page-state');

async function main () {
  const resp = await SDK
  	.${databaseValues.database?.type}("${databaseValues.database?._id}")
  	.${databaseValues.action}(${JSON.stringify(qResult, null, '\t')});
  return resp;
}`;

	const disabled = !databaseValues.database?._id || !databaseValues?.action;

	const { trigger, result, loading, logs } = useFunctionExecutor({
		value: code,
		disabled,
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

	if (hide || !block.show) return null;

	return (
		<Card>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{component}
				{component2}
				<Button onClick={() => setShowLogs((v) => !v)}>{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}</Button>
				<Button disabled={disabled} loading={loading} onClick={() => trigger()}>
					Run CODE
				</Button>
				{showLogs ? (
					<Pre style={{ wordBreak: 'break-word', overflow: 'scroll', maxHeight: 500 }}>
						{code}
						{'\n'}
						{logs.join('')}
						{'\n'}
						{safeStringify(result)}
					</Pre>
				) : null}
			</div>
		</Card>
	);
}
