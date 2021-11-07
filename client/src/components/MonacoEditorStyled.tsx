import styled from 'styled-components';
import Editor, { EditorProps } from '@monaco-editor/react';

const MonacoEditorStyles = styled.div`
	.monaco-editor {
		z-index: 9999999;
		.rename-box {
			top: 0;
		}
		.view-overlays .current-line {
			border: none !important;
		}
	}
`;

export const MonacoEditorStyled = (props: EditorProps) => (
	<MonacoEditorStyles>
		<Editor {...props} />
	</MonacoEditorStyles>
);
