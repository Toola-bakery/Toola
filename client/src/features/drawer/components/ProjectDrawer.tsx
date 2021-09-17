import * as React from 'react';
import { useDrawer } from '../hooks/useDrawer';
import { ProjectBar } from './ProjectBar';
import { TopLevelPages } from './TopLevelPages';

export function ProjectDrawer() {
	const { width } = useDrawer();

	return (
		<div style={{ width }}>
			<ProjectBar />
			<TopLevelPages />
		</div>
	);
}
