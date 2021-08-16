import React, { MutableRefObject, MouseEventHandler } from 'react';
import { CodeBlockType } from './CodeBlock';

type EditorProps = {
	id: string;
	onContextMenu?: MouseEventHandler<HTMLDivElement>;
	onEditorReady: () => void;
	editorRef: MutableRefObject<Copenhagen.Editor>;
	language: CodeBlockType['language'];
	value: CodeBlockType['value'];
	disabled?: boolean;
};

export class Editor extends React.Component<EditorProps> {
	editorRef: React.RefObject<HTMLDivElement>;

	constructor(props: EditorProps) {
		super(props);

		this.editorRef = React.createRef();
	}

	componentDidMount() {
		this.initEditor(this.props);
	}

	shouldComponentUpdate(nextProps: EditorProps): boolean {
		const { disabled, editorRef, id } = this.props;

		if (nextProps.id !== id) {
			editorRef.current.close();
			this.initEditor(nextProps);
			return true;
		}

		if (disabled !== nextProps.disabled) {
			if (nextProps.disabled) editorRef.current.disable();
			else editorRef.current.enable();
		}

		return false;
	}

	initEditor(props: EditorProps) {
		const { editorRef, onEditorReady, language, value, onContextMenu } = props;
		const editor = new Copenhagen.Editor({ language });

		editorRef.current = editor;

		if (this.editorRef.current) editor.open(this.editorRef.current);
		editor.on('contextmenu', (_, event) => {
			event.preventDefault();
			onContextMenu?.(event);
		});
		if (typeof value !== 'undefined') editor.setValue(value);
		onEditorReady();
	}

	render() {
		const { language } = this.props;
		return <div ref={this.editorRef} className="editor" data-language={language} data-maxrows="20" />;
	}
}
