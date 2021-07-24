import TextField from '@material-ui/core/TextField';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { UpdateProperties } from '../Inspector/UpdateProperties';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';
import { useEditor } from '../../hooks/useEditor';
import { useOnMountedEffect } from '../../../../hooks/useOnMounted';

export type InputBlockType = InputBlockProps & InputBlockState;
export type InputBlockProps = {
	type: 'input';
	initialValue: string;
	label: string;
};
export type InputBlockState = {
	value?: string;
};

export function InputBlock({ block }: { block: BasicBlock & InputBlockType }): JSX.Element {
	const { id, value, pageId, label, initialValue } = block;

	const { updateBlockState } = useEditor();

	useOnMountedEffect(() => {
		updateBlockState({ id, pageId, value: initialValue });
	});

	const { onContextMenu, isOpen, close, menu } = useBlockInspectorState(
		id,
		[
			{
				key: 'Initial Value',
				next: ({ block: _block }) => (
					<UpdateProperties
						block={_block}
						properties={[
							{ propertyName: 'initialValue', type: 'code' },
							{ propertyName: 'label', type: 'code' },
						]}
					/>
				),
			},
		],
		[],
	);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<div onContextMenu={onContextMenu}>
				<TextField
					id="outlined-basic"
					label={label || id}
					variant="outlined"
					value={value}
					autoComplete="off"
					onChange={(e) => {
						updateBlockState({ id, pageId, value: e.target.value });
					}}
				/>
			</div>
		</>
	);
}
