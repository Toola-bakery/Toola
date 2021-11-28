import { Button, H3 } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

const RESOURCE_LIST = [
	{ name: 'mongo', label: 'Mongodb' },
	{ name: 'postgresql', label: 'PostgreSQL' },
];
export function AddResource() {
	const history = useHistory();
	return (
		<div style={{ padding: 30, flex: 1 }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<H3>Select Resource</H3>
			</div>
			{RESOURCE_LIST.map((resource) => (
				<Button intent="primary" onClick={() => history.push(`/resources/${resource.name}`)} text={resource.label} />
			))}
		</div>
	);
}
