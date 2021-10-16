import { useHotkeys } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';
import { useImmerState } from '../../../redux/hooks';

export function useIsDevtoolsOpen() {
	const [{ state: isDevtoolsOpen = false } = {}, immer] = useImmerState<{ state?: boolean }>('isDevtoolsOpen');

	const setDevtoolsOpen = useCallback(
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
					combo: 'cmd+j',
					global: true,
					label: 'Toggle devtools',
					onKeyDown: () => setDevtoolsOpen(!isDevtoolsOpen),
				},
			],
			[isDevtoolsOpen, setDevtoolsOpen],
		),
	);

	return { isDevtoolsOpen, setDevtoolsOpen };
}
