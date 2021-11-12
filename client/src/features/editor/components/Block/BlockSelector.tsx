import React from 'react';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { ButtonBlock, ButtonBlockType } from '../Blocks/ButtonBlock';
import { CardBlock } from '../Blocks/CardBlock';
import { CodeBlock, CodeBlockType } from '../Blocks/CodeBlock/CodeBlock';
import { FormBlock } from '../Blocks/FormBlock';
import { ImageBlock, ImageBlockType } from '../Blocks/ImageBlock';
import { InputBlock, InputBlockType } from '../Blocks/InputBlock';
import { JSONViewBlock, JSONViewBlockType } from '../Blocks/JSONViewBlock';
import { KeyValueBlock, KeyValueBlockType } from '../Blocks/KeyValueBlock';
import { ListBlock } from '../Blocks/ListBlock/ListBlock';
import { QueryBlock, QueryBlockType } from '../Blocks/QueryBlock/QueryBlock';
import { SubPageBlock, SubPageBlockType } from '../Blocks/SubPageBlock';
import { TableBlock } from '../Blocks/TableBlock/TableBlock';
import { TabsBlock } from '../Blocks/TabsBlock';
import { TextBlock, TextBlockType } from '../Blocks/TextBlock/TextBlock';

export const installedBlocks = {
	text: TextBlock,
	list: ListBlock,
	form: FormBlock,
	tabs: TabsBlock,
	code: CodeBlock,
	query: QueryBlock,
	JSONView: JSONViewBlock,
	keyValue: KeyValueBlock,
	table: TableBlock,
	image: ImageBlock,
	input: InputBlock,
	button: ButtonBlock,
	card: CardBlock,
	subpage: SubPageBlock,
};
export function BlockSelector({ block, hide = false }: { block: BasicBlock & Blocks; hide?: boolean }) {
	const type = block.type as keyof typeof installedBlocks;
	const BlockComponent = installedBlocks[type];
	if (!BlockComponent) return null;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return <BlockComponent hide={hide} block={block as BasicBlock & SubPageBlockType} />;
}
