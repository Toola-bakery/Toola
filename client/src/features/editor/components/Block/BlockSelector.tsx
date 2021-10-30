import React from 'react';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { ButtonBlock, ButtonBlockType } from '../Blocks/ButtonBlock';
import { CodeBlock, CodeBlockType } from '../Blocks/CodeBlock/CodeBlock';
import { ImageBlock, ImageBlockType } from '../Blocks/ImageBlock';
import { InputBlock, InputBlockType } from '../Blocks/InputBlock';
import { JSONViewBlock, JSONViewBlockType } from '../Blocks/JSONViewBlock';
import { KeyValueBlock, KeyValueBlockType } from '../Blocks/KeyValueBlock';
import { QueryBlock, QueryBlockType } from '../Blocks/QueryBlock/QueryBlock';
import { SubPageBlock, SubPageBlockType } from '../Blocks/SubPageBlock';
import { TableBlock, TableBlockType } from '../Blocks/TableBlock/TableBlock';
import { TextBlock, TextBlockType } from '../Blocks/TextBlock/TextBlock';

export function BlockSelector({ block, hide = false }: { block: BasicBlock & Blocks; hide?: boolean }) {
	if (block.type === 'text') return <TextBlock hide={hide} block={block as BasicBlock & TextBlockType} />;
	if (block.type === 'code') return <CodeBlock hide={hide} block={block as BasicBlock & CodeBlockType} />;
	if (block.type === 'query') return <QueryBlock hide={hide} block={block as BasicBlock & QueryBlockType} />;
	if (block.type === 'JSONView') return <JSONViewBlock hide={hide} block={block as BasicBlock & JSONViewBlockType} />;
	if (block.type === 'keyValue') return <KeyValueBlock hide={hide} block={block as BasicBlock & KeyValueBlockType} />;
	if (block.type === 'table') return <TableBlock hide={hide} block={block as BasicBlock & TableBlockType} />;
	if (block.type === 'image') return <ImageBlock hide={hide} block={block as BasicBlock & ImageBlockType} />;
	if (block.type === 'input') return <InputBlock hide={hide} block={block as BasicBlock & InputBlockType} />;
	if (block.type === 'button') return <ButtonBlock hide={hide} block={block as BasicBlock & ButtonBlockType} />;
	if (block.type === 'subpage') return <SubPageBlock hide={hide} block={block as BasicBlock & SubPageBlockType} />;
	return null;
}
