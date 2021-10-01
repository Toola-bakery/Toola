import { Button, H3 } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { ResourcesList } from '../../features/resources/components/ResourcesList';

export function ResourcesListRoute() {
	const history = useHistory();
	return (
		<div style={{ padding: 30, flex: 1 }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<H3>Resources</H3>
				<Button intent="primary" onClick={() => history.push('/resources/mongodb')} text="Create new" />
			</div>
			<ResourcesList />
		</div>
	);
}
