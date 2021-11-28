import { useCallback, useContext, useMemo, useRef } from 'react';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { PageContext } from '../../editor/components/Page/Page';
import { useBlock } from '../../editor/hooks/useBlock';
import { useCurrent } from '../../editor/hooks/useCurrent';
import { usePageModal } from '../../pageModal/hooks/usePageModal';
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
	const { globals } = usePageContext();
	const { blocks } = useCurrent();
	const block = useBlock();
	const { watchList, isLoading, addToWatchList, setOnUpdate } = useWatchList({
		syncWithBlockProps,
		...watchListProps,
	});

	const watchId = useRef<number | null>(0);

	const updateId = useCallback(() => {
		watchId.current = (watchId.current || 0) + 1;
	}, [watchId]);
	const { current: currentContext } = useCurrent();

	const { navigate } = usePageNavigator();
	const { push } = usePageModal();

	const evaluate = useCallback(
		(sourceCode: string, current: unknown = currentContext) => {
			const myWatchId = watchId.current;
			const blockProxy = new Proxy(blocks, {
				get: (target1, key1: string) => {
					if (typeof target1[key1] === 'object')
						return new Proxy(target1[key1], {
							get: (target2, key2: string) => {
								if (myWatchId === watchId.current) addToWatchList(['blocks', key1, key2]);
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								return target2[key2];
							},
						});
					return target1[key1];
				},
			});

			const evaluateContext = Object.entries({
				blocks: watchReferences ? blockProxy : blocks,
				...(watchReferences ? blockProxy : blocks),
				globals,
				current,
				updateId,
				navigate,
				self: block,
				navigateModal: push,
			});
			const evaluateKeys = evaluateContext.map((v) => v[0]);
			const evaluateValues = evaluateContext.map((v) => v[1]);

			if (!sourceCode.includes('${') || !sourceCode.includes('}')) return sourceCode;
			try {
				if (sourceCode.startsWith('${') && sourceCode.endsWith('}') && sourceCode.indexOf('${', 1) === -1) {
					// RETURN EXACT VALUE IF ONLY ONE REFERENCE
					// eslint-disable-next-line @typescript-eslint/no-implied-eval
					const evalFunction = Function(
						...evaluateKeys,
						`
						const evalResult = ${sourceCode.slice(2, -1)};
						updateId();
					return evalResult`,
					);
					return evalFunction(...evaluateValues);
				}
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const evalFunction = Function(...evaluateKeys, `return \`${sourceCode}\``);
				return evalFunction(...evaluateValues);
			} catch (e) {
				return e.message;
			}
		},
		[addToWatchList, block, blocks, currentContext, globals, navigate, push, updateId, watchReferences],
	);

	return { evaluate, watchList, isLoading, setOnUpdate };
}
export function useReferences<T extends string | string[]>(_sourceCode: T): T | any {
	const { evaluate } = useReferenceEvaluator();
	return useMemo(() => {
		try {
			const references = (Array.isArray(_sourceCode) ? _sourceCode : [_sourceCode]).map((v) => v.trim());
			const calculatedReferences = references.map((i) => evaluate(i));
			return Array.isArray(_sourceCode) ? calculatedReferences : calculatedReferences[0];
		} catch (e) {
			return e;
		}
	}, [_sourceCode, evaluate]);
}
