import { Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { setCaretPosition, setInputCaretPosition } from '../../editor/helpers/caretOperators';
import { usePageContext } from '../../executor/hooks/useReferences';
import { useCaretPosition } from '../../editor/hooks/useCaretPosition';
import { TextInput } from '../../ui/components/TextInput';

const GO_DEEPER_TYPES = ['object', 'array'];

type Suggestion = { value: string; type: string };

function wrapKey(key: string) {
	if (/^[a-z_][a-z0-9_]*$/gi.test(key)) return `.${key}`;
	return `["${key}"]`;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSuggestionKeys(currentState: any) {
	const suggestions: Suggestion[] = [];
	Object.keys(currentState).forEach((key) => {
		const value1 = currentState[key];
		Object.keys(value1).forEach((key2) => {
			const value2 = value1[key2];
			if (value2 == null || !GO_DEEPER_TYPES.includes(typeof value2))
				suggestions.push({ value: `${key}${wrapKey(key2)}`, type: typeof value2 });
			else
				Object.keys(value2).forEach((key3) => {
					const value3 = value2[key3];
					suggestions.push({ value: `${key}${wrapKey(key2)}${wrapKey(key3)}`, type: typeof value3 });
				});
		});
	});
	return suggestions;
}

export function CodeHints({ hints, onSelect }: { onSelect: (value: string | null) => void; hints: Suggestion[] }) {
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
						onSelect(hint.value);
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
	// const ref = useRef<HTMLDivElement>(null);
	const context = usePageContext();
	const [isFocused, setFocused] = useState(false);

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

	const suggestions = useMemo(() => getSuggestionKeys(context), [context]);

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
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)}
				onChange={(e) => {
					onChange(e.target.value);
					updateCaret();
				}}
			/>
			<div style={{ position: 'relative' }}>
				<CodeHints
					onSelect={(v) => {
						if (!v) return;
						const newValue = value.slice(0, suggestionWordStartIndex) + v + value.slice(start);
						onChange(newValue);
						setNextCursorPosition(suggestionWordStartIndex + v.length);
					}}
					hints={filteredSuggestions}
				/>
			</div>
		</div>
	);
}
