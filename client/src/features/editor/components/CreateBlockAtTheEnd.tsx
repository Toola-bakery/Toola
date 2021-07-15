import { useCallback } from 'react';
import { useEditor } from '../hooks/useEditor';

export type CreateBlockAtTheEndProps = {
	parentId: string;
};

export function CreateBlockAtTheEnd({ parentId }: CreateBlockAtTheEndProps): JSX.Element {
	const { addBlockIn } = useEditor();
	const handler = useCallback(() => {
		addBlockIn(parentId, {
			parentId,
			id: Math.random().toString(),
			type: 'text',
			html: '',
		});
	}, [addBlockIn, parentId]);
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
