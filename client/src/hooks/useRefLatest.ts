import { useRef } from 'react';

export function useRefLatest<T>(prop: T) {
	const ref = useRef<T>(prop);
	ref.current = prop;
	return ref;
}
