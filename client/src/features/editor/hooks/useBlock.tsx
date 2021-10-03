import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block';
import { Blocks } from '../types/blocks';

export function useBlock<T extends Blocks = Blocks>(): Exclude<BlockContextType<T>, null>;
export function useBlock<T extends Blocks = Blocks>(skipError?: false): Exclude<BlockContextType<T>, null>;
export function useBlock<T extends Blocks = Blocks>(skipError?: true): BlockContextType<T>;
export function useBlock<T extends Blocks = Blocks>(skipError?: boolean): BlockContextType<T> {
	const context = useContext(BlockContext);
	if (!skipError && context === null) throw new Error('useBlock bad context');
	return context as BlockContextType<T>;
}
