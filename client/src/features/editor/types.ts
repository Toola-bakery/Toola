export interface BasicBlock {
	id: string;
	parentId: string | null;
}

export type Blocks = TextBlockType | PageBlock | RawBlock | ColumnBlock | CodeBlockType;

export type TextBlockType = BasicBlock & { type: 'text'; html: string };
export type PageBlock = BasicBlock & { type: 'page'; blocks: string[] };
export type RawBlock = BasicBlock & { type: 'raw'; blocks: string[] };
export type ColumnBlock = BasicBlock & { type: 'column'; blocks: string[] };
export type CodeBlockType = BasicBlock & {
	type: 'code';
	source: string;
	language: 'javascript';
};
