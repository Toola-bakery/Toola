import { useContext } from 'react';
import { BlockMenuContext } from '../components/BlockMenuProvider';

export function useBlockMenu() {
	return useContext(BlockMenuContext);
}
