import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block';
import { Blocks } from '../types/blocks';

type BlockContextWithGuarantee<T extends Blocks = Blocks> = Omit<BlockContextType<T>, 'block'> & {
	block: Exclude<BlockContextType<T>['block'], undefined>;
};

export function useBlock<T extends Blocks = Blocks>(): Exclude<BlockContextType<T>['block'], undefined>;
export function useBlock<T extends Blocks = Blocks>(
	skipError?: false,
): Exclude<BlockContextType<T>['block'], undefined>;
export function useBlock<T extends Blocks = Blocks>(skipError?: true): Exclude<BlockContextType<T>['block'], undefined>;
export function useBlock<T extends Blocks = Blocks>(
	skipError?: boolean,
): Exclude<BlockContextType<T>['block'], undefined> {
	const context = useContext(BlockContext);
	if (!skipError && context === null) throw new Error('useBlock bad context');
	return context.block as Exclude<BlockContextType<T>['block'], undefined>;
}
