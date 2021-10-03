import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { decode } from 'html-entities';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { BasicBlock } from '../../../types/basicBlock';
import { useRefLatest } from '../../../../../hooks/useRefLatest';
import { usePageContext, useReferences } from '../../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { useTextBlockOnKeyDownHandler } from './useTextBlockOnKeyDownHandler';

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
	const { editing } = usePageContext();
	const { updateBlockProps } = useEditor();
	const [isEditing, setEditing] = useState(false);
	const isEditingRef = useRefLatest(isEditing);

	useEffect(() => {
		setValue(realValue);
	}, [realValue]);

	const contentEditableRef = useRef<HTMLElement>(null);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			setValue(e.target.value);
			updateBlockProps({ id, value: decode(e.currentTarget.textContent) });
		},
		[id, updateBlockProps],
	);
	const { onContextMenu, inspectorProps } = useBlockInspectorState([]);

	const { onKeyDownHandler } = useTextBlockOnKeyDownHandler({ contentEditableRef, inspectorProps });

	useEventListener(
		id,
		(event) => {
			if (event.action === 'focus') contentEditableRef?.current?.focus();
		},
		[],
	);

	const html = useReferences(isEditing ? '' : realValue);

	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));

	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<ContentEditable
				disabled={!editing}
				onContextMenu={onContextMenu}
				className={`Block ${textBlockStyleTag[style || 'text'] !== 'p' ? 'bp4-heading' : 'bp4-text-large'}`}
				onFocus={() => {
					if (!isEditingRef.current) setEditing(true);
				}}
				onBlur={() => isEditingRef.current && setEditing(false)}
				innerRef={contentEditableRef}
				html={isEditing ? value : htmlString}
				tagName={textBlockStyleTag[style || 'text']}
				style={{ margin: 0, marginBottom: 10 }}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
