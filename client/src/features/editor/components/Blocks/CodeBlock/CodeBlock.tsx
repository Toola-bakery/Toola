import React, { useRef, MutableRefObject, useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { CodeBlockType } from '../../../types';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { Editor } from './Editor';

export type CodeBlockComponentProps = {
	block: CodeBlockType;
};

export function CodeBlock({ block }: CodeBlockComponentProps): JSX.Element {
	const { id, value, language, logs = [], result } = block;
	const { updateBlockProps, updateBlockState } = useEditor();
	const editorRef = useRef() as MutableRefObject<Copenhagen.Editor>;

	const [showLogs, setShowLogs] = useState(false);

	useEventListener(id, (event) => event.eventName === 'focus' && editorRef.current?.focus(), []);

	const listener = useCallback<Parameters<typeof useFunctionExecutor>[0]>(
		(data) => {
			if (data.result) updateBlockState({ id, result: data.result });
			else updateBlockState({ id, logs: [...logs, data.data] });
		},
		[id, logs, updateBlockState],
	);

	const { runCode, lastEvent } = useFunctionExecutor(listener);

	const onEditorReady = useCallback(() => {
		if (!editorRef.current) return;
		editorRef.current.on('change', (_, v) => {
			updateBlockProps({ id, value: v });
		});
	}, [editorRef, id, updateBlockProps]);

	return (
		<div>
			<Editor onEditorReady={onEditorReady} value={value} language={language} editorRef={editorRef} />
			<Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => setShowLogs((v) => !v)}>
				{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}
			</Button>
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					updateBlockState({ id, logs: [], result: [] });
					runCode(value);
				}}
			>
				Run CODE
			</Button>
			{showLogs ? (
				<pre>
					{id}
					{logs.join('')}
					{JSON.stringify(result)}
				</pre>
			) : null}
		</div>
	);
}
