import React, { useRef, MutableRefObject, useCallback, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { usePageContext } from '../../../hooks/useReferences';
import { BasicBlock } from '../../../types/basicBlock';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { Editor } from './Editor';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { BlockInspector } from '../../Inspector/BlockInspector';

export type CodeBlockType = CodeBlockProps & CodeBlockState & CodeBlockMethods;
export type CodeBlockProps = {
	type: 'code';
	value: string;
	language: 'javascript';
	manualControl: boolean;
};
export type CodeBlockState = {
	result?: unknown;
	logs?: string[];
};

export type CodeBlockMethods = { trigger: () => void };

export type CodeBlockComponentProps = {
	block: BasicBlock & CodeBlockType;
};

export function CodeBlock({ block }: CodeBlockComponentProps): JSX.Element {
	const { id, value, language, logs = [], result, manualControl } = block;
	const { updateBlockProps, updateBlockState } = useEditor();
	const editorRef = useRef() as MutableRefObject<Copenhagen.Editor>;

	const [showLogs, setShowLogs] = useState(false);

	const {
		page: { editing },
	} = usePageContext();

	useEventListener(id, (event) => event.eventName === 'focus' && editorRef.current?.focus(), []);

	const listener = useCallback<Parameters<typeof useFunctionExecutor>[0]>(
		(data) => {
			if (data.result) updateBlockState({ id, result: data.result });
			else updateBlockState({ id, logs: [...logs, data.data] });
		},
		[id, logs, updateBlockState],
	);

	const { runCode } = useFunctionExecutor(listener);

	const trigger = useCallback(() => {
		updateBlockState({ id, logs: [], result: [] });
		runCode(value);
	}, [id, runCode, updateBlockState, value]);

	useDeclareBlockMethods<CodeBlockMethods>(id, { trigger }, [trigger]);
	const onEditorReady = useCallback(() => {
		if (!editorRef.current) return;

		editorRef.current.on('change', (_, v) => {
			updateBlockProps({ id, value: v });
		});

		if (!manualControl) runCode(value);
	}, [editorRef, id, manualControl, runCode, updateBlockProps, value]);

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			type: 'switch',
			label: 'Manual control',
			call: () => updateBlockProps({ id, manualControl: !block.manualControl }),
			value: block.manualControl,
		},
	]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Editor onEditorReady={onEditorReady} value={value} language={language} editorRef={editorRef} />
				<Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => setShowLogs((v) => !v)}>
					{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}
				</Button>
				<Button variant="contained" color="primary" onClick={() => trigger()}>
					Run CODE
				</Button>
				{showLogs ? (
					<pre>
						{logs.join('')}
						{JSON.stringify(result)}
					</pre>
				) : null}
			</div>
		</>
	);
}
