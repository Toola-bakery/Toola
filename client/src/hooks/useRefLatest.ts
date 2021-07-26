import { createRef, MutableRefObject, useMemo, useRef } from 'react';

export function useRefLatest<T>(prop: T) {
	const ref = useRef<T>(prop);
	ref.current = prop;
	return ref;
}

export function useRefsLatest<T extends { [key: string]: any }>(props: T) {
	const refsKey = Object.keys(props).sort().join(',');
	const refs = useMemo(() => {
		const r: { [key: string]: unknown } = {};
		Object.keys(props).forEach((key) => {
			r[`${key}Ref`] = createRef();
		});

		return r as { [A in keyof T as `${string & A}Ref`]: MutableRefObject<T[A]> };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refsKey]);

	Object.keys(props).forEach((key: keyof T) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		refs[`${key}Ref`].current = props[key];
	});
	return refs;
}
