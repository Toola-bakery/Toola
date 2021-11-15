import { Classes, Menu } from '@blueprintjs/core';
import { Popover2, Popover2TargetProps } from '@blueprintjs/popover2';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { InspectorItem, MenuItemProps } from './InspectorItem';
import { NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { ViewMenuItemProps } from './InspectorItems/ViewItem';

export type BlockInspectorProps = {
	menu: MenuItemProps[];
	isOpen: [number, number] | false;
	close: () => void;
	path: string[];
	setPath: (state: ((oldPath: string[]) => string[]) | string[]) => void;
};

const StyledMenu = styled(Menu)`
	max-height: 350px;
	overflow-y: auto;
	.bp4-menu-item-icon:empty {
		display: none !important;
	}
`;

export function BlockInspector({ isOpen, menu, close, path, setPath }: BlockInspectorProps) {
	const state = path.reduce<(NestedMenuItemProps | ViewMenuItemProps)['next']>((acc, key) => {
		if (!Array.isArray(acc)) return acc;
		const nextItem = acc.find((item) => item.label === key) as NestedMenuItemProps | ViewMenuItemProps;
		return nextItem?.next;
	}, menu);

	const el = useMemo(() => document.createElement('div'), []);

	useEffect(() => {
		document.body.append(el);
		return () => el.remove();
	});
	const renderTarget = useCallback(
		(props: Popover2TargetProps) =>
			isOpen ? (
				<>
					{ReactDOM.createPortal(
						<div
							{...props}
							className={Classes.CONTEXT_MENU_POPOVER_TARGET}
							style={{ position: 'fixed', top: isOpen[1], left: isOpen[0] }}
						/>,
						el,
					)}
				</>
			) : (
				<></>
			),
		[el, isOpen],
	);

	if (!isOpen || !state) return null;
	return (
		<Popover2
			positioningStrategy="fixed"
			content={
				Array.isArray(state) ? (
					<StyledMenu
						style={{
							boxShadow: '0 0 0 1px rgb(17 20 24 / 10%), 0 2px 4px rgb(17 20 24 / 20%), 0 8px 24px rgb(17 20 24 / 20%)',
						}}
					>
						{state
							.filter((item) => !item.hide)
							.map((item) => (
								<InspectorItem key={item.label} close={close} item={item} setPath={setPath} />
							))}
					</StyledMenu>
				) : (
					state({}) || <></>
				)
			}
			minimal
			key={`${isOpen[0]}x${isOpen[1]}`}
			renderTarget={renderTarget}
			isOpen={!!isOpen}
			placement="right-start"
			onClose={() => close()}
		/>
	);
}
