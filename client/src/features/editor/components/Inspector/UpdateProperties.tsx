import { TextField } from '@material-ui/core';
import { useEditor } from '../../hooks/useEditor';
import { Blocks } from '../../types';

export type UpdatePropertiesProps = {
	block: Blocks;
	properties: { propertyName: string; type: string }[];
};

export function UpdateProperties({ properties, block }: UpdatePropertiesProps) {
	const { updateBlockProps } = useEditor();

	return (
		<>
			{properties.map((prop) => (
				<TextField
					key={`${block.id}${prop.type}`}
					id="outlined-basic"
					label={prop.propertyName}
					variant="outlined"
					value={block[prop.propertyName as keyof Blocks]}
					onChange={(e) => {
						updateBlockProps({ id: block.id, pageId: block.pageId, [prop.propertyName]: e.target.value });
					}}
				/>
			))}
		</>
	);
}
