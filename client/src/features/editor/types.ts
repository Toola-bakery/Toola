export interface BasicBlock {
	id: string;
	parentId: string | null;
	pageId: string;
}

export type Blocks = TextBlockType | TableBlockType | CodeBlockType | JSONViewBlockType | LayoutBlocks;
export type LayoutBlocks = PageBlockType | ColumnBlockType | RowBlockType;

export type PageBlockType = PageBlockProps & PageBlockState;
export type PageBlockProps = {
	type: 'page';
	blocks: string[];
};
export type PageBlockState = {
	itemIterator: { [key: string]: number };
};

export type TextBlockType = { type: 'text'; value: string };
export type ColumnBlockType = { type: 'column'; blocks: string[] };
export type RowBlockType = { type: 'raw'; blocks: string[]; widths?: number[] };

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

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
};
export type TableBlockState = {
	page?: number;
};

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	getValueFunction: string;
	value: string;
};
