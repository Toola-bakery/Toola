import { useCallback, useEffect, useState } from 'react';
import { usePrevious } from './usePrevious';
import { useRefLatest } from './useRefLatest';

export function useNextRenderHook(callback?: () => void) {
	const [isNextRender, setNextRender] = useState(false);
	const previousValue = usePrevious(isNextRender);
	const callbackRef = useRefLatest(callback);

	const callNextTime = useCallback(() => {
		setNextRender(true);
	}, []);

	const hasEffect = !previousValue && isNextRender;

	useEffect(() => {
		if (hasEffect) setNextRender(false);
	}, [hasEffect]);

	useEffect(() => {
		if (hasEffect) {
			callbackRef.current?.();
		}
	}, [callbackRef, hasEffect]);

	return { callNextTime, hasEffect };
}
