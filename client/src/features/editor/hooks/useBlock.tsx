import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block';

export function useBlock(): BlockContextType {
	return useContext(BlockContext);
}
