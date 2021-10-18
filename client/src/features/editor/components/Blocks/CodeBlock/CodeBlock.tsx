import { Button, Card, Spinner, Tab, Tabs } from '@blueprintjs/core';
import Monaco from 'monaco-editor';
import { stringify, parse } from 'flatted';
import React, { useRef, useCallback, useState, useMemo } from 'react';
import safeStringify from 'json-stringify-safe';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { GlobalsTab } from '../../../../devtools/components/Globals/GlobalsTab';
import { QueriesTab } from '../../../../devtools/components/Queries/QueriesTab';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { WatchList } from '../../../../executor/hooks/useWatchList';
import { BasicBlock } from '../../../types/basicBlock';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { MonacoEditor } from './MonacoEditor';

export type CodeBlockType = CodeBlockProps & CodeBlockState & CodeBlockMethods;
export type CodeBlockProps = {
	type: 'code';
	value: string;
	language: 'javascript';
	manualControl: boolean;
	watchList?: WatchList;
};
export type CodeBlockState = {
	result?: unknown;
	logs?: string[];
	loading?: boolean;
};

export type CodeBlockMethods = { trigger: () => void };

export type CodeBlockComponentProps = {
	block: BasicBlock & CodeBlockType;
	hide: boolean;
};

export function CodeBlock({ block, hide }: CodeBlockComponentProps) {
	const { id, value, manualControl, watchList: watchListProp } = block;
	const { updateBlockProps } = useEditor();
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

	const { trigger, loading, logs, result } = useFunctionExecutor({
		value,
		watchListProp,
	});

	useBlockSetState<CodeBlockState>('result', result);
	useBlockSetState<CodeBlockState>('logs', logs);
	useBlockSetState<CodeBlockState>('loading', loading);

	useDeclareBlockMethods<CodeBlockMethods>(id, { trigger }, [trigger]);

	const onEditorMount = useCallback(
		(editor?: Monaco.editor.IStandaloneCodeEditor) => {
			if (!manualControl) trigger();

			if (!editor) {
				editorRef.current = null;
				return;
			}
			// monaco?.languages.t
			editorRef.current = editor;
		},
		[editorRef, manualControl, trigger],
	);

	useOnMountedEffect(() => {
		if (!block.show) onEditorMount();
	});

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			type: 'switch',
			label: 'Manual control',
			onChange: (nextValue: boolean) => updateBlockProps({ id, manualControl: nextValue }),
			value: block.manualControl,
		},
	]);

	const isHide = hide || !block.show;
	if (isHide) return null;

	const content = (
		<>
			<BlockInspector {...inspectorProps} />

			<Tabs id={`CodeBlock:${id}`} animate={false}>
				<Tab style={{ marginTop: 0 }} id="code" title="Code" panel={<MonacoEditor onEditorMount={onEditorMount} />} />
				<Tab
					id="logs"
					title="Logs"
					panel={
						<div>
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
						text="Run CODE"
					/>
				</div>
			</Tabs>
		</>
	);

	return block.parentId === 'queries' ? (
		<div style={{ height: '100%' }}>{content}</div>
	) : (
		<Card style={{ height: '100%' }}>{content}</Card>
	);
}
