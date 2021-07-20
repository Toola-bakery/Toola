import { useContext } from 'react';
import { BlockMenuContext } from '../providers/BlockMenuProvider';

export function useBlockMenu() {
	return useContext(BlockMenuContext);
}
