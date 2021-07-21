import { useCallback } from 'react';
import { useEditor } from '../hooks/useEditor';

export type CreateBlockAtTheEndProps = {
	parentId: string;
	pageId: string;
};

export function CreateBlockAtTheEnd({ parentId, pageId }: CreateBlockAtTheEndProps): JSX.Element {
	const { addBlockIn } = useEditor();
	const handler = useCallback(() => {
		addBlockIn(parentId, {
			parentId,
			pageId,
			id: Math.random().toString(),
			type: 'text',
			value: '',
		});
	}, [addBlockIn, pageId, parentId]);
	return (
		<div
			style={{
				height: 100,
				width: '100%',
				cursor: 'text',
			}}
			onClick={handler}
		/>
	);
}
