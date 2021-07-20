import React, { useRef, MutableRefObject, useCallback, useState } from 'react';
import { CodeBlockType } from '../../types';

type EditorProps = {
	onEditorReady: () => void;
	editorRef: MutableRefObject<Copenhagen.Editor>;
	language: CodeBlockType['language'];
	value: CodeBlockType['value'];
};

export class Editor extends React.Component<EditorProps> {
	editorRef: React.RefObject<HTMLDivElement>;

	constructor(props: EditorProps) {
		super(props);

		this.editorRef = React.createRef();
	}

	componentDidMount() {
		const { editorRef, onEditorReady, language, value } = this.props;
		const editor = new Copenhagen.Editor({ language });
		// eslint-disable-next-line no-param-reassign,prefer-destructuring
		editorRef.current = editor;
		if (this.editorRef.current) editor.open(this.editorRef.current);
		if (typeof value !== 'undefined') editor.setValue(value);
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
