import { Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { setCaretPosition, setInputCaretPosition } from '../../editor/helpers/caretOperators';
import { useCurrent } from '../../editor/hooks/useCurrent';
import { usePageContext } from '../../executor/hooks/useReferences';
import { useCaretPosition } from '../../editor/hooks/useCaretPosition';
import { TextInput } from '../../ui/components/TextInput';

const GO_DEEPER_TYPES = ['object', 'array'];

type Suggestion = { value: string; type: string; canGoDeeper: boolean };

function typeOf(object: any) {
	const type = typeof object;

	if (type === 'undefined') {
		return 'undefined';
	}

	if (object) {
		return object.constructor.name.toLowerCase();
	}
	if (type === 'object') {
		return toString.call(object).slice(8, -1).toLowerCase();
	}

	return type.toLowerCase();
}

function wrapKey(key: string) {
	if (/^[a-z_][a-z0-9_]*$/gi.test(key)) return `.${key}`;
	return `["${key}"]`;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSuggestionKeys(currentState: any, level?: number) {
	const suggestions: Suggestion[] = [];
	Object.keys(currentState).forEach((key) => {
		const value1 = currentState[key];

		const canGoDeeper1 = GO_DEEPER_TYPES.includes(typeOf(value1));
		if (level === 0 || value1 === null || !canGoDeeper1)
			return suggestions.push({ value: key, type: typeOf(value1), canGoDeeper: canGoDeeper1 });

		Object.keys(value1).forEach((key2) => {
			const value2 = value1[key2];
			const canGoDeeper2 = GO_DEEPER_TYPES.includes(typeOf(value2));

			if (level === 1 || value2 === null || !canGoDeeper2)
				return suggestions.push({ value: `${key}${wrapKey(key2)}`, type: typeOf(value2), canGoDeeper: canGoDeeper2 });

			Object.keys(value2).forEach((key3) => {
				const value3 = value2[key3];
				suggestions.push({ value: `${key}${wrapKey(key2)}${wrapKey(key3)}`, type: typeOf(value3), canGoDeeper: false });
			});
		});
	});
	return suggestions;
}

export function CodeHints({ hints, onSelect }: { onSelect: (value: Suggestion | null) => void; hints: Suggestion[] }) {
	return (
		<Menu
			style={{
				maxHeight: 200,
				overflowY: 'scroll',
				position: 'absolute',
				top: 3,
				display: hints.length ? 'block' : 'none',
				boxShadow: '0 0 0 1px rgb(17 20 24 / 10%), 0 2px 4px rgb(17 20 24 / 20%), 0 8px 24px rgb(17 20 24 / 20%)',
				zIndex: 999,
			}}
		>
			{hints.map((hint) => (
				<MenuItem
					onClick={(e) => {
						onSelect(hint);
						e.preventDefault();
						e.stopPropagation();
					}}
					key={hint.value}
					text={hint.value}
					label={hint.type}
				/>
			))}
		</Menu>
	);
}

export function CodeInput({
	onChange,
	value = '',
	type = 'string',
	label,
	inline,
	multiline,
}: {
	label: string;
	value: string;
	type?: 'object' | 'string';
	onChange: (v: string) => void;
	inline?: boolean;
	multiline?: boolean;
}) {
	const { start, ref: inputRef, updateCaret } = useCaretPosition();

	const [nextCursorPosition, setNextCursorPosition] = useState<null | number>(null);
	useEffect(() => {
		if (nextCursorPosition === null) return;
		setInputCaretPosition(inputRef.current, nextCursorPosition);
		updateCaret();
	}, [inputRef, nextCursorPosition, updateCaret]);

	const { isReference, currentWord, suggestionWordStartIndex } = useMemo(() => {
		const closestSpaceIndex = value.lastIndexOf(' ', start - 1) + 1;
		let word = value.slice(closestSpaceIndex, start);
		let index = closestSpaceIndex;
		const isRef = word.length > 0 && (word.startsWith('${') || type === 'object');

		if (word.startsWith('${')) {
			word = word.slice(2);
			index += 2;
		}

		return { isReference: isRef, currentWord: word, suggestionWordStartIndex: index };
	}, [start, type, value]);

	const { blocks } = useCurrent();
	const { globals } = usePageContext();

	const level = currentWord.length - currentWord.replace(/\./g, '').length;

	const suggestions = useMemo(() => {
		return getSuggestionKeys({ ...blocks, globals }, level);
	}, [blocks, globals, level]);

	const filteredSuggestions = useMemo(() => {
		if (!isReference) return [];
		return suggestions.filter((v) => v.value.startsWith(currentWord) && v.value !== currentWord);
	}, [isReference, suggestions, currentWord]);

	return (
		<div style={{ position: 'relative' }}>
			<TextInput
				formGroupStyle={{ marginBottom: 0 }}
				inline={inline}
				label={label}
				inputRef={inputRef}
				value={value}
				multiline={multiline}
				fill
				autoComplete="off"
				onChange={(e) => {
					onChange(e.target.value);
					updateCaret();
				}}
			/>
			<div style={{ position: 'relative' }}>
				<CodeHints
					onSelect={(v) => {
						if (!v) return;
						const append = v.value + (v.canGoDeeper ? '.' : '');
						const newValue = value.slice(0, suggestionWordStartIndex) + append + value.slice(start);
						onChange(newValue);
						setNextCursorPosition(suggestionWordStartIndex + append.length);
					}}
					hints={filteredSuggestions}
				/>
			</div>
		</div>
	);
}
