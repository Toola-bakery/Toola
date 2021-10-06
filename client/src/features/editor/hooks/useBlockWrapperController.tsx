import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block';
import { Blocks } from '../types/blocks';

export function useBlockWrapperController<T extends Blocks = Blocks>(skipError?: boolean): BlockContextType<T> {
	const context = useContext(BlockContext);
	if (!skipError && context === null) throw new Error('useBlock bad context');
	return context as BlockContextType<T>;
}
