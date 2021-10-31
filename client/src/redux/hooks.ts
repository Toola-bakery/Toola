import { produceWithPatches } from 'immer';
import { useCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Draft } from 'immer/dist/types/types-external';
import { immerPatch } from './immerSlice';
import { immerPatch as sessionImmerPatch } from './sessionImmerSlice';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Dont use this hook directly in components
// Use this hook in hooks.
export function useImmerState<D>(key: string) {
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

	return [data, immer] as [D | undefined, typeof immer];
}

// Dont use this hook directly in components
// Use this hook in hooks.
export function useSessionImmerState<D>(key: string) {
	const data = useAppSelector((state) => state.sessionImmer[key]);
	const dispatch = useAppDispatch();

	const immer = useCallback(
		(recipe: (draft: Draft<D>) => undefined | void | D) => {
			const [ns, patches] = produceWithPatches<D>(data || {}, recipe);
			if (patches.length) dispatch(sessionImmerPatch({ key, patches }));
		},

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data, dispatch, key],
	);

	return [data, immer] as [D | undefined, typeof immer];
}
