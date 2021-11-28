import { Button, EditableText, H4, Menu, MenuItem, Popover, Position, Switch } from '@blueprintjs/core';
import { decode } from 'html-entities';
import * as React from 'react';
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useDrawer } from '../../../drawer/hooks/useDrawer';
import { useTopLevelPages } from '../../../drawer/hooks/useTopLevelPages';
import { SwitchMenuItem } from '../../../inspector/components/InspectorItems/SwitchMenuItem';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { useEditor } from '../../hooks/useEditor';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { useCanEdit } from '../../hooks/useIsEditing';
import { usePagesMutations } from './hooks/usePagesMutations';
import { EmojiPicker } from '../../../blocks/components/EmojiPicker';

const StyledEditableText = styled.div`
	input:focus,
	.bp4-editable-text:before,
	.bp4-editable-text:before {
		outline: none;
		box-shadow: none;
	}
`;

const FullscreenButton = styled(Button)`
	color: rgba(0, 0, 0, 0.27) !important;
	.bp4-icon {
		color: rgba(0, 0, 0, 0.27);
	}
`;

export function PageBar({ isModal }: { isModal: boolean }) {
	const { editing, setEditing, page: { id, title, parentId, style } = {}, pageId, globals } = usePageContext();
	const { renamePage, changePageEmoji } = useTopLevelPages();
	const { deletePage } = usePagesMutations();
	const { updateBlockProps } = useEditor();
	const canEdit = useCanEdit();
	const { navigate } = usePageNavigator();
	const [isWide, setIsWide] = useBlockProperty('isWide', false);
	const { setOpen } = useDrawer({ name: 'leftDrawer' });
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
				// backgroundColor: 'rgb(240 240 240)',
				backgroundColor: 'rgb(255 255 255)',
				zIndex: 20,
				height: 40,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				paddingLeft: isModal || isMobile ? 8 : 30,
				paddingRight: 8,
			}}
		>
			<div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
				{isMobile ? <FullscreenButton minimal icon="menu" onClick={() => setOpen(true)} /> : null}
				{isModal ? (
					<FullscreenButton
						minimal
						icon="fullscreen"
						text="Fullscreen"
						onClick={() => navigate(pageId, globals.pageParams)}
					/>
				) : (
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
						<EmojiPicker
							onChange={(emoji) => {
								changePageEmoji({ id: pageId, emoji: emoji?.id });
							}}
						/>
						<H4
							style={{
								fontWeight: 400,
								margin: 0,
							}}
						>
							<StyledEditableText>
								<EditableText
									alwaysRenderInput
									disabled={!editing || !id}
									placeholder="Untitled"
									value={(title === 'Untitled' ? '' : title) || ''}
									onChange={(e) => onChangeHandler(e)}
								/>
							</StyledEditableText>
						</H4>
					</div>
				)}
			</div>
			<div style={{ flexShrink: 1, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
				{!isModal && !isMobile && canEdit ? (
					<Switch
						style={{ margin: 0, marginRight: 8 }}
						label="Editing"
						alignIndicator="right"
						large
						checked={editing}
						onChange={() => setEditing(!editing)}
					/>
				) : null}
				<Popover
					minimal
					content={
						<Menu>
							{isModal && !isMobile && canEdit ? (
								<SwitchMenuItem
									item={{
										icon: 'edit',
										label: 'Editing mode',
										value: editing,
										onChange: () => setEditing(!editing),
										type: 'switch',
									}}
								/>
							) : null}

							<SwitchMenuItem
								item={{
									icon: 'print',
									label: 'Use A4 layout',
									value: style === 'a4',
									onChange: (v) => id && updateBlockProps({ id, style: v ? 'a4' : 'app' }),
									type: 'switch',
								}}
							/>
							{style !== 'a4' ? (
								<SwitchMenuItem
									item={{
										icon: 'print',
										label: 'Full width',
										value: isWide,
										onChange: (v) => setIsWide(!isWide),
										type: 'switch',
									}}
								/>
							) : null}
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
