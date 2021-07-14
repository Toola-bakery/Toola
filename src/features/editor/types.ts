export interface BasicBlock {
  id: string;
  parentId: string | null;
}

export type Blocks = TextBlock | PageBlock;

export type TextBlock = BasicBlock & { type: "text"; html: string };
export type PageBlock = BasicBlock & { type: "page"; blocks: string[] };
