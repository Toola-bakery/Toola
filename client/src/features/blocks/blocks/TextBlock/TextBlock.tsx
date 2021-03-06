import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import styled from 'styled-components';
import { encode, decode } from 'html-entities';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { getCaretIndex, getSelection, setCaretPosition } from '../../helpers/caretOperators';
import { useAppendBlockMenu } from '../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../../editor/hooks/useBlockProperty';
import { useEditor } from '../../../editor/hooks/useEditor';
import { useEventListener } from '../../../editor/hooks/useEvents';
import { BasicBlock } from '../../../editor/types/basicBlock';
import { usePageContext, useReferences } from '../../../executor/hooks/useReferences';
import { entitiesToHTML, htmlToEntities } from './plugins/TextEntitiesMutation';
import { TextEntity } from './plugins/TextPlugins';
import { useTextBlockOnKeyDownHandler } from './hooks/useTextBlockOnKeyDownHandler';

export type TextBlockType = TextBlockProps;

const textBlockStyleTag = {
	text: 'p',
	list: 'li',
	heading1: 'h1',
	heading2: 'h2',
	heading3: 'h3',
	heading4: 'h4',
};

export type TextBlockStyles = keyof typeof textBlockStyleTag;

export type TextBlockProps = {
	type: 'text';
	style?: TextBlockStyles;
	value?: string;
	entities?: TextEntity[];
};

const BR_TAG = /<br\s*\/?>/ms;

const StyledContentEditable = styled.div`
	[contenteditable]:empty:after,
	.forcePlaceholder:after {
		color: rgba(55, 53, 47, 0.4);
		content: attr(placeholder);
	}
`;

export function TextBlock({ block, hide }: { block: BasicBlock & TextBlockType; hide: boolean }) {
	const { id } = block;
	const [entities, setEntities] = useBlockProperty<TextEntity[]>('entities', []);
	const [value, setValue] = useBlockProperty('value', '');
	const [style, setStyle] = useBlockProperty<TextBlockStyles>('style', 'text');

	const { editing } = usePageContext();
	const { updateBlockProps } = useEditor();
	const [isFocused, setIsFocused] = useState(false);

	const htmlValue = useMemo<string>(() => entitiesToHTML(value, entities), [value, entities]);

	const contentEditableRef = useRef<HTMLElement>(null);

	const setToPosRef = useRef<[number, number] | number | null>(null);

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			if (!contentEditableRef.current) return;

			const withoutBrTag = e.target.value.replace(BR_TAG, '\n');
			const [text, newEntities] = htmlToEntities(decode(withoutBrTag));
			if (withoutBrTag !== e.target.value) {
				// reset caret index if BR tag removed;
				setToPosRef.current = getCaretIndex(contentEditableRef.current);
				if (setToPosRef.current > text.length) setToPosRef.current = text.length;
			}
			updateBlockProps({ id, value: text, entities: newEntities });
		},
		[id, updateBlockProps],
	);

	useLayoutEffect(() => {
		if (setToPosRef.current !== null && contentEditableRef.current) {
			if (typeof setToPosRef.current === 'number') setCaretPosition(contentEditableRef.current, setToPosRef.current);
			else setCaretPosition(contentEditableRef.current, setToPosRef.current[0], setToPosRef.current[1]);
			setToPosRef.current = null;
		}
	});

	const { showInspector, inspectorProps } = useBlockContext();

	const { onKeyDownHandler, onPaste } = useTextBlockOnKeyDownHandler({
		contentEditableRef,
		inspectorProps,
		setToPosRef,
	});

	useEventListener<{ position?: number }>(
		id,
		(event) => {
			if (event.action === 'focus') contentEditableRef?.current?.focus();
			if (typeof event.position === 'number') setToPosRef.current = event.position;
		},
		[],
	);

	const decodedValue = useMemo(() => (isFocused ? '' : decode(htmlValue)), [htmlValue, isFocused]);
	const html = useReferences(decodedValue);

	useEffect(() => {
		const currentRef = contentEditableRef.current;
		if (isFocused && !value) {
			currentRef?.setAttribute('placeholder', "Type '/' for components");
		} else {
			currentRef?.setAttribute('placeholder', '');
		}
	}, [isFocused, value]);

	const [textAlign, setTextAlign] = useBlockProperty<'left' | 'right' | 'center'>('textAlign', 'left');

	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));
	const menu = useMemo<MenuItemProps[]>(
		() => [{ type: 'textAlign', value: textAlign, onChange: setTextAlign, label: 'Align' }],
		[setTextAlign, textAlign],
	);
	useAppendBlockMenu(menu, 0);
	if (hide || !block.show) return null;

	const contentEditable = (
		<ContentEditable
			disabled={!editing}
			onContextMenu={(e) => {
				if (contentEditableRef.current) {
					const [n1, n2] = getSelection(contentEditableRef.current);
					if (n1 !== n2) return;
				}
				showInspector(e);
			}}
			className={`Block ${style.includes('heading') ? 'bp4-heading' : 'bp4-text-large'}`}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			innerRef={contentEditableRef}
			html={isFocused ? htmlValue : htmlString}
			tagName={textBlockStyleTag[style || 'text']}
			style={{
				margin: 0,
				paddingTop: 1,
				marginBottom: 0,
				whiteSpace: 'pre-wrap',
				wordBreak: 'break-word',
				textAlign,
			}}
			onChange={onChangeHandler}
			onPaste={onPaste}
			onKeyDown={onKeyDownHandler}
		/>
	);

	return (
		<StyledContentEditable>
			{style === 'list' ? <ul style={{ margin: 0 }}>{contentEditable}</ul> : contentEditable}
		</StyledContentEditable>
	);
}
