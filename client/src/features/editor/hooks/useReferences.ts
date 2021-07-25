import { useCallback, useContext, useMemo } from 'react';
import { PageContext } from '../components/Page';

export function usePageContext() {
	return useContext(PageContext);
}

export function useReferenceEvaluator() {
	const { blocks, globals } = usePageContext();
	const evaluate = useCallback(
		(sourceCode: string, current?: unknown) => {
			if (!sourceCode.includes('${') || !sourceCode.includes('}')) return sourceCode;
			if (sourceCode.startsWith('${') && sourceCode.endsWith('}') && sourceCode.indexOf('${', 1) === -1) {
				// RETURN EXACT VALUE IF ONLY ONE REFERENCE
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const evalFunction = Function(...['blocks', 'globals', 'current'], `return ${sourceCode.slice(2, -1)}`);
				return evalFunction(blocks, globals, current);
			}
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const evalFunction = Function(...['blocks', 'globals', 'current'], `return \`${sourceCode}\``);
			return evalFunction(blocks, globals, current);
		},
		[blocks, globals],
	);

	return { evaluate };
}
export function useReferences<T extends string | string[]>(_sourceCode: T): T {
	const { evaluate } = useReferenceEvaluator();
	return useMemo(() => {
		try {
			const references = (Array.isArray(_sourceCode) ? _sourceCode : [_sourceCode]).map((v) => v.trim());
			const calculatedReferences = references.map(evaluate);
			return Array.isArray(_sourceCode) ? calculatedReferences : calculatedReferences[0];
		} catch (e) {
			return e;
		}
	}, [_sourceCode, evaluate]);
}
