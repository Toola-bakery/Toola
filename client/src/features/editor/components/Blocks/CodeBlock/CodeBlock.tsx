import { Button, Card } from '@blueprintjs/core';
import Monaco from 'monaco-editor';
import { stringify, parse } from 'flatted';
import React, { useRef, useCallback, useState, useMemo } from 'react';
import Editor, { OnChange } from '@monaco-editor/react';
import safeStringify from 'json-stringify-safe';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { WatchList } from '../../../../executor/hooks/useWatchList';
import { BasicBlock } from '../../../types/basicBlock';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { setupMonaco } from './setupMonaco';

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
};

export function CodeBlock({ block }: CodeBlockComponentProps): JSX.Element {
	const { id, value, manualControl, watchList: watchListProp } = block;
	const { updateBlockProps } = useEditor();
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

	const { blocks, globals } = usePageContext();

	const blocksType = useMemo(
		() =>
			Object.keys(blocks)
				.map((v) => `'${v}'`)
				.join(' | '),
		[blocks],
	);

	const globalsType = useMemo(
		() =>
			Object.keys(globals)
				.map((v) => `'${v}'`)
				.join(' | '),
		[globals],
	);

	const [showLogs, setShowLogs] = useState(false);

	const { editing } = usePageContext();

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
	const onEditorChange = useCallback<OnChange>((v) => updateBlockProps({ id, value: v }), [id, updateBlockProps]);

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

	if (!block.show) return <></>;

	return (
		<Card>
			<BlockInspector {...inspectorProps} />
			<div>
				<Editor
					height="50vh"
					wrapperClassName=""
					onMount={onEditorMount}
					defaultValue={value}
					onChange={onEditorChange}
					beforeMount={(monaco) => {
						setupMonaco(monaco);
						monaco.languages.typescript.javascriptDefaults.addExtraLib(
							[
								'declare module "page-state" {',
								`export function mongo(databaseId: string): {
  find<T = any>(options: {
    collection: string;
    filter?: any;
    project?: any;
    sort?: any;
    limit?: number;
    skip?: number;
  }): T[];

  findOne<T = any>(options: {
    collection: string;
    filter?: any;
    project?: any;
    sort?: any;
    skip?: number;
  }): T;
};

export const pageState: {
  callMethod(blockId: any, method: any, callArgs?: any[]): Promise<any>;
  getProperty(...keys: string[]): Promise<any>;
};`,
								'};',
							].join('\n'),
							'ts:page-state',
						);
					}}
					language="javascript"
				/>
				<Button onClick={() => setShowLogs((v) => !v)} text={showLogs ? 'HIDE LOGS' : 'SHOW LOGS'} />
				<Button loading={loading} onClick={() => trigger()} text="Run CODE" />

				{showLogs ? (
					<pre style={{ wordBreak: 'break-word', overflow: 'scroll' }}>
						{logs.join('')}
						{safeStringify(result, null, '\t')}
					</pre>
				) : null}
			</div>
		</Card>
	);
}
