import React from 'react';
import { MultiSelectBlock } from '../../../blocks/blocks/Inputs/MultiSelectBlock';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { ButtonBlock } from '../../../blocks/blocks/ButtonBlock';
import { CardBlock } from '../../../blocks/blocks/CardBlock';
import { ChartBlock } from '../../../blocks/blocks/ChartBlock/ChartBlock';
import { CodeBlock } from '../../../blocks/blocks/CodeBlock/CodeBlock';
import { FormBlock } from '../../../blocks/blocks/FormBlock/FormBlock';
import { ImageBlock } from '../../../blocks/blocks/ImageBlock';
import { DateInputBlock } from '../../../blocks/blocks/Inputs/DateInputBlock';
import { SelectBlock } from '../../../blocks/blocks/Inputs/SelectBlock';
import { TextInputBlock } from '../../../blocks/blocks/Inputs/TextInputBlock';
import { NumericInputBlock } from '../../../blocks/blocks/Inputs/NumericInputBlock';
import { TextAreaBlock } from '../../../blocks/blocks/Inputs/TextAreaBlock';
import { JSONViewBlock } from '../../../blocks/blocks/JSONViewBlock';
import { KeyValueBlock } from '../../../blocks/blocks/KeyValueBlock';
import { ListBlock } from '../../../blocks/blocks/ListBlock/ListBlock';
import { ProgressBarBlock } from '../../../blocks/blocks/ProgressBarBlock';
import { QueryBlock } from '../../../blocks/blocks/QueryBlock/QueryBlock';
import { SubPageBlock } from '../../../blocks/blocks/SubPageBlock';
import { TableBlock } from '../../../blocks/blocks/TableBlock/TableBlock';
import { TabsBlock } from '../../../blocks/blocks/TabsBlock';
import { TagsBlock } from '../../../blocks/blocks/TagsBlock';
import { TextBlock } from '../../../blocks/blocks/TextBlock/TextBlock';

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
	progressBar: ProgressBarBlock,
	chart: ChartBlock,
	multiSelect: MultiSelectBlock,
	select: SelectBlock,
	tags: TagsBlock,
};
export function BlockSelector({ block, hide = false }: { block: BasicBlock & Blocks; hide?: boolean }) {
	const type = block.type as keyof typeof installedBlocks;
	const BlockComponent = installedBlocks[type];
	if (!BlockComponent) return null;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return <BlockComponent hide={hide} block={block} />;
}
