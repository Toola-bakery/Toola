import React, { KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { decode } from 'html-entities';
import { useEditor } from '../../hooks/useEditor';
import { useEventListener } from '../../hooks/useEvents';
import { BasicBlock } from '../../types/basicBlock';
import { useRefsLatest } from '../../../../hooks/useRefLatest';
import { getCaretGlobalPosition, getCaretIndex } from '../../helpers/caretOperators';
import { selectBlockNeighborsProps } from '../../redux/editor';
import { useAppSelector } from '../../../../redux/hooks';
import { usePageContext, useReferences } from '../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';

const CMD_KEY = '/';

export type TextBlockType = TextBlockProps;

export type TextBlockStyles = 'text' | 'heading1' | 'heading2' | 'heading3';

const textBlockStyleTag = {
	text: 'p',
	heading1: 'h1',
	heading2: 'h2',
	heading3: 'h3',
};

export type TextBlockProps = { type: 'text'; style?: TextBlockStyles; value: string };

export function TextBlock({ block }: { block: BasicBlock & TextBlockType }) {
	const { id, value: realValue = '', style } = block;
	const [value, setValue] = useState(realValue);
	const {
		page: { editing },
	} = usePageContext();

	const { updateBlockProps, updateBlockType, addBlockAfter, deleteBlock } = useEditor();
	const [isEditing, setEditing] = useState(false);

	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, id));

	const contentEditable = useRef<HTMLElement>(null);

	const { addBlockAfterRef, deleteBlockRef, previousRef, isEditingRef, valueRef } = useRefsLatest({
		previous,
		addBlockAfter,
		updateBlockType,
		deleteBlock,
		value,
		isEditing,
	});

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			setValue(e.target.value);
			updateBlockProps({ id, value: decode(e.currentTarget.textContent) });
		},
		[id, updateBlockProps],
	);

	useEventListener(id, (event) => event.eventName === 'focus' && contentEditable?.current?.focus(), []);

	const { onContextMenu, inspectorProps } = useBlockInspectorState([]);
	const onKeyDownHandler: KeyboardEventHandler = (e) => {
		if (e.key === CMD_KEY) {
			if (!contentEditable.current) return;
			const position = getCaretGlobalPosition();
			if (position) inspectorProps.open(position.left, position.top, ['Turn into']);
		}
		if (e.key === 'Enter' && !e.shiftKey) {
			if (!contentEditable.current) return;
			const index = getCaretIndex(contentEditable.current);
			addBlockAfterRef.current(id, {
				type: 'text',
				value: valueRef.current.slice(index),
			});
			updateBlockProps({ id, value: valueRef.current.slice(0, index) });
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
							value: previousRef.current.value + valueRef.current,
						},
						true,
					);
			}
		}
	};

	const html = useReferences(isEditing ? '' : realValue);

	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));

	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
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
				tagName={textBlockStyleTag[style || 'text']}
				style={{ margin: 0, marginBottom: 10 }}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
