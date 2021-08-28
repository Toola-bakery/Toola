import React, { MutableRefObject, MouseEventHandler } from 'react';
import { CodeBlockType } from './CodeBlock';

type EditorProps = {
	onContextMenu?: MouseEventHandler<HTMLDivElement>;
	onEditorReady?: () => void;
	onChange?: (value: string) => void;
	editorRef?: MutableRefObject<Copenhagen.Editor>;
	language: CodeBlockType['language'];
	value: CodeBlockType['value'];
	disabled?: boolean;
};

export class CopenhagenEditor extends React.Component<EditorProps> {
	editorDOMRef: React.RefObject<HTMLDivElement> = React.createRef();

	copenhagenRef: React.MutableRefObject<Copenhagen.Editor | null> = React.createRef();

	onChangeRef: React.MutableRefObject<EditorProps['onChange'] | null> = React.createRef();

	componentDidMount() {
		this.initEditor(this.props);
	}

	shouldComponentUpdate(nextProps: EditorProps): boolean {
		const { disabled } = this.props;

		this.onChangeRef.current = nextProps.onChange;

		if (disabled !== nextProps.disabled) {
			//
			// if (nextProps.id !== id) {
			// 	editorRef.current.close();
			// 	this.initEditor(nextProps);
			// 	return true;
			// }

			if (nextProps.disabled) this.copenhagenRef.current?.disable();
			else this.copenhagenRef.current?.enable();
		}

		return false;
	}

	initEditor(props: EditorProps) {
		const { editorRef, onEditorReady, language, value, onContextMenu } = props;
		const editor = new Copenhagen.Editor({ language });

		if (editorRef) editorRef.current = editor;
		this.copenhagenRef.current = editor;

		this.copenhagenRef.current?.on('change', (_, v) => {
			this.onChangeRef.current?.(v);
		});

		if (this.editorDOMRef.current) editor.open(this.editorDOMRef.current);
		editor.on('contextmenu', (_, event) => {
			event.preventDefault();
			onContextMenu?.(event);
		});

		if (typeof value !== 'undefined') editor.setValue(value);
		onEditorReady?.();
	}

	render() {
		const { language } = this.props;
		return <div ref={this.editorDOMRef} className="editor" data-language={language} data-maxrows="20" />;
	}
}
