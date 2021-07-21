export interface BasicBlock {
	id: string;
	parentId: string | null;
	pageId: string;
}

export type Blocks = TextBlockType | PageBlock | RawBlock | ColumnBlock | CodeBlockType | JSONViewBlockType;

export type TextBlockType = BasicBlock & { type: 'text'; value: string };
export type PageBlock = BasicBlock & { type: 'page'; blocks: string[] };
export type RawBlock = BasicBlock & { type: 'raw'; blocks: string[] };
export type ColumnBlock = BasicBlock & { type: 'column'; blocks: string[] };

export type CodeBlockType = CodeBlockProps & CodeBlockState;
export type CodeBlockProps = BasicBlock & {
	type: 'code';
	value: string;
	language: 'javascript';
};
export type CodeBlockState = {
	result?: unknown;
	logs?: string[];
};

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = BasicBlock & {
	type: 'JSONView';
	getValueFunction: string;
	value: string;
};
