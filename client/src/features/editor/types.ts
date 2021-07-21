export interface BasicBlock {
	id: string;
	parentId: string | null;
	pageId: string;
}

export type Blocks = TextBlockType | PageBlockType | RawBlock | ColumnBlock | CodeBlockType | JSONViewBlockType;

export type PageBlockType = PageBlockProps & PageBlockState;
export type PageBlockProps = {
	type: 'page';
	blocks: string[];
};
export type PageBlockState = {
	itemIterator: { [key: string]: number };
};

export type TextBlockType = { type: 'text'; value: string };
export type RawBlock = { type: 'raw'; blocks: string[] };
export type ColumnBlock = { type: 'column'; blocks: string[] };

export type CodeBlockType = CodeBlockProps & CodeBlockState;
export type CodeBlockProps = {
	type: 'code';
	value: string;
	language: 'javascript';
};
export type CodeBlockState = {
	result?: unknown;
	logs?: string[];
};

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	getValueFunction: string;
	value: string;
};
