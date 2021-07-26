import { ColumnBlockProps, ColumnBlockType } from '../components/Blocks/Layout/ColumnBlock';
import { ImageBlockProps, ImageBlockType } from '../components/Blocks/ImageBlock';
import { TextBlockProps, TextBlockType } from '../components/Blocks/TextBlock';
import { CodeBlockProps, CodeBlockType } from '../components/Blocks/CodeBlock/CodeBlock';
import { JSONViewBlockProps, JSONViewBlockType } from '../components/Blocks/JSONViewBlock';
import { PageBlockProps, PageBlockType } from '../components/Page';
import { RowBlockProps, RowBlockType } from '../components/Blocks/Layout/RowBlock';
import { TableBlockProps, TableBlockType } from '../components/Blocks/TableBlock/TableBlock';
import { InputBlockProps, InputBlockType } from '../components/Blocks/InputBlock';

export type Blocks =
	| InputBlockType
	| TextBlockType
	| TableBlockType
	| CodeBlockType
	| JSONViewBlockType
	| ImageBlockType
	| LayoutBlocks;
export type LayoutBlocks = PageBlockType | ColumnBlockType | RowBlockType;

export type BlockProps =
	| InputBlockProps
	| TextBlockProps
	| TableBlockProps
	| CodeBlockProps
	| JSONViewBlockProps
	| ImageBlockProps
	| PageBlockProps
	| RowBlockProps
	| ColumnBlockProps;
