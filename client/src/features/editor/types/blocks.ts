import { ColumnBlockType } from '../components/Blocks/Layout/ColumnBlock';
import { ImageBlockType } from '../components/Blocks/ImageBlock';
import { TextBlockType } from '../components/Blocks/TextBlock';
import { CodeBlockType } from '../components/Blocks/CodeBlock/CodeBlock';
import { JSONViewBlockType } from '../components/Blocks/JSONViewBlock';
import { PageBlockType } from '../components/Page';
import { RowBlockType } from '../components/Blocks/Layout/RowBlock';
import { TableBlockType } from '../components/Blocks/TableBlock/TableBlock';
import { InputBlockType } from '../components/Blocks/InputBlock';

export type Blocks =
	| InputBlockType
	| TextBlockType
	| TableBlockType
	| CodeBlockType
	| JSONViewBlockType
	| ImageBlockType
	| LayoutBlocks;
export type LayoutBlocks = PageBlockType | ColumnBlockType | RowBlockType;
