import { useContext } from 'react';
import { BlockContext, BlockContextType } from '../components/Block';

export function useBlock(): Exclude<BlockContextType, null>;
export function useBlock(skipError?: false): Exclude<BlockContextType, null>;
export function useBlock(skipError?: true): BlockContextType;
export function useBlock(skipError?: boolean): BlockContextType {
	const context = useContext(BlockContext);
	if (!skipError && context === null) throw new Error('useBlock bad context');
	return context;
}
