import { produceWithPatches } from 'immer';
import { useCallback, useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Draft } from 'immer/dist/types/types-external';
import { immerPatch } from './immerSlice';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Dont use this hook directly in components
// Use this hook in hooks.
export function useImmerState<D>(key: string, _initialState?: any) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const initialState = useMemo(() => _initialState, [key]);

	const data = useAppSelector((state) => state.immer[key]);
	const dispatch = useAppDispatch();

	const immer = useCallback(
		(recipe: (draft: Draft<D>) => undefined | void | D) => {
			const [ns, patches] = produceWithPatches<D>(data || {}, recipe);
			if (patches.length) dispatch(immerPatch({ key, patches }));
		},

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data, dispatch, key],
	);

	useEffect(() => {
		if (typeof initialState !== 'undefined' && typeof data === 'undefined') {
			immer(() => initialState);
		}
	}, [data, immer, initialState]);

	return [data, immer] as const;
}
