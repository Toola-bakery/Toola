import React, { useRef, MutableRefObject, useCallback } from 'react';
import { useEditor } from '../hooks/useEditor';
import { useEventListener } from '../hooks/useEvents';
import { CodeBlockType } from '../types';

export type CodeBlockProps = {
	block: CodeBlockType;
};
type EditorProps = {
	onEditorReady: () => void;
	editorRef: MutableRefObject<Copenhagen.Editor>;
	language: CodeBlockType['language'];
	source: CodeBlockType['source'];
};

class Editor extends React.Component<EditorProps> {
	editorRef: React.RefObject<HTMLDivElement>;

	constructor(props: EditorProps) {
		super(props);

		this.editorRef = React.createRef();
	}

	componentDidMount() {
		const { editorRef, onEditorReady, language, source } = this.props;
		const editor = new Copenhagen.Editor({ language });
		// eslint-disable-next-line no-param-reassign,prefer-destructuring
		editorRef.current = editor;
		if (this.editorRef.current) editor.open(this.editorRef.current);
		editor.setValue(source);
		onEditorReady();
	}

	shouldComponentUpdate(): boolean {
		return false;
	}

	render() {
		const { language } = this.props;
		return <div ref={this.editorRef} className="editor" data-language={language} data-maxrows="20" />;
	}
}

export function CodeBlock({ block }: CodeBlockProps): JSX.Element {
	const { id, source, language } = block;
	const { updateBlock } = useEditor();
	const editorRef = useRef() as MutableRefObject<Copenhagen.Editor>;

	useEventListener(id, event => event.eventName === 'focus' && editorRef.current?.focus(), []);

	const onEditorReady = useCallback(() => {
		if (!editorRef.current) return;
		editorRef.current.on('change', (_, value) => {
			updateBlock({ id, source: value });
		});
	}, [editorRef, id, updateBlock]);

	return <Editor onEditorReady={onEditorReady} source={source} language={language} editorRef={editorRef} />;
}
