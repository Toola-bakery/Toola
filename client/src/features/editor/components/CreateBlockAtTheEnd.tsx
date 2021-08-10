import { useCallback } from 'react';
import { BlockCreators } from '../helpers/BlockCreators';
import { useEditor } from '../hooks/useEditor';

export type CreateBlockAtTheEndProps = {
	parentId: string;
};

export function CreateBlockAtTheEnd({ parentId }: CreateBlockAtTheEndProps): JSX.Element {
	const { addBlockIn } = useEditor();

	const handler = useCallback(() => {
		addBlockIn(parentId, BlockCreators.text());
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
