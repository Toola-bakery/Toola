import { useContext } from 'react';
import { WSProviderContext } from '../components/WSProvider';

export function useWS() {
	return useContext(WSProviderContext);
}
