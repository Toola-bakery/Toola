import { useCallback, useState } from 'react';
import { useRefLatest } from './useRefLatest';

export function usePromise(whenNew?: 'resolve' | 'reject') {
	function getPromise<P>(): {
		promise: Promise<P>;
		resolve: (value?: P) => void;
		reject: (reason: unknown) => void;
	} {
		let resolve;
		let reject;
		const promise = new Promise<P>((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		});
		promise.then(() => {});
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return { resolve, reject, promise };
	}

	const [{ promise, reject, resolve }, setPromise] = useState(getPromise);
	const rejectRef = useRefLatest(reject);
	const resolveRef = useRefLatest(resolve);

	const cleanPromise = useCallback(() => {
		if (whenNew === 'reject') rejectRef.current(new Error('removePromise'));
		if (whenNew === 'resolve') resolveRef.current();

		const newPromise = getPromise();
		setPromise(newPromise);
		return newPromise.promise;
	}, [rejectRef, resolveRef, whenNew]);

	return { promise, reject, resolve, cleanPromise };
}
