import { TextBlock } from './TextBlock';
import { Blocks, CodeBlockType, JSONViewBlockType, TextBlockType } from '../types';
import { CodeBlock } from './CodeBlock/CodeBlock';
import { JSONViewBlock } from './JSONViewBlock';

export function Block({ block }: { block: Blocks }): JSX.Element {
	if (block.type === 'text') return <TextBlock block={block as TextBlockType} />;
	if (block.type === 'code') return <CodeBlock block={block as CodeBlockType} />;
	if (block.type === 'JSONView') return <JSONViewBlock block={block as JSONViewBlockType} />;
	return <></>;
}
