import { ButtonBlockProps, ButtonBlockType } from '../components/Blocks/ButtonBlock';
import { KeyValueBlockProps, KeyValueBlockType } from '../components/Blocks/KeyValueBlock';
import { ColumnBlockProps, ColumnBlockType } from '../components/Blocks/Layout/ColumnBlock';
import { ImageBlockProps, ImageBlockType } from '../components/Blocks/ImageBlock';
import {
	QueryBlockMethods,
	QueryBlockProps,
	QueryBlockState,
	QueryBlockType,
} from '../components/Blocks/QueryBlock/QueryBlock';
import { SubPageBlockProps, SubPageBlockType } from '../components/Blocks/SubPageBlock';
import { TextBlockProps, TextBlockType } from '../components/Blocks/TextBlock/TextBlock';
import {
	CodeBlockMethods,
	CodeBlockProps,
	CodeBlockState,
	CodeBlockType,
} from '../components/Blocks/CodeBlock/CodeBlock';
import { JSONViewBlockProps, JSONViewBlockType } from '../components/Blocks/JSONViewBlock';
import { PageBlockProps, PageBlockType } from '../components/Page/Page';
import { RowBlockProps, RowBlockType } from '../components/Blocks/Layout/RowBlock';
import { TableBlockProps, TableBlockState, TableBlockType } from '../components/Blocks/TableBlock/TableBlock';
import { InputBlockMethods, InputBlockProps, InputBlockState, InputBlockType } from '../components/Blocks/InputBlock';

export type Blocks =
	| InputBlockType
	| TextBlockType
	| TableBlockType
	| CodeBlockType
	| JSONViewBlockType
	| KeyValueBlockType
	| ImageBlockType
	| LayoutBlocks
	| SubPageBlockType
	| QueryBlockType
	| ButtonBlockType
	| { type: 'card' | 'list' | 'tabs' };

export type LayoutBlocks = PageBlockType | ColumnBlockType | RowBlockType;

export type BlockProps =
	| InputBlockProps
	| TextBlockProps
	| TableBlockProps
	| CodeBlockProps
	| QueryBlockProps
	| JSONViewBlockProps
	| KeyValueBlockProps
	| ImageBlockProps
	| PageBlockProps
	| RowBlockProps
	| ColumnBlockProps
	| SubPageBlockProps
	| ButtonBlockProps;

export type BlockPropsAndState =
	| (InputBlockProps & InputBlockState)
	| TextBlockProps
	| (TableBlockProps & TableBlockState)
	| (CodeBlockProps & CodeBlockState)
	| (QueryBlockProps & QueryBlockState)
	| JSONViewBlockProps
	| ImageBlockProps
	| PageBlockProps
	| RowBlockProps
	| SubPageBlockProps
	| ColumnBlockProps
	| ButtonBlockProps;

export type BlockStates = InputBlockState | TableBlockState | CodeBlockState | QueryBlockState;
// eslint-disable-next-line @typescript-eslint/ban-types
export type BlockMethods = { [key: string]: Function };
