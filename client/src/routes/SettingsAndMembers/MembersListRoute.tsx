import { Button, H3, HTMLTable, Tag } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useMembers } from '../../features/usersAndProjects/hooks/useMembers';
import { useProjects } from '../../features/usersAndProjects/hooks/useProjects';
import { useOnMountedEffect } from '../../hooks/useOnMounted';

export function MembersListRoute() {
	const history = useHistory();
	const { data, refetch, isFetched } = useMembers();
	const { currentProject } = useProjects();

	useOnMountedEffect(() => {
		if (isFetched) refetch();
	});
	return (
		<div style={{ padding: 30, flex: 1 }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<H3>Members</H3>
				<Button intent="primary" onClick={() => history.push('/resources/mongodb')} text="Create new" />
			</div>
			<div style={{ display: 'flex', flex: 1 }}>
				<HTMLTable striped style={{ width: '100%' }}>
					<thead>
						<tr>
							<th>User name</th>
							<th>Email</th>
							<th>Created</th>
							<th>Permissions</th>
						</tr>
					</thead>
					<tbody>
						{data.map((user) => {
							return (
								<tr key={user._id}>
									<td>{user.displayName}</td>
									<td>{user.email}</td>
									<td>{user.createdAt}</td>
									<td>
										{currentProject?.owner === user._id ? (
											<Tag intent="danger" style={{ marginRight: 4 }} round>
												Owner
											</Tag>
										) : null}
										<Tag intent="success" round>
											User
										</Tag>
									</td>
								</tr>
							);
						})}
					</tbody>
				</HTMLTable>
			</div>
		</div>
	);
}
