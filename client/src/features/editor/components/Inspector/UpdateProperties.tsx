import { useEditor } from '../../hooks/useEditor';
import { BasicBlock, Blocks } from '../../types';
import { CodeInput } from './CodeInput';

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
