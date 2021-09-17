import * as React from 'react';
import { useProjects } from '../../user/hooks/useProjects';

export function ProjectBar() {
	const { currentProject } = useProjects();

	return (
		<div
			style={{
				height: 65,
				backgroundColor: 'rgb(240, 240, 240)',
				display: 'flex',
				alignItems: 'center',
				paddingLeft: 13,
			}}
		>
			{currentProject?.name}
		</div>
	);
}
