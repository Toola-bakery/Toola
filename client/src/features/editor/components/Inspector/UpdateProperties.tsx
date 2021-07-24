import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { CodeInput } from './CodeInput';
import { Blocks } from '../../types/blocks';

export type UpdatePropertiesProps = {
	block: BasicBlock & Blocks;
	properties: { propertyName: string; type: string }[];
};

export function UpdateProperties({ properties, block }: UpdatePropertiesProps) {
	const { updateBlockProps } = useEditor();

	return (
		<>
			{properties.map((prop) => (
				<CodeInput
					label={prop.propertyName}
					value={block[prop.propertyName as keyof Blocks] || ''}
					onChange={(value) => {
						updateBlockProps({ id: block.id, pageId: block.pageId, [prop.propertyName]: value });
					}}
				/>
			))}
		</>
	);
}
