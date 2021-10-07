import { Button, EditableText, H4, Menu, MenuItem, Popover, Position, Switch } from '@blueprintjs/core';
import { decode } from 'html-entities';
import * as React from 'react';
import { useCallback } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import styled from 'styled-components';
import { useTopLevelPages } from '../../../drawer/hooks/useTopLevelPages';
import { useEditor } from '../../hooks/useEditor';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { usePagesMutations } from './hooks/usePagesMutations';

const StyledEditableText = styled.div`
	input:focus,
	.bp4-editable-text:before,
	.bp4-editable-text:before {
		outline: none;
		box-shadow: none;
	}
`;

export function PageBar() {
	const { editing, setEditing, page: { id, title, parentId } = {}, pageId } = usePageContext();
	const { renamePage } = useTopLevelPages();
	const { deletePage } = usePagesMutations();
	const { updateBlockProps } = useEditor();
	const onChangeHandler = useCallback(
		(text: string) => {
			if (id) {
				const newTitle = decode(text);
				updateBlockProps({ id, title: newTitle });
				if (!parentId) renamePage({ id: pageId, title: newTitle });
			}
		},
		[id, pageId, parentId, renamePage, updateBlockProps],
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
					<StyledEditableText>
						<EditableText
							alwaysRenderInput
							disabled={!editing || !id}
							placeholder="Untitled"
							value={(title === 'Untitled' ? '' : title) || ''}
							onChange={(e) => onChangeHandler(e)}
						/>
					</StyledEditableText>
					{/*<ContentEditable*/}
					{/*	disabled={!editing || !id}*/}
					{/*	html={title || ''}*/}
					{/*	tagName="span"*/}
					{/*	style={{ margin: 0, marginBottom: 10 }}*/}
					{/*	onChange={onChangeHandler}*/}
					{/*/>*/}
				</H4>
			</div>
			<div style={{ flexShrink: 1, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
				<Switch
					style={{ margin: 0, marginRight: 8 }}
					label="Editing"
					alignIndicator="right"
					large
					checked={editing}
					onChange={() => setEditing(!editing)}
				/>
				<Popover
					minimal
					content={
						<Menu>
							<MenuItem onClick={() => deletePage(pageId)} icon="trash" text="Delete page" />
						</Menu>
					}
					position={Position.BOTTOM}
				>
					<Button icon="more" minimal />
				</Popover>
			</div>
		</div>
	);
}
