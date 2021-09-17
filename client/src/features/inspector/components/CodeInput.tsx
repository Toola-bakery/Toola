import { useMemo, useRef, useState } from 'react';
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

export function CodeHints({ hints, select }: { select: (value: string | null) => void; hints: Suggestion[] }) {
	return null;
	// return (
	// 	<List sx={{ maxHeight: { sm: 200 }, overflow: 'scroll' }}>
	// 		{hints.map((hint) => (
	// 			<ListItem button onClick={() => select(hint.value)} key={hint.value}>
	// 				<ListItemText primary={hint.value} secondary={hint.type} />
	// 			</ListItem>
	// 		))}
	// 	</List>
	// );
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
	const ref = useRef<HTMLDivElement>(null);
	const context = usePageContext();
	const [isFocused, setFocused] = useState(false);

	const { start, ref: inputRef, updateCaret } = useCaretPosition();

	const { isReference, currentWord } = useMemo(() => {
		const closestSpaceIndex = value.lastIndexOf(' ', start - 1) + 1;
		let word = value.slice(closestSpaceIndex, start);
		const isRef = word.length > 0 && (word.startsWith('${') || type === 'object');
		if (isRef) word = word.startsWith('${') ? word.slice(2) : word;
		return { isReference: isRef, currentWord: word };
	}, [start, type, value]);

	const suggestions = useMemo(() => getSuggestionKeys(context), [context]);

	const filteredSuggestions = useMemo(() => {
		if (!isReference || !isFocused) return [];
		return suggestions.filter((v) => v.value.startsWith(currentWord));
	}, [isFocused, isReference, suggestions, currentWord]);

	return (
		<div ref={ref}>
			<TextInput
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
		</div>
	);
}
