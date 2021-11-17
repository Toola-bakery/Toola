import React from 'react';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { ButtonBlock } from '../Blocks/ButtonBlock';
import { CardBlock } from '../Blocks/CardBlock';
import { CodeBlock } from '../Blocks/CodeBlock/CodeBlock';
import { FormBlock } from '../Blocks/FormBlock/FormBlock';
import { ImageBlock } from '../Blocks/ImageBlock';
import { DateInputBlock } from '../Blocks/Inputs/DateInputBlock';
import { TextInputBlock } from '../Blocks/Inputs/TextInputBlock';
import { NumericInputBlock } from '../Blocks/Inputs/NumericInputBlock';
import { TextAreaBlock } from '../Blocks/Inputs/TextAreaBlock';
import { JSONViewBlock } from '../Blocks/JSONViewBlock';
import { KeyValueBlock } from '../Blocks/KeyValueBlock';
import { ListBlock } from '../Blocks/ListBlock/ListBlock';
import { QueryBlock } from '../Blocks/QueryBlock/QueryBlock';
import { SubPageBlock } from '../Blocks/SubPageBlock';
import { TableBlock } from '../Blocks/TableBlock/TableBlock';
import { TabsBlock } from '../Blocks/TabsBlock';
import { TextBlock } from '../Blocks/TextBlock/TextBlock';

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
	textInput: TextInputBlock,
	numericInput: NumericInputBlock,
	dateInput: DateInputBlock,
	textArea: TextAreaBlock,
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
	return <BlockComponent hide={hide} block={block} />;
}
