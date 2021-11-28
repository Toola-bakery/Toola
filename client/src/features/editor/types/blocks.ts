import { ButtonBlockProps, ButtonBlockType } from '../../blocks/blocks/ButtonBlock';
import { KeyValueBlockProps, KeyValueBlockType } from '../../blocks/blocks/KeyValueBlock';
import { ColumnBlockProps, ColumnBlockType } from '../../blocks/blocks/Layout/ColumnBlock';
import { ImageBlockProps, ImageBlockType } from '../../blocks/blocks/ImageBlock';
import {
	QueryBlockMethods,
	QueryBlockProps,
	QueryBlockState,
	QueryBlockType,
} from '../../blocks/blocks/QueryBlock/QueryBlock';
import { SubPageBlockProps, SubPageBlockType } from '../../blocks/blocks/SubPageBlock';
import { TextBlockProps, TextBlockType } from '../../blocks/blocks/TextBlock/TextBlock';
import {
	CodeBlockMethods,
	CodeBlockProps,
	CodeBlockState,
	CodeBlockType,
} from '../../blocks/blocks/CodeBlock/CodeBlock';
import { JSONViewBlockProps, JSONViewBlockType } from '../../blocks/blocks/JSONViewBlock';
import { PageBlockProps, PageBlockType } from '../components/Page/Page';
import { RowBlockProps, RowBlockType } from '../../blocks/blocks/Layout/RowBlock';
import { TableBlockProps, TableBlockState, TableBlockType } from '../../blocks/blocks/TableBlock/TableBlock';
import {
	InputBlockMethods,
	InputBlockProps,
	InputBlockState,
	InputBlockType,
} from '../../blocks/blocks/Inputs/TextInputBlock';

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
