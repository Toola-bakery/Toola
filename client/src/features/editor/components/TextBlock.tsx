import { KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditor } from '../hooks/useEditor';
import { useEventListener } from '../hooks/useEvents';
import { TextBlockType } from '../types';
import { useRefLatest } from '../../../hooks/useRefLatest';
import { getCaretIndex } from '../helpers/getCaretIndex';
import { useBlockMenu } from '../hooks/useBlockMenu';
import { selectBlockNeighborsProps } from '../redux/editor';
import { useAppSelector } from '../../../redux/hooks';
import { useReferences } from '../hooks/useReferences';

const CMD_KEY = '/';

export type EditableBlockProps = {
	block: TextBlockType;
};

export function TextBlock({ block: { id, value: _value = '', parentId } }: EditableBlockProps): JSX.Element {
	const { updateBlockProps, addBlockAfter, deleteBlock } = useEditor();
	const [isEditing, setEditing] = useState(false);
	const addBlockAfterRef = useRefLatest(addBlockAfter);
	const deleteBlockRef = useRefLatest(deleteBlock);
	const textRef = useRefLatest(_value);

	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, id));
	const previousRef = useRefLatest(previous);

	const contentEditable = useRef<HTMLElement>(null);

	const { open } = useBlockMenu();
	const openRef = useRefLatest(open);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => updateBlockProps({ id, value: e.currentTarget.textContent }),
		[id, updateBlockProps],
	);

	useEventListener(id, (event) => event.eventName === 'focus' && contentEditable?.current?.focus(), []);

	const onKeyDownHandler = useCallback<KeyboardEventHandler>(
		(e) => {
			if (e.key === CMD_KEY) {
				if (!contentEditable.current) return;
				openRef.current(contentEditable.current).then((v) => {
					updateBlockProps({
						id,
						language: 'javascript',
						type: v as 'text' | 'code',
						value: '',
					});
				});
			}
			if (e.key === 'Enter' && !e.shiftKey) {
				if (!contentEditable.current) return;
				const index = getCaretIndex(contentEditable.current);
				addBlockAfterRef.current(id, {
					id: Math.random().toString(),
					type: 'text',
					parentId,
					value: textRef.current.slice(index),
				});
				updateBlockProps({ id, value: textRef.current.slice(0, index) });
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
								id: previousRef.current.id,
								value: previousRef.current.value + textRef.current,
							},
							true,
						);
				}
			}
		},
		[addBlockAfterRef, deleteBlockRef, id, openRef, parentId, previousRef, textRef, updateBlockProps],
	);

	const html = useReferences(_value);
	const htmlString = typeof html === 'string' ? html : JSON.stringify(html);

	return (
		<ContentEditable
			className="Block"
			onFocus={() => setEditing(true)}
			onBlur={() => setEditing(false)}
			innerRef={contentEditable}
			html={isEditing ? _value : htmlString}
			tagName="p"
			onChange={onChangeHandler}
			onKeyDown={onKeyDownHandler}
		/>
	);
}
