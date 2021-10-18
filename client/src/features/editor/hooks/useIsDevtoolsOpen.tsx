import { useHotkeys } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';
import { useImmerState } from '../../../redux/hooks';

export function useIsDevtoolsOpen() {
	const [{ state: isDevtoolsOpen = false } = {}, immer] = useImmerState<{ state?: string | false }>('isDevtoolsOpen');

	const setDevtoolsOpen = useCallback(
		(newValue) => {
			immer((draft) => {
				draft.state = newValue;
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
					onKeyDown: () => setDevtoolsOpen(isDevtoolsOpen === 'queries' ? false : 'queries'),
				},
			],
			[isDevtoolsOpen, setDevtoolsOpen],
		),
	);

	useHotkeys(
		useMemo(
			() => [
				{
					combo: 'cmd+b',
					global: true,
					label: 'Toggle devtools',
					onKeyDown: () => setDevtoolsOpen(isDevtoolsOpen === 'globals' ? false : 'globals'),
				},
			],
			[isDevtoolsOpen, setDevtoolsOpen],
		),
	);

	return { isDevtoolsOpen, setDevtoolsOpen };
}
