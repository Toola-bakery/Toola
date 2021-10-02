import { Button, FormGroup, H1, InputGroup } from '@blueprintjs/core';
import ky from 'ky';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Config } from '../Config';
import { useProjects } from '../features/user/hooks/useProjects';
import { useUser } from '../features/user/hooks/useUser';
import { useAppDispatch } from '../redux/hooks';

export default function CreateProjectRoute() {
	const [projectName, setProjectName] = useState('');
	const dispatch = useAppDispatch();
	const { refetch: fetchProjects, selectProject } = useProjects();
	const history = useHistory();

	const { authToken } = useUser();

	const { data, isLoading, refetch, isError } = useQuery(
		['createProject'],
		() => {
			return ky
				.post(`${Config.domain}/projects/create`, {
					json: { name: projectName },
					headers: { 'auth-token': authToken },
				})
				.json<{ projectId: string }>();
		},
		{ enabled: false, cacheTime: 0, retry: false, retryOnMount: false },
	);

	useEffect(() => {
		if (data?.projectId) {
			selectProject(data.projectId);
			fetchProjects();
			history.replace('/');
		}
	}, [data, dispatch, fetchProjects, history, selectProject]);

	return (
		<div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
			<div style={{ flexGrow: 1, maxWidth: 500 }}>
				<H1>Create project</H1>
				<FormGroup helperText="Only latin symbols, numbers, and _">
					<InputGroup
						intent={isError ? 'danger' : undefined}
						value={projectName}
						onChange={(v) => setProjectName(v.target.value)}
						id="text-input"
						placeholder="Project name"
					/>
				</FormGroup>
				<Button text="Create" onClick={() => refetch()} disabled={isLoading} loading={isLoading} />
			</div>
		</div>
	);
}
