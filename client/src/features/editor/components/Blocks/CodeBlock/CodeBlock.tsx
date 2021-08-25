import Monaco from 'monaco-editor';
import React, { useRef, MutableRefObject, useCallback, useState, useEffect, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Editor, { OnChange, Monaco as MonacoType } from '@monaco-editor/react';

import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { SateGetEvent } from '../../../hooks/useStateToWS';
import { useWatchList, WatchList } from '../../../../executor/hooks/useWatchList';
import { BasicBlock } from '../../../types/basicBlock';
import { FunctionExecutorAction, useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { liblib } from './test';

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
	const { id, value, logs = [], result, manualControl, watchList: watchListProp } = block;
	const { updateBlockProps, updateBlockState } = useEditor();
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

	const { blocks } = usePageContext();

	const blocksType = useMemo(
		() =>
			Object.keys(blocks)
				.map((v) => `'${v}'`)
				.join(' | '),
		[blocks],
	);

	const [showLogs, setShowLogs] = useState(false);

	const {
		page: { editing },
	} = usePageContext();

	useEventListener(id, (event) => event.eventName === 'focus' && editorRef.current?.focus(), []);

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

	const { trigger } = useFunctionExecutor({
		listener,
		value,
		watchListProp,
		onTrigger,
	});

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
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Editor
					height="50vh"
					wrapperClassName=""
					onMount={onEditorMount}
					defaultValue={value}
					onChange={onEditorChange}
					beforeMount={(monaco) => {
						monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
							...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
							allowSyntheticDefaultImports: false,
							target: monaco.languages.typescript.ScriptTarget.ES5,
							module: monaco.languages.typescript.ModuleKind.CommonJS,
							moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
							skipDefaultLibCheck: true,
							allowJs: true,
							typeRoots: ['./types'],
							allowNonTsExtensions: true,
						});
						monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSuggestionDiagnostics: true });
						const libSource = `declare module 'axios' { ${liblib} }`;
						const libUri = 'ts:axios/index.d.ts';
						monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
						monaco.languages.typescript.javascriptDefaults.addExtraLib(
							[
								'declare var require: {',
								'toUrl(path: string): string;',
								'(moduleName: string): any;',
								'(dependencies: string[], callback: (...args: any[]) => any, errorback?: (err: any) => void): any;',
								'config(data: any): any;',
								'onError: Function;',
								'};',
							].join('\n'),
							'ts:require.d.ts',
						);
						monaco.languages.typescript.javascriptDefaults.addExtraLib(
							[
								'declare module "page-state" {',
								`export function callMethod(blockId: ${blocksType}, method: any, callArgs?: any[]): Promise<any>;`,
								`export function getProperty(blockId: ${blocksType}, property: any): Promise<any>;`,
								'};',
							].join('\n'),
							'ts:page-state',
						);
					}}
					language="javascript"
				/>
				<Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => setShowLogs((v) => !v)}>
					{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}
				</Button>
				<Button variant="contained" color="primary" onClick={() => trigger()}>
					Run CODE
				</Button>
				{showLogs ? (
					<pre style={{ wordBreak: 'break-word', overflow: 'scroll' }}>
						{logs.join('')}
						{JSON.stringify(result)}
					</pre>
				) : null}
			</div>
		</>
	);
}
