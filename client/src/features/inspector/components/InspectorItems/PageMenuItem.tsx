import { MenuItem, Button, FormGroup } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { usePage } from '../../../editor/components/Page/hooks/usePage';
import { Page, usePages } from '../../../editor/components/Page/hooks/usePages';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type PageMenuItemProps = BasicItemProps & {
	type: 'pages';
	value?: string;
	onChange: (_id: string) => void;
};

const PageSelect = Select.ofType<Page>();

const MenuGlobalStyle = styled(PageSelect)`
	.bp4-menu {
		max-height: 300px;
		max-width: 400px;
		overflow: auto;
		padding: 0;
	}
`;

export function PageMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<PageMenuItemProps>) {
	const [query, setQuery] = useState('');
	const { data: selectedPage } = usePage(item.value || '');
	const { data, isLoading } = usePages(query);

	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			text={
				<FormGroup style={{ marginBottom: 0 }} label={item.label} inline={inline}>
					<MenuGlobalStyle
						items={data || []}
						onQueryChange={(newQuery) => setQuery(newQuery)}
						noResults={<MenuItem key="no results" disabled text={isLoading ? 'Loading...' : 'No results.'} />}
						itemRenderer={(page, { handleClick }) => (
							<MenuItem
								shouldDismissPopover={false}
								key={page._id}
								onClick={handleClick}
								text={page.value.page.title}
							/>
						)}
						popoverProps={{ minimal: true, fill: true, position: 'bottom', usePortal: false }}
						onItemSelect={(a) => item.onChange(a._id)}
					>
						<Button
							fill
							text={selectedPage?.value.page.title || 'Выберите страницу'}
							rightIcon="double-caret-vertical"
						/>
					</MenuGlobalStyle>
				</FormGroup>
			}
		/>
	);
}
