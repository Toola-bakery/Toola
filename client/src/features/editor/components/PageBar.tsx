import { H4, Switch } from '@blueprintjs/core';
import { decode } from 'html-entities';
import { useCallback } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditor } from '../hooks/useEditor';
import { usePageContext } from '../../executor/hooks/useReferences';

export function PageBar() {
	const { editing, setEditing, page: { id, title } = {} } = usePageContext();

	const { updateBlockProps } = useEditor();
	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			if (id) updateBlockProps({ id, title: decode(e.currentTarget.textContent) });
		},
		[id, updateBlockProps],
	);
	return (
		<div
			style={{
				position: 'sticky',
				top: 0,
				// backgroundColor: 'rgb(240 240 240)',
				backgroundColor: 'rgb(255 255 255)',
				zIndex: 20,
				height: 40,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				paddingLeft: 20,
				paddingRight: 20,
			}}
		>
			<div style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
				<H4 style={{ fontWeight: 400, margin: 0 }}>
					<ContentEditable
						disabled={!editing || !id}
						html={title || ''}
						tagName="span"
						style={{ margin: 0, marginBottom: 10 }}
						onChange={onChangeHandler}
					/>
				</H4>
			</div>
			<div style={{ flexShrink: 1 }}>
				<Switch
					style={{ margin: 0 }}
					label="Editing"
					alignIndicator="right"
					large
					checked={editing}
					onChange={() => setEditing(!editing)}
				/>
			</div>
		</div>
	);
}
