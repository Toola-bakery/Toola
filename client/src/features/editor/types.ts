export interface BasicBlock {
	id: string;
	parentId: string | null;
	pageId: string;
}

export type Blocks = TextBlockType | TableBlockType | CodeBlockType | JSONViewBlockType | ImageBlockType | LayoutBlocks;
export type LayoutBlocks = PageBlockType | ColumnBlockType | RowBlockType;

export type PageBlockType = PageBlockProps & PageBlockState;
export type PageBlockProps = {
	type: 'page';
	blocks: string[];
};
export type PageBlockState = {};

export type ColumnBlockType = { type: 'column'; blocks: string[] };
export type RowBlockType = { type: 'row'; blocks: string[]; widths?: number[] };

export type TextBlockType = { type: 'text'; value: string };

export type CodeBlockType = CodeBlockProps & CodeBlockState;
export type CodeBlockProps = {
	type: 'code';
	value: string;
	language: 'javascript';
	manualControl: boolean;
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
	value: string;
};

export type ImageBlockType = ImageBlockProps;
export type ImageBlockProps = {
	type: 'image';
	value: string;
};
