import { useCallback, useContext, useMemo, useState } from 'react';
import { PageContext } from '../../editor/components/Page';
import { useBlock } from '../../editor/hooks/useBlock';
import { useEditor } from '../../editor/hooks/useEditor';
import { useWatchList } from './useWatchList';

export function usePageContext() {
	return useContext(PageContext);
}

export function useReferenceEvaluator({
	syncWithBlockProps,
	watchReferences,
}: {
	syncWithBlockProps?: boolean;
	watchReferences?: boolean;
} = {}) {
	const { blocks, globals } = usePageContext();

	const { watchList, isLoading, addToWatchList } = useWatchList({ syncWithBlockProps });

	const blockProxy = useMemo(
		() =>
			new Proxy(blocks, {
				get: (target1, key1: string) => {
					if (typeof target1[key1] === 'object')
						return new Proxy(target1[key1], {
							get: (target2, key2: string) => {
								if (key2 in target2) addToWatchList(key1, key2);
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								return target2[key2];
							},
						});
					return target1[key1];
				},
			}),
		[addToWatchList, blocks],
	);

	const evaluate = useCallback(
		(sourceCode: string, current?: unknown) => {
			if (!sourceCode.includes('${') || !sourceCode.includes('}')) return sourceCode;
			try {
				if (sourceCode.startsWith('${') && sourceCode.endsWith('}') && sourceCode.indexOf('${', 1) === -1) {
					// RETURN EXACT VALUE IF ONLY ONE REFERENCE
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const evalFunction = Function(...['blocks', 'globals', 'current'], `return ${sourceCode.slice(2, -1)}`);
					return evalFunction(watchReferences ? blockProxy : blocks, globals, current);
				}
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const evalFunction = Function(...['blocks', 'globals', 'current'], `return \`${sourceCode}\``);
				return evalFunction(watchReferences ? blockProxy : blocks, globals, current);
			} catch (e) {
				return e.message;
			}
		},
		[blockProxy, blocks, globals, watchReferences],
	);

	return { evaluate, watchList, isLoading };
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
