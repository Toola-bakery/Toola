import { Button, Card, Pre, Spinner, Tab, Tabs } from '@blueprintjs/core';
import React, { useEffect, useMemo, useState } from 'react';
import safeStringify from 'json-stringify-safe';
import styled from 'styled-components';
import { useNextRenderHook } from '../../../../../hooks/useNextRenderHook';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { SchemaDrawerWrapper } from '../../../../resources/components/SchemaDrawer/SchemaDrawerWrapper';
import { Database } from '../../../../resources/hooks/useResources';
import { useQueryConstructor } from '../../../../inspector/hooks/useQueryConstructor';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useSyncBlockState } from '../../../hooks/useSyncBlockState';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { BasicBlock } from '../../../types/basicBlock';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../hooks/blockInspector/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { CodeBlockState } from '../CodeBlock/CodeBlock';
import { MonacoEditor } from '../CodeBlock/MonacoEditor';

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

const CodeBlockStyles = styled.div`
	height: 100%;

	.bp4-tab-panel {
		margin-top: 0;
		height: calc(100% - 31px);
		min-height: 250px;
	}

	.bp4-tabs {
		height: 100%;
	}

	.bp4-tab-list {
		padding: 0 8px;
		border: 0 solid rgb(237, 237, 237);
		border-bottom-width: 1px;
		align-items: center;
	}
`;

export function QueryBlock({ block, hide }: QueryBlockComponentProps) {
	const { id, manualControl, values } = block;
	const { updateBlockProps } = useEditor();

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

	const code = `const SDK = require('@toola/sdk');

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

	useSyncBlockState<CodeBlockState>('result', result);
	useSyncBlockState<CodeBlockState>('logs', logs);
	useSyncBlockState<CodeBlockState>('loading', loading);

	useDeclareBlockMethods<QueryBlockMethods>({ trigger }, [trigger]);

	const { callNextTime } = useNextRenderHook(trigger);

	useEffect(() => {
		setOnUpdate(() => callNextTime);
	}, [callNextTime, setOnUpdate]);

	useOnMountedEffect(() => {
		if (!manualControl) trigger();
	});

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				type: 'switch',
				label: 'Manual control',
				onChange: (nextValue: boolean) => updateBlockProps({ id, manualControl: nextValue }),
				value: block.manualControl,
			},
		],
		[block.manualControl, id, updateBlockProps],
	);
	useAppendBlockMenu(menu, 1);
	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !block.show) return null;

	const content = (
		<CodeBlockStyles onContextMenu={onContextMenu}>
			<BlockInspector {...inspectorProps} />
			<SchemaDrawerWrapper>
				<Tabs id={`QueryBlock:${id}`} animate={false}>
					<Tab
						style={{ marginTop: 0 }}
						id="code"
						title="Code"
						panel={
							<div>
								{component}
								{component2}
							</div>
						}
					/>
					<Tab
						id="logs"
						title="Logs"
						panel={
							<div style={{ height: '100%', overflowY: 'scroll' }}>
								<pre style={{ wordBreak: 'break-word', overflow: 'scroll' }}>
									{logs.join('')}
									{safeStringify(result, null, '\t')}
								</pre>
							</div>
						}
					/>
					<Tabs.Expander />
					<div style={{ display: 'flex', alignContent: 'center' }}>
						{loading ? <Spinner size={20} /> : null}
						<Button
							intent="primary"
							style={{ marginRight: 8, marginLeft: 8 }}
							onClick={() => trigger()}
							text="Run query"
							small
						/>
					</div>
				</Tabs>
			</SchemaDrawerWrapper>
		</CodeBlockStyles>
	);

	return block.parentId === 'queries' ? (
		<div style={{ height: '100%' }}>{content}</div>
	) : (
		<Card style={{ height: '100%', padding: 0 }}>{content}</Card>
	);
}
