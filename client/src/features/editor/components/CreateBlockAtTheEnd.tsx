import { useCallback } from 'react';
import { useEditor } from '../hooks/useEditor';

export type CreateBlockAtTheEndProps = {
	parentId: string;
};

export function CreateBlockAtTheEnd({ parentId }: CreateBlockAtTheEndProps): JSX.Element {
	const { addBlockIn } = useEditor();
	const handler = useCallback(() => {
		addBlockIn(parentId, {
			type: 'text',
			value: '',
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
