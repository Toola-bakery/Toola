import { HTMLTable } from '@blueprintjs/core';
import { useOnMountedEffect } from '../../../hooks/useOnMounted';
import { useDatabases } from '../hooks/useDatabases';

export function ResourcesList() {
	const { data, refetch } = useDatabases();

	useOnMountedEffect(() => {
		refetch();
	});

	return (
		<div style={{ display: 'flex', flex: 1 }}>
			<HTMLTable striped style={{ width: '100%' }}>
				<thead>
					<tr>
						<th>Resource name</th>
						<th>Resource id</th>
						<th>Database type</th>
						<th>Database name</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					{data.map((database) => {
						return (
							<tr key={database._id}>
								<td>{database.name}</td>
								<td>{database._id}</td>
								<td>{database.type}</td>
								<td>{database.dbName}</td>
								<td>{database.name}</td>
							</tr>
						);
					})}
				</tbody>
			</HTMLTable>
		</div>
	);
}
