import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { getCaretIndex, setCaretPosition } from '../../../helpers/caretOperators';
import { useEditor } from '../../../hooks/useEditor';
import { useEventListener } from '../../../hooks/useEvents';
import { BasicBlock } from '../../../types/basicBlock';
import { usePageContext, useReferences } from '../../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../../inspector/hooks/useBlockInspectorState';
import { concatEntities, entitiesToHTML, htmlToEntities, sliceEntities } from './plugins/TextEntitiesMutation';
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
	const [isFocused, setIsFocused] = useState(false);

	const htmlValue = useMemo<string>(() => entitiesToHTML(value, entities), [value, entities]);

	const contentEditableRef = useRef<HTMLElement>(null);

	const setToPosRef = useRef<number | null>(null);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			if (!contentEditableRef.current) return;
			setToPosRef.current = getCaretIndex(contentEditableRef.current);
			const [text, newEntities] = htmlToEntities(e.target.value);
			updateBlockProps({ id, value: text, entities: newEntities });
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

	const { onKeyDownHandler } = useTextBlockOnKeyDownHandler({
		contentEditableRef,
		inspectorProps,
	});

	useEventListener<{ position?: number }>(
		id,
		(event) => {
			if (event.action === 'focus') contentEditableRef?.current?.focus();
			if (typeof event.position === 'number') setToPosRef.current = event.position;
		},
		[],
	);

	const html = useReferences(isFocused ? '' : htmlValue);
	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));
	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<ContentEditable
				disabled={!editing}
				onContextMenu={onContextMenu}
				className={`Block ${textBlockStyleTag[style || 'text'] !== 'p' ? 'bp4-heading' : 'bp4-text-large'}`}
				onFocus={(e) => {
					setIsFocused(true);
				}}
				onBlur={() => setIsFocused(false)}
				innerRef={contentEditableRef}
				html={isFocused ? htmlValue : htmlString}
				tagName={textBlockStyleTag[style || 'text']}
				style={{ margin: 0, marginBottom: 10, whiteSpace: 'pre-wrap' }}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
		</>
	);
}
