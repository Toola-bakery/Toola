import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export function usePageNavigator() {
	const history = useHistory();

	const navigate = useCallback(
		(pageId: string, state?: unknown) => {
			history.push(`/${pageId}`, state);
		},
		[history],
	);

	return { navigate };
}
