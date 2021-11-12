import { Button, Card, Spinner, Tab, Tabs } from '@blueprintjs/core';
import Monaco from 'monaco-editor';
import { stringify, parse } from 'flatted';
import React, { useRef, useCallback } from 'react';
import safeStringify from 'json-stringify-safe';
import styled from 'styled-components';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { SchemaDrawerWrapper } from '../../../../resources/components/SchemaDrawer/SchemaDrawerWrapper';
import { useSyncBlockState } from '../../../hooks/useSyncBlockState';
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

export function CodeBlock({ block, hide }: CodeBlockComponentProps) {
	const { id, value, manualControl, watchList: watchListProp } = block;
	const { updateBlockProps } = useEditor();
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

	const { trigger, loading, logs, result } = useFunctionExecutor({
		value,
		watchListProp,
	});

	useSyncBlockState<CodeBlockState>('result', result);
	useSyncBlockState<CodeBlockState>('logs', logs);
	useSyncBlockState<CodeBlockState>('loading', loading);

	useDeclareBlockMethods<CodeBlockMethods>({ trigger }, [trigger]);

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
		<CodeBlockStyles>
			<BlockInspector {...inspectorProps} />
			<SchemaDrawerWrapper>
				<Tabs id={`CodeBlock:${id}`} animate={false}>
					<Tab style={{ marginTop: 0 }} id="code" title="Code" panel={<MonacoEditor onEditorMount={onEditorMount} />} />
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
							text="Run CODE"
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
