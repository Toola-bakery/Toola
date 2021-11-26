import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import styled from 'styled-components';
import { usePageContext, useReferences } from '../../../executor/hooks/useReferences';
import { getCaretIndex, getSelection, setCaretPosition } from '../../helpers/caretOperators';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { useTextBlockOnKeyDownHandler } from '../Blocks/TextBlock/hooks/useTextBlockOnKeyDownHandler';
import { entitiesToHTML, htmlToEntities } from '../Blocks/TextBlock/plugins/TextEntitiesMutation';
import { TextEntity } from '../Blocks/TextBlock/plugins/TextPlugins';

const BR_TAG = /<br\s*\/?>/ms;

const StyledContentEditable = styled.div`
	[contenteditable]:empty:after,
	.forcePlaceholder:after {
		color: rgba(55, 53, 47, 0.4);
		content: attr(placeholder);
		cursor: text;
	}
`;

export function EditableText({
	defaultValue = '',
	tagName = 'span',
	className,
	style,
	value: controlledValue,
	setValue: controlledSetValue,
	allowEntities = true,
	placeholder,
	valuePropertyName = 'value',
}: {
	valuePropertyName?: string;
	defaultValue?: string;
	tagName?: string;
	className?: string;
	style?: React.CSSProperties;
	setValue?: (nextValue: string) => void;
	value?: string;
	allowEntities?: boolean;
	placeholder?: string;
} = {}) {
	const { editing } = usePageContext();
	const [isFocused, setIsFocused] = useState(false);
	const contentEditableRef = useRef<HTMLElement>(null);
	const setToPosRef = useRef<[number, number] | number | null>(null);

	if (typeof defaultValue !== 'undefined' && typeof controlledSetValue !== 'undefined')
		throw new Error('You cant use defaultValue with setValue');
	const [internalValue, setInternalValue] = useBlockProperty(valuePropertyName, defaultValue);
	const [entities, setEntities] = useBlockProperty<TextEntity[] | undefined>(
		'entities',
		allowEntities ? [] : undefined,
	);
	const value = controlledSetValue ? controlledValue || '' : internalValue;
	const setValue = controlledSetValue || setInternalValue;

	const htmlValue = useMemo<string>(() => entitiesToHTML(value, entities || []), [value, entities]);
	const html = useReferences(isFocused ? '' : htmlValue);
	const htmlString = typeof html === 'string' ? html : html && JSON.stringify(html, Object.getOwnPropertyNames(html));

	useLayoutEffect(() => {
		if (setToPosRef.current !== null && contentEditableRef.current) {
			if (typeof setToPosRef.current === 'number') setCaretPosition(contentEditableRef.current, setToPosRef.current);
			else setCaretPosition(contentEditableRef.current, setToPosRef.current[0], setToPosRef.current[1]);
			setToPosRef.current = null;
		}
	});

	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			if (!contentEditableRef.current) return;

			const withoutBrTag = e.target.value.replace(BR_TAG, '\n');
			const [text, newEntities] = htmlToEntities(withoutBrTag);
			if (withoutBrTag !== e.target.value) {
				// reset caret index if BR tag removed;
				setToPosRef.current = getCaretIndex(contentEditableRef.current);
				if (setToPosRef.current > text.length) setToPosRef.current = text.length;
			}
			setValue(text);
			setEntities(allowEntities ? newEntities : []);
		},
		[allowEntities, setEntities, setValue],
	);

	const { onKeyDownHandler, onPaste } = useTextBlockOnKeyDownHandler({
		contentEditableRef,
		setToPosRef,
	});

	return (
		<StyledContentEditable>
			<ContentEditable
				disabled={!editing}
				onContextMenu={(e) => {
					// if (contentEditableRef.current) {
					// 	const [n1, n2] = getSelection(contentEditableRef.current);
					// 	if (n1 !== n2) return;
					// }
					// onContextMenu(e);
				}}
				className={className}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				innerRef={contentEditableRef}
				html={isFocused ? htmlValue : htmlString}
				tagName={tagName}
				style={{
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-word',
					marginBottom: 0,
					cursor: editing ? 'text' : undefined,
					...style,
				}}
				onChange={onChangeHandler}
				onPaste={onPaste}
				onKeyDown={onKeyDownHandler}
				placeholder={editing ? placeholder : ''}
			/>
		</StyledContentEditable>
	);
}
