import { useHotkeys } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';
import { useImmerState } from '../../../redux/hooks';

export function useIsEditing() {
	const [{ state: editing = true } = {}, immer] = useImmerState<{ state?: boolean }>('editingState');

	const setEditing = useCallback(
		(newEditing) => {
			immer((draft) => {
				draft.state = newEditing;
			});
		},
		[immer],
	);

	useHotkeys(
		useMemo(
			() => [
				{
					combo: 'cmd+e',
					global: true,
					label: 'Toggle editing mode',
					onKeyDown: () => setEditing(!editing),
				},
			],
			[editing, setEditing],
		),
	);

	return { editing, setEditing };
}
