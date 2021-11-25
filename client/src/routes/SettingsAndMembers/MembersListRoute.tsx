import { Button, H3, HTMLSelect, HTMLTable } from '@blueprintjs/core';
import { Dayjs } from '../../features/ui/components/Dayjs';
import { RoleIds, RoleNames, Roles, useMembers } from '../../features/usersAndProjects/hooks/useMembers';
import { useOnMountedEffect } from '../../hooks/useOnMounted';

export function MembersListRoute() {
	const { data, refetch, isFetched, updateRole } = useMembers();

	useOnMountedEffect(() => {
		if (isFetched) refetch();
	});

	return (
		<div style={{ padding: 30, flex: 1 }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<H3>Members</H3>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<Button style={{ marginLeft: 5 }} intent="primary" text="Invite users" />
				</div>
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
						{data.map(({ user, role }) => {
							return (
								<tr key={user._id}>
									<td>{user.displayName}</td>
									<td>{user.email}</td>
									<td>
										<Dayjs timeAgo time={user.createdAt} />
									</td>
									<td>
										<HTMLSelect
											onChange={async (event) => {
												updateRole.mutate({ userId: user._id, role: Number(event.target.value) as RoleIds });
											}}
											value={role || Roles.viewer}
											options={Object.values(Roles).map((roleId) => ({ label: RoleNames[roleId], value: roleId }))}
										/>
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
