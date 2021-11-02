import { useContext } from 'react';
import { CurrentContext } from '../components/CurrentContext';

export function useCurrent<T = unknown>() {
	const context = useContext(CurrentContext);
	return context as typeof context & { current: T };
}
