import { Button, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { useInspectorState } from '../../inspector/hooks/useInspectorState';
import { usePages } from '../../editor/hooks/usePages';
import { BlockInspector } from '../../inspector/components/BlockInspector';
import { useTopLevelPages } from '../hooks/useTopLevelPages';

const StyledMenuDivider = styled(MenuDivider)`
	margin-right: 0;

	& .bp4-heading {
		padding-right: 0;
	}
`;

export function TopLevelPages() {
	const { pages } = useTopLevelPages();
	const { createPage, deletePage } = usePages();
	const { navigate } = usePageNavigator();
	const { pageId } = useParams<{ pageId: string }>();

	const { onContextMenu, inspectorProps } = useInspectorState({
		menu: pages.map((page) => ({
			type: 'nested',
			label: page.id,
			next: [
				{
					type: 'item',
					icon: 'trash',
					label: 'Delete page',
					closeAfterCall: true,
					call: () => deletePage(page.id),
				},
			],
		})),
	});

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<Menu style={{ minWidth: 50, background: 'transparent' }}>
				<StyledMenuDivider
					title={
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							Pages
							<Button icon="plus" minimal small onClick={createPage} />
						</div>
					}
				/>

				{pages.map((page) => (
					<MenuItem
						key={page.id}
						onContextMenu={(e) => onContextMenu(e, [page.id])}
						onClick={() => navigate(page.id)}
						active={page.id === pageId}
						icon="document"
						text={page.title}
					/>
				))}
			</Menu>
		</>
	);
}
