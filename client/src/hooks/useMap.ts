import { DependencyList, useEffect, useState } from 'react';
import { useIsMounted } from './useOnMounted';

export function useMap<Key, Value>(deps: DependencyList = []): Map<Key, Value> {
	const [map, setMap] = useState(() => new Map());
	const isMounted = useIsMounted();

	useEffect(() => {
		if (isMounted) setMap(new Map());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return map;
}
