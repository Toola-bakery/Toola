import React, { useRef, MutableRefObject, useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { BasicBlock, CodeBlockType } from '../../../types';
import { useFunctionExecutor } from '../../../../executor/hooks/useExecutor';
import { Editor } from './Editor';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { BlockInspector } from '../../Inspector/BlockInspector';

export type CodeBlockComponentProps = {
	block: BasicBlock & CodeBlockType;
};

export function CodeBlock({ block }: CodeBlockComponentProps): JSX.Element {
	const { id, pageId, value, language, logs = [], result } = block;
	const { updateBlockProps, updateBlockState } = useEditor();
	const editorRef = useRef() as MutableRefObject<Copenhagen.Editor>;

	const [showLogs, setShowLogs] = useState(false);

	useEventListener(id, (event) => event.eventName === 'focus' && editorRef.current?.focus(), []);

	const listener = useCallback<Parameters<typeof useFunctionExecutor>[0]>(
		(data) => {
			if (data.result) updateBlockState({ id, pageId, result: data.result });
			else updateBlockState({ id, pageId, logs: [...logs, data.data] });
		},
		[id, logs, pageId, updateBlockState],
	);

	const { runCode } = useFunctionExecutor(listener);

	const onEditorReady = useCallback(() => {
		if (!editorRef.current) return;
		editorRef.current.on('change', (_, v) => {
			updateBlockProps({ id, pageId, value: v });
		});
	}, [editorRef, id, pageId, updateBlockProps]);

	const { isOpen, close, onContextMenu, menu } = useBlockInspectorState(id, [], []);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<div onContextMenu={onContextMenu}>
				<Editor onEditorReady={onEditorReady} value={value} language={language} editorRef={editorRef} />
				<Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => setShowLogs((v) => !v)}>
					{showLogs ? 'HIDE LOGS' : 'SHOW LOGS'}
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						updateBlockState({ id, pageId, logs: [], result: [] });
						runCode(value);
					}}
				>
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
