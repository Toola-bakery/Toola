import { MenuItem, useHotkeys } from '@blueprintjs/core';
import { Omnibar } from '@blueprintjs/select';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { Page, usePages } from '../../editor/components/Page/hooks/usePages';

const PageOmnibar = Omnibar.ofType<Page>();

const OmnibarStyles = createGlobalStyle`
	.bp4-omnibar .bp4-menu {
		background-color: transparent;
		border-radius: 0;
		-webkit-box-shadow: inset 0 1px 0 rgb(17 20 24 / 15%);
		box-shadow: inset 0 1px 0 rgb(17 20 24 / 15%);
		max-height: calc(60vh - 40px);
		overflow: auto;
	}

	.bp4-omnibar {
		background-color: #fff;
		border-radius: 3px;
		box-shadow: 0 0 0 1px rgb(17 20 24 / 10%), 0 4px 8px rgb(17 20 24 / 20%), 0 18px 46px 6px rgb(17 20 24 / 20%);
		left: calc(50% - 250px);
		top: 20vh;
		width: 500px;
		z-index: 21;
	}
`;
export function DrawerOmnibar({ disabled, children }: PropsWithChildren<{ disabled?: boolean }>) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState('');
	const { data } = usePages(query);
	const { navigate } = usePageNavigator();

	useHotkeys(
		useMemo(
			() => [
				{
					combo: 'cmd+o',
					global: true,
					preventDefault: true,
					label: 'Search and open page',
					onKeyDown: () => setIsOpen(true),
				},
			],
			[setIsOpen],
		),
	);

	return (
		<>
			<OmnibarStyles />
			<PageOmnibar
				isOpen={isOpen && !disabled}
				noResults={<MenuItem disabled text="No results." />}
				items={data || []}
				itemRenderer={(page, { handleClick }) => (
					<MenuItem shouldDismissPopover key={page._id} onClick={handleClick} text={page.value.page.title} />
				)}
				onQueryChange={(newQuery) => setQuery(newQuery)}
				onItemSelect={(page) => {
					setQuery('');
					navigate(page._id);
					setIsOpen(false);
				}}
				query={query}
				onClose={() => setIsOpen(false)}
			/>
			<div onClick={() => setIsOpen(true)}>{children}</div>
		</>
	);
}
