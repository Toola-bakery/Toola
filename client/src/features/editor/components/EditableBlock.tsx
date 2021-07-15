import { KeyboardEventHandler, useCallback, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useEditor } from '../hooks/useEditor';
import { useEventListener } from '../hooks/useEvents';
import { TextBlockType } from '../types';
import { useRefLatest } from '../../../hooks/useRefLatest';
import { getCaretIndex } from '../helpers/getCaretIndex';
import { useBlockMenu } from '../hooks/useBlockMenu';
import { selectBlockNeighbors } from '../redux/editor';
import { useAppSelector } from '../../../redux/hooks';

const CMD_KEY = '/';

export type EditableBlockProps = {
	block: TextBlockType;
};

export function EditableBlock({ block: { id, html: _html = '', parentId } }: EditableBlockProps): JSX.Element {
	const { updateBlock, addBlockAfter, deleteBlock } = useEditor();
	const addBlockAfterRef = useRefLatest(addBlockAfter);
	const deleteBlockRef = useRefLatest(deleteBlock);
	const textRef = useRefLatest(_html);

	const { previous } = useAppSelector(state => selectBlockNeighbors(state, id));
	const previousRef = useRefLatest(previous);

	const contentEditable = useRef<HTMLElement>(null);
	const tag = 'p';

	const { open } = useBlockMenu();
	const openRef = useRefLatest(open);

	const onChangeHandler = useCallback(e => updateBlock({ id, html: e.target.value }), [id, updateBlock]);

	useEventListener(id, event => event.eventName === 'focus' && contentEditable?.current?.focus(), []);

	const onKeyDownHandler = useCallback<KeyboardEventHandler>(
		e => {
			if (e.key === CMD_KEY) {
				if (!contentEditable.current) return;
				openRef.current(contentEditable.current).then(v => {
					updateBlock({
						id,
						language: 'javascript',
						type: v as 'text' | 'code',
						source: '',
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
					html: textRef.current.slice(index),
				});
				updateBlock({ id, html: textRef.current.slice(0, index) });
				e.preventDefault();
			}
			if (e.key === 'Backspace') {
				if (!contentEditable.current) return;
				const index = getCaretIndex(contentEditable.current);
				if (index === 0) {
					e.preventDefault();
					deleteBlockRef.current(id);
					if (previousRef.current?.type === 'text')
						updateBlock(
							{
								id: previousRef.current.id,
								html: previousRef.current.html + textRef.current,
							},
							true,
						);
				}
			}
		},
		[addBlockAfterRef, deleteBlockRef, id, openRef, parentId, previousRef, textRef, updateBlock],
	);

	return (
		<ContentEditable
			className="Block"
			innerRef={contentEditable}
			html={_html}
			tagName={tag}
			onChange={onChangeHandler}
			onKeyDown={onKeyDownHandler}
		/>
	);
}
