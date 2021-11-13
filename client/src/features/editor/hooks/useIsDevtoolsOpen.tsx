import { useHotkeys } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';
import { useImmerState, useSessionImmerState } from '../../../redux/hooks';

export type DevtoolsStates = 'queries' | 'blocks' | false;
export function useIsDevtoolsOpen() {
	const [{ state: isDevtoolsOpen = false } = {}, immer] =
		useSessionImmerState<{ state?: DevtoolsStates }>('isDevtoolsOpen');

	const setDevtoolsOpen = useCallback(
		(newValue: DevtoolsStates) => {
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
					onKeyDown: () => setDevtoolsOpen(isDevtoolsOpen === 'blocks' ? false : 'blocks'),
				},
			],
			[isDevtoolsOpen, setDevtoolsOpen],
		),
	);

	return { isDevtoolsOpen, setDevtoolsOpen };
}
