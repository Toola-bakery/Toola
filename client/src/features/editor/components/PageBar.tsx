import { H3, Switch } from '@blueprintjs/core';
import { decode } from 'html-entities';
import { useCallback } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditor } from '../hooks/useEditor';
import { usePageContext } from '../../executor/hooks/useReferences';

export function PageBar() {
	const {
		editing,
		setEditing,
		page: { id, title },
	} = usePageContext();

	const { updateBlockProps } = useEditor();
	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			updateBlockProps({ id, title: decode(e.currentTarget.textContent) });
		},
		[id, updateBlockProps],
	);
	return (
		<div
			style={{
				position: 'sticky',
				top: 0,
				backgroundColor: 'rgb(240 240 240)',
				zIndex: 20,
			}}
		>
			<div style={{ flexDirection: 'row', display: 'flex', padding: 20 }}>
				<div style={{ flexGrow: 1 }}>
					<H3 style={{ fontWeight: 400, margin: 0 }}>
						<ContentEditable
							disabled={!editing}
							html={title}
							tagName="span"
							style={{ margin: 0, marginBottom: 10 }}
							onChange={onChangeHandler}
						/>
					</H3>
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
		</div>
	);
}
