import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block/Block';
import { Blocks } from '../types/blocks';

export function useBlock(): Exclude<BlockContextType['block'], undefined>;
export function useBlock(skipError?: false): Exclude<BlockContextType['block'], undefined>;
export function useBlock(skipError?: true): Exclude<BlockContextType['block'], undefined>;
export function useBlock(skipError?: boolean): Exclude<BlockContextType['block'], undefined> {
	const context = useContext(BlockContext);
	if (!skipError && context === null) throw new Error('useBlock bad context');
	return context.block as Exclude<BlockContextType['block'], undefined>;
}
