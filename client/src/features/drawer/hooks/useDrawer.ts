import { useCallback } from 'react';
import { useImmerState } from '../../../redux/hooks';

export function useDrawer() {
	const [data = {}, immer] = useImmerState<{
		width: number;
		show: boolean;
	}>('projects');

	const { show = true, width = 240 } = data;

	const setWidth = useCallback(
		(newWidth: number) =>
			immer((draft) => {
				draft.width = newWidth;
			}),
		[immer],
	);

	return { show, width, setWidth };
}
