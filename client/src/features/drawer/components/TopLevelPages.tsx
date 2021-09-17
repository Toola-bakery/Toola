import { Button, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import ky from 'ky';
import * as React from 'react';
import { v4 } from 'uuid';
import { Config } from '../../../config';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { PageBlockProps } from '../../editor/components/Page';
import { BasicBlock } from '../../editor/types/basicBlock';
import { useProjects } from '../../user/hooks/useProjects';
import { useUser } from '../../user/hooks/useUser';
import { useTopLevelPages } from '../hooks/useTopLevelPages';

export function TopLevelPages() {
	const { authToken } = useUser();
	const { currentProjectId } = useProjects();
	const { pages } = useTopLevelPages();
	const { navigate } = usePageNavigator();

	return (
		<Menu>
			<MenuDivider
				title={
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						Pages
						<Button
							icon="plus"
							minimal
							small
							onClick={() => {
								ky.post(`${Config.domain}/pages/create`, {
									json: { id: v4(), projectId: currentProjectId },
									headers: { 'auth-token': authToken },
								}).json<{
									value: { page: BasicBlock & PageBlockProps };
								}>();
							}}
						/>
					</div>
				}
			/>
			{/*Pages*/}

			{pages.map((page) => (
				<MenuItem onClick={() => navigate(page.id)} icon="document" text={page.title} />
			))}
		</Menu>
	);
}
