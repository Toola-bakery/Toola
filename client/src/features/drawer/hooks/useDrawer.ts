import { useCallback } from 'react';
import { useImmerState } from '../../../redux/hooks';

const MIN_DRAWER_WIDTH = 150;
const MAX_DRAWER_WIDTH = 300;

export function useDrawer() {
	const [data = {}, immer] = useImmerState<{
		width: number;
		show: boolean;
	}>('projects');

	const { show = true, width = 240 } = data;

	const setWidth = useCallback(
		(newWidth: number) =>
			immer((draft) => {
				draft.width = Math.min(Math.max(newWidth, MIN_DRAWER_WIDTH), MAX_DRAWER_WIDTH);
			}),
		[immer],
	);

	return { show, width, setWidth };
}
