import { useCallback, useContext, useMemo, useRef } from 'react';
import { PageContext } from '../../editor/components/Page/Page';
import { useWatchList, WatchListProps } from './useWatchList';

export function usePageContext() {
	return useContext(PageContext);
}

export function useReferenceEvaluator({
	syncWithBlockProps,
	watchReferences = true,
	watchListProps = {},
}: {
	syncWithBlockProps?: boolean;
	watchReferences?: boolean;
	watchListProps?: WatchListProps;
} = {}) {
	const { blocks, globals } = usePageContext();

	const { watchList, isLoading, addToWatchList, setOnUpdate } = useWatchList({
		syncWithBlockProps,
		...watchListProps,
	});

	const watchId = useRef<number | null>(0);

	const updateId = useCallback(() => {
		watchId.current = (watchId.current || 0) + 1;
	}, [watchId]);

	const evaluate = useCallback(
		(sourceCode: string, current?: unknown) => {
			const myWatchId = watchId.current;
			const blockProxy = new Proxy(blocks, {
				get: (target1, key1: string) => {
					if (typeof target1[key1] === 'object')
						return new Proxy(target1[key1], {
							get: (target2, key2: string) => {
								if (myWatchId === watchId.current && key2 in target2) addToWatchList(['blocks', key1, key2]);
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								return target2[key2];
							},
						});
					return target1[key1];
				},
			});

			if (!sourceCode.includes('${') || !sourceCode.includes('}')) return sourceCode;
			try {
				if (sourceCode.startsWith('${') && sourceCode.endsWith('}') && sourceCode.indexOf('${', 1) === -1) {
					// RETURN EXACT VALUE IF ONLY ONE REFERENCE
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const evalFunction = Function(
						...['blocks', 'globals', 'current', 'updateId'],
						`
						const evalResult = ${sourceCode.slice(2, -1)};
						updateId();
					return evalResult`,
					);
					return evalFunction(watchReferences ? blockProxy : blocks, globals, current, updateId);
				}
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const evalFunction = Function(...['blocks', 'globals', 'current'], `return \`${sourceCode}\``);
				return evalFunction(watchReferences ? blockProxy : blocks, globals, current);
			} catch (e) {
				return e.message;
			}
		},
		[addToWatchList, blocks, globals, updateId, watchReferences],
	);

	return { evaluate, watchList, isLoading, setOnUpdate };
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
