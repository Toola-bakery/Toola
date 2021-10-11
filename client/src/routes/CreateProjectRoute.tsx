import { Button, FormGroup, H1, InputGroup } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Config } from '../Config';
import { useProjects } from '../features/usersAndProjects/hooks/useProjects';
import { useKy } from '../hooks/useKy';

export default function CreateProjectRoute() {
	const [projectName, setProjectName] = useState('');
	const { selectProject, refetch } = useProjects();
	const history = useHistory();

	const ky = useKy();

	const { data, isLoading, isError, mutate } = useMutation((name: string) => {
		return ky.post(`${Config.domain}/projects/create`, { json: { name } }).json<{ projectId: string }>();
	});

	useEffect(() => {
		if (data?.projectId) {
			selectProject(data.projectId);
			refetch().then(() => history.replace('/'));
		}
	}, [data, history, refetch, selectProject]);

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
				<Button text="Create" onClick={() => mutate(projectName)} disabled={isLoading} loading={isLoading} />
			</div>
		</div>
	);
}
