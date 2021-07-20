import { TextBlock } from './Blocks/TextBlock';
import { Blocks, CodeBlockType, JSONViewBlockType, TextBlockType } from '../types';
import { CodeBlock } from './Blocks/CodeBlock/CodeBlock';
import { JSONViewBlock } from './Blocks/JSONViewBlock';

export function Block({ block }: { block: Blocks }): JSX.Element {
	if (block.type === 'text') return <TextBlock block={block as TextBlockType} />;
	if (block.type === 'code') return <CodeBlock block={block as CodeBlockType} />;
	if (block.type === 'JSONView') return <JSONViewBlock block={block as JSONViewBlockType} />;
	return <></>;
}
