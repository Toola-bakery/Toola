import { ButtonBlockProps, ButtonBlockType } from '../components/Blocks/ButtonBlock';
import { ColumnBlockProps, ColumnBlockType } from '../components/Blocks/Layout/ColumnBlock';
import { ImageBlockProps, ImageBlockType } from '../components/Blocks/ImageBlock';
import { TextBlockProps, TextBlockType } from '../components/Blocks/TextBlock';
import { CodeBlockProps, CodeBlockState, CodeBlockType } from '../components/Blocks/CodeBlock/CodeBlock';
import { JSONViewBlockProps, JSONViewBlockType } from '../components/Blocks/JSONViewBlock';
import { PageBlockProps, PageBlockState, PageBlockType } from '../components/Page';
import { RowBlockProps, RowBlockType } from '../components/Blocks/Layout/RowBlock';
import { TableBlockProps, TableBlockState, TableBlockType } from '../components/Blocks/TableBlock/TableBlock';
import { InputBlockProps, InputBlockState, InputBlockType } from '../components/Blocks/InputBlock';

export type Blocks =
	| InputBlockType
	| TextBlockType
	| TableBlockType
	| CodeBlockType
	| JSONViewBlockType
	| ImageBlockType
	| LayoutBlocks
	| ButtonBlockType;

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
	| ColumnBlockProps
	| ButtonBlockProps;

export type BlockPropsAndState =
	| (InputBlockProps & InputBlockState)
	| TextBlockProps
	| (TableBlockProps & TableBlockState)
	| (CodeBlockProps & CodeBlockState)
	| JSONViewBlockProps
	| ImageBlockProps
	| (PageBlockProps & PageBlockState)
	| RowBlockProps
	| ColumnBlockProps
	| ButtonBlockProps;

export type BlockStates = InputBlockState | TableBlockState | CodeBlockState | PageBlockState;
