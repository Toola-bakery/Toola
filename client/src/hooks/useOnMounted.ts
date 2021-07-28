import { EffectCallback, useEffect, useState } from 'react';

export function useIsMounted(): boolean {
	const [isMounted, setMounded] = useState(false);
	useEffect(() => {
		if (!isMounted) {
			setMounded(true);
		}
	}, [isMounted]);

	return isMounted;
}
export function useOnMountedEffect(effect: EffectCallback): void {
	const isMounted = useIsMounted();

	useEffect(() => {
		if (!isMounted) {
			return effect();
		}
	}, [effect, isMounted]);
}
