import { useContext } from 'react';
import { PageModalContext } from '../components/PageModalProvider';

export function usePageModal() {
	return useContext(PageModalContext);
}
