import { useEffect } from 'react';
import { usePrevious } from '../../../hooks/usePrevious';
import { useBlock } from './useBlock';
import { useEditor } from './useEditor';

export function useBlockSetState<T, K extends keyof T = keyof T>(key: K | keyof T, value: T[K]) {
	const { id } = useBlock() || {};
	const prevV = usePrevious(value);
	const { updateBlockState } = useEditor();
	useEffect(() => {
		if (!id) return;
		if (prevV !== value) {
			updateBlockState({ id, [key]: value });
		}
	}, [id, key, prevV, updateBlockState, value]);
}
