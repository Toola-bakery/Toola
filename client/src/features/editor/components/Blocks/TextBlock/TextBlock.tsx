import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { getCaretIndex, setCaretPosition } from '../../../helpers/caretOperators';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { BasicBlock } from '../../../types/basicBlock';
import { useRefLatest } from '../../../../../hooks/useRefLatest';
import { usePageContext, useReferences } from '../../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { entitiesToHTML, htmlToEntities } from './plugins/TextEntitiesMutation';
import { TextEntity } from './plugins/TextPlugins';
import { useTextBlockOnKeyDownHandler } from './useTextBlockOnKeyDownHandler';

export type TextBlockType = TextBlockProps;

export type TextBlockStyles = 'text' | 'heading1' | 'heading2' | 'heading3';

const textBlockStyleTag = {
	text: 'p',
	heading1: 'h1',
	heading2: 'h2',
	heading3: 'h3',
};

export type TextBlockProps = {
	type: 'text';
	style?: TextBlockStyles;
	value: string;
	entities: TextEntity[];
};

export function TextBlock({ block }: { block: BasicBlock & TextBlockType }) {
	const { id, style, entities = [], value } = block;

	const { editing } = usePageContext();
	const { updateBlockProps } = useEditor();
	const [isEditing, setEditing] = useState(false);
	const isEditingRef = useRefLatest(isEditing);

	const [htmlValue, setHtmlValue] = useState<string>(() => entitiesToHTML(value, entities));

	const contentEditableRef = useRef<HTMLElement>(null);

	const setToPosRef = useRef<number | null>(null);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			if (contentEditableRef.current) {
				const caretIndex = getCaretIndex(contentEditableRef.current);
				setHtmlValue(e.target.value);
				setToPosRef.current = caretIndex;

				const [text, newEntities] = htmlToEntities(e.target.value);
				updateBlockProps({ id, value: text, entities: newEntities });
			}
		},
		[id, updateBlockProps],
	);

	useLayoutEffect(() => {
		if (setToPosRef.current !== null && contentEditableRef.current) {
			setCaretPosition(contentEditableRef.current, setToPosRef.current);
			setToPosRef.current = null;
		}
	});

	const { onContextMenu, inspectorProps } = useBlockInspectorState([]);

	const { onKeyDownHandler } = useTextBlockOnKeyDownHandler({ contentEditableRef, inspectorProps });

	useEventListener(
		id,
		(event) => {
			if (event.action === 'focus') contentEditableRef?.current?.focus();
		},
		[],
	);

	const html = useReferences(isEditing ? '' : htmlValue);

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
				html={isEditing ? htmlValue : htmlString}
				tagName={textBlockStyleTag[style || 'text']}
				style={{ margin: 0, marginBottom: 10, whiteSpace: 'pre-wrap' }}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
