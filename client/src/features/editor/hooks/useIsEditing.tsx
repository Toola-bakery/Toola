import { useHotkeys } from '@blueprintjs/core';
import { useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export function useIsEditing() {
	const [editing, setEditing] = useLocalStorage('editing', true);

	useHotkeys(
		useMemo(
			() => [
				{
					combo: 'cmd+e',
					global: true,
					label: 'Toggle editing mode',
					onKeyDown: () => setEditing((v) => !v),
				},
			],
			[setEditing],
		),
	);

	return { editing, setEditing };
}
