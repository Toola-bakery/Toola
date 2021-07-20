import { useContext, useMemo } from 'react';
import { PageContext } from '../components/Page';

export function usePageContext() {
	return useContext(PageContext);
}

export function useReferences(_sourceCode: string) {
	const { blocks, globals } = usePageContext();
	return useMemo(() => {
		try {
			const sourceCode = _sourceCode.trim();
			if (!sourceCode.includes('${') || !sourceCode.includes('}')) return sourceCode;
			if (sourceCode.startsWith('${') && sourceCode.endsWith('}') && sourceCode.indexOf('${', 1) === -1) {
				// RETURN EXACT VALUE IF ONLY ONE REFERENCE
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const evalFunction = Function(...['blocks', 'globals'], `return ${sourceCode.slice(2, -1)}`);
				return evalFunction(blocks, globals);
			}
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const evalFunction = Function(...['blocks', 'globals'], `return \`${sourceCode}\``);
			return evalFunction(blocks, globals);
		} catch (e) {
			return e;
		}
	}, [_sourceCode, blocks, globals]);
}
