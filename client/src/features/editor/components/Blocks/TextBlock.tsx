import { KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { decode } from 'html-entities';
import { useEditor } from '../../hooks/useEditor';
import { useEventListener } from '../../hooks/useEvents';
import { BasicBlock } from '../../types/basicBlock';
import { useRefsLatest } from '../../../../hooks/useRefLatest';
import { getCaretIndex } from '../../helpers/getCaretIndex';
import { useBlockMenu } from '../../hooks/useBlockMenu';
import { selectBlockNeighborsProps } from '../../redux/editor';
import { useAppSelector } from '../../../../redux/hooks';
import { usePageContext, useReferences } from '../../hooks/useReferences';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

const CMD_KEY = '/';

export type TextBlockType = TextBlockProps;
export type TextBlockProps = { type: 'text'; value: string };

export function TextBlock({ block }: { block: BasicBlock & TextBlockType }): JSX.Element {
	const { id, pageId, value: realValue = '' } = block;
	const [value, setValue] = useState(realValue);
	const {
		page: { editing },
	} = usePageContext();

	const { updateBlockProps, updateBlockType, addBlockAfter, deleteBlock } = useEditor();
	const [isEditing, setEditing] = useState(false);

	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, id));

	const contentEditable = useRef<HTMLElement>(null);

	const { open } = useBlockMenu();

	const { addBlockAfterRef, deleteBlockRef, previousRef, openRef, updateBlockTypeRef, isEditingRef, valueRef } =
		useRefsLatest({
			previous,
			addBlockAfter,
			updateBlockType,
			deleteBlock,
			value,
			isEditing,
			open,
		});

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			setValue(e.target.value);
			updateBlockProps({ id, pageId, value: decode(e.currentTarget.textContent) });
		},
		[id, pageId, updateBlockProps],
	);

	useEventListener(id, (event) => event.eventName === 'focus' && contentEditable?.current?.focus(), []);

	const onKeyDownHandler: KeyboardEventHandler = (e) => {
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
	};

	const html = useReferences(isEditing ? '' : realValue);

	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));

	const { isOpen, close, onContextMenu, menu } = useBlockInspectorState(id, [], []);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<ContentEditable
				disabled={!editing}
				onContextMenu={onContextMenu}
				className="Block"
				onFocus={() => {
					if (!isEditingRef.current) setEditing(true);
				}}
				onBlur={() => isEditingRef.current && setEditing(false)}
				innerRef={contentEditable}
				html={isEditing ? value : htmlString}
				tagName="p"
				style={{ margin: 0, marginBottom: 10 }}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
