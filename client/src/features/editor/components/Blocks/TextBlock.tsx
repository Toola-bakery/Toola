import { KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { decode } from 'html-entities';
import { useEditor } from '../../hooks/useEditor';
import { useEventListener } from '../../hooks/useEvents';
import { BasicBlock, TextBlockType } from '../../types';
import { useRefLatest } from '../../../../hooks/useRefLatest';
import { getCaretIndex } from '../../helpers/getCaretIndex';
import { useBlockMenu } from '../../hooks/useBlockMenu';
import { selectBlockNeighborsProps } from '../../redux/editor';
import { useAppSelector } from '../../../../redux/hooks';
import { useReferences } from '../../hooks/useReferences';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

const CMD_KEY = '/';

export type EditableBlockProps = {
	block: BasicBlock & TextBlockType;
};

export function TextBlock({ block }: EditableBlockProps): JSX.Element {
	const { id, pageId, value: realValue = '', parentId } = block;
	const [value, setValue] = useState(realValue);

	const { updateBlockProps, updateBlockType, addBlockAfter, deleteBlock } = useEditor();
	const [isEditing, setEditing] = useState(false);
	const addBlockAfterRef = useRefLatest(addBlockAfter);
	const updateBlockTypeRef = useRefLatest(updateBlockType);
	const deleteBlockRef = useRefLatest(deleteBlock);
	const valueRef = useRefLatest(value);
	const isEditingRef = useRefLatest(isEditing);

	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, id));
	const previousRef = useRefLatest(previous);

	const contentEditable = useRef<HTMLElement>(null);

	const { open } = useBlockMenu();
	const openRef = useRefLatest(open);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			setValue(e.target.value);
			updateBlockProps({ id, pageId, value: decode(e.currentTarget.textContent) });
		},
		[id, pageId, updateBlockProps],
	);

	useEventListener(id, (event) => event.eventName === 'focus' && contentEditable?.current?.focus(), []);

	const onKeyDownHandler = useCallback<KeyboardEventHandler>(
		(e) => {
			if (e.key === CMD_KEY) {
				if (!contentEditable.current) return;
				openRef.current(contentEditable.current).then((v) => {
					if (!v) return;
					updateBlockTypeRef.current(id, v);
				});
			}
			if (e.key === 'Enter' && !e.shiftKey) {
				if (!contentEditable.current) return;
				const index = getCaretIndex(contentEditable.current);
				addBlockAfterRef.current(id, {
					type: 'text',
					value: valueRef.current.slice(index),
				});
				updateBlockProps({ id, pageId, value: valueRef.current.slice(0, index) });
				e.preventDefault();
			}
			if (e.key === 'Backspace') {
				if (!contentEditable.current) return;
				const index = getCaretIndex(contentEditable.current);
				if (index === 0) {
					e.preventDefault();
					deleteBlockRef.current(id);
					if (previousRef.current?.type === 'text')
						updateBlockProps(
							{
								pageId,
								id: previousRef.current.id,
								value: previousRef.current.value + valueRef.current,
							},
							true,
						);
				}
			}
		},
		[
			openRef,
			updateBlockTypeRef,
			id,
			addBlockAfterRef,
			valueRef,
			updateBlockProps,
			pageId,
			deleteBlockRef,
			previousRef,
		],
	);

	const html = useReferences(isEditing ? '' : realValue);

	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));

	const { isOpen, close, onContextMenu, menu } = useBlockInspectorState(id, [], []);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<ContentEditable
				onContextMenu={onContextMenu}
				className="Block"
				onFocus={(e) => {
					if (!isEditingRef.current) setEditing(true);
				}}
				onBlur={() => isEditingRef.current && setEditing(false)}
				innerRef={contentEditable}
				html={isEditing ? value : htmlString}
				tagName="p"
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
