import { TextField } from '@material-ui/core';
import { useEditor } from '../../hooks/useEditor';
import { Blocks } from '../../types';

export type UpdatePropertiesProps = {
	id: string;
	block: Blocks;
	properties: { propertyName: string; type: string }[];
};

export function UpdateProperties({ id, properties, block }: UpdatePropertiesProps) {
	const { updateBlockProps } = useEditor();

	return (
		<>
			{properties.map((prop) => (
				<TextField
					key={`${id}${prop.type}`}
					id="outlined-basic"
					label={prop.propertyName}
					variant="outlined"
					value={block[prop.propertyName as keyof Blocks]}
					onChange={(e) => {
						updateBlockProps({ id, [prop.propertyName]: e.target.value });
					}}
				/>
			))}
		</>
	);
}
