import React from 'react';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { ButtonBlock, ButtonBlockType } from '../Blocks/ButtonBlock';
import { CardBlock } from '../Blocks/CardBlock';
import { CodeBlock, CodeBlockType } from '../Blocks/CodeBlock/CodeBlock';
import { ImageBlock, ImageBlockType } from '../Blocks/ImageBlock';
import { InputBlock, InputBlockType } from '../Blocks/InputBlock';
import { JSONViewBlock, JSONViewBlockType } from '../Blocks/JSONViewBlock';
import { KeyValueBlock, KeyValueBlockType } from '../Blocks/KeyValueBlock';
import { QueryBlock, QueryBlockType } from '../Blocks/QueryBlock/QueryBlock';
import { SubPageBlock, SubPageBlockType } from '../Blocks/SubPageBlock';
import { TableBlock } from '../Blocks/TableBlock/TableBlock';
import { TextBlock, TextBlockType } from '../Blocks/TextBlock/TextBlock';

export function BlockSelector({ block, hide = false }: { block: BasicBlock & Blocks; hide?: boolean }) {
	const type = block.type as string;
	if (type === 'text') return <TextBlock hide={hide} block={block as BasicBlock & TextBlockType} />;
	if (type === 'code') return <CodeBlock hide={hide} block={block as BasicBlock & CodeBlockType} />;
	if (type === 'query') return <QueryBlock hide={hide} block={block as BasicBlock & QueryBlockType} />;
	if (type === 'JSONView') return <JSONViewBlock hide={hide} block={block as BasicBlock & JSONViewBlockType} />;
	if (type === 'keyValue') return <KeyValueBlock hide={hide} block={block as BasicBlock & KeyValueBlockType} />;
	if (type === 'table') return <TableBlock hide={hide} />;
	if (type === 'image') return <ImageBlock hide={hide} block={block as BasicBlock & ImageBlockType} />;
	if (type === 'input') return <InputBlock hide={hide} block={block as BasicBlock & InputBlockType} />;
	if (type === 'button') return <ButtonBlock hide={hide} />;
	if (type === 'subpage') return <SubPageBlock hide={hide} block={block as BasicBlock & SubPageBlockType} />;
	if (type === 'card') return <CardBlock hide={hide} />;
	return null;
}
