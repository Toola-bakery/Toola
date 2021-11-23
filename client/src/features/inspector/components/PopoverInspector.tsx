import React, { useCallback, useEffect, useMemo } from 'react';
import { Classes, Menu } from '@blueprintjs/core';
import { Popover2, Popover2TargetProps } from '@blueprintjs/popover2';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { InspectorPropsType } from '../hooks/useInspectorState';
import { InspectorItem } from './InspectorItem';
import { NestedMenuItemProps } from './InspectorItems/NestedMenuItem';
import { ViewMenuItemProps } from './InspectorItems/ViewItem';

const StyledMenu = styled(Menu)`
	max-height: 350px;
	overflow-y: auto;
	.bp4-menu-item-icon:empty {
		display: none !important;
	}
`;

export function PopoverInspector({ inspectorProps }: { inspectorProps: InspectorPropsType }) {
	const { isOpen, menu, close, path, setPath } = inspectorProps;
	const state = path.reduce<(NestedMenuItemProps | ViewMenuItemProps)['next']>((acc, key) => {
		if (!Array.isArray(acc)) return acc;
		const nextItem = acc.find((item) => item.label === key) as NestedMenuItemProps | ViewMenuItemProps;
		return nextItem?.next;
	}, menu);

	const el = useMemo(() => {
		const div = document.createElement('div');
		div.className = 'popoverPortal';
		return div;
	}, []);

	useEffect(() => {
		if (!isOpen) el.remove();
	}, [isOpen, el]);

	const renderTarget = useCallback(
		(props: Popover2TargetProps) => {
			document.body.append(el);
			if (isOpen)
				return (
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
				);
			return <></>;
		},
		[el, isOpen],
	);

	const content = useMemo(
		() =>
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
				state?.({}) || <></>
			),
		[close, setPath, state],
	);
	if (!isOpen || !state) return null;
	return (
		<Popover2
			positioningStrategy="fixed"
			content={content}
			minimal
			key={`${isOpen[0]}x${isOpen[1]}`}
			renderTarget={renderTarget}
			isOpen={!!isOpen}
			placement="right-start"
			onClose={() => close()}
		/>
	);
}
