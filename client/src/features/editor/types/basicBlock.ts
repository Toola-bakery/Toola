export interface BasicBlock {
	id: string;
	parentId: string | null;
	pageId: string;
	display?: {
		hide?: boolean;
		hideOnMobile?: boolean;
	};
	show?: boolean;
}
