import { useEffect } from 'react';
import { usePrevious } from '../../../hooks/usePrevious';
import { useBlock } from './useBlock';
import { useBlockState } from './useBlockProperty';

export function useSyncBlockState<T, K extends keyof T = keyof T>(key: K | keyof T, value: T[K]) {
	const { id } = useBlock() || {};
	const prevV = usePrevious(value);
	const [, setValue] = useBlockState(key as string);
	useEffect(() => {
		if (!id) return;
		if (prevV !== value) {
			setValue(value);
		}
	}, [id, prevV, setValue, value]);
}
