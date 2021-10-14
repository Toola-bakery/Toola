import { Button, FormGroup, H3, InputGroup } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useProjects } from '../../features/usersAndProjects/hooks/useProjects';
import { useKy } from '../../hooks/useKy';

export function ProjectSettingsRoute() {
	const { currentProject, currentProjectId, refetch } = useProjects();

	const [name, setName] = useState(currentProject?.name);

	const currentName = currentProject?.name;

	useEffect(() => {
		if (currentName) setName(currentName);
	}, [currentName]);

	const ky = useKy();
	const mutation = useMutation({
		mutationFn: () => ky.post(`projects/update`, { json: { name, projectId: currentProjectId } }),
		onSuccess: () => refetch(),
	});

	return (
		<div style={{ padding: 30, flex: 1 }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<H3>Project settings</H3>
			</div>
			<div style={{ maxWidth: 600 }}>
				<FormGroup label="Project name">
					<InputGroup value={name} onChange={(e) => setName(e.target.value)} />
				</FormGroup>
				<Button text="Save" loading={mutation.isLoading} onClick={() => mutation.mutate()} />
			</div>
		</div>
	);
}
