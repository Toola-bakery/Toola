import { useMemo } from 'react';
import * as React from 'react';
import { useProjects } from '../../user/hooks/useProjects';

type ProjectAvatarProps = {
	id?: string;
	size?: number;
	style?: React.CSSProperties;
};

export function ProjectAvatar({ id, size = 30, style }: ProjectAvatarProps) {
	const { projects, currentProjectId } = useProjects();
	const project = useMemo(
		() => projects.find((p) => p._id === (id || currentProjectId)),
		[currentProjectId, id, projects],
	);

	return (
		<div
			style={{
				width: size,
				height: size,
				lineHeight: `${size}px`,
				textAlign: 'center',
				color: 'rgba(255, 255, 255, 0.8)',
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				fontSize: `${size - 6}px`,
				borderRadius: 5,
				...style,
			}}
		>
			{project?.name.toUpperCase().charAt(0)}
		</div>
	);
}
