import { Button } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { usePageModal } from '../../../pageModal/hooks/usePageModal';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../hooks/useBlock';
import { useBlockContext } from '../../hooks/useBlockContext';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { useCurrent } from '../../hooks/useCurrent';
import { useReferenceEvaluator, useReferences } from '../../../executor/hooks/useReferences';
import { CodeBlockType } from './CodeBlock/CodeBlock';
import { QueryBlockType } from './QueryBlock/QueryBlock';

export type ButtonBlockType = ButtonBlockProps;
export type ButtonBlockProps = {
	type: 'button';
	value: string;
	name: string;
};

export function ButtonBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { showInspector } = useBlockContext();

	const { blocks } = useCurrent();
	const [buttonName, setButtonName] = useBlockProperty('value', '');
	const [actionType, setActionType] = useBlockProperty('actionType', 'Custom code');
	const [query, setQuery] = useBlockProperty('triggerQuery', '');
	const [customCode, setCustomCode] = useBlockProperty('customCode', '');
	const [selectedPage, setSelectedPage] = useBlockProperty('selectedPage', '');
	const [pageParams, setPageParams] = useBlockProperty('pageParams', '');
	const { evaluate } = useReferenceEvaluator();
	const valueCalculated = useReferences(buttonName);
	const { navigate } = usePageNavigator();
	const { push } = usePageModal();

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Name',
				type: 'input',
				onChange: (v: string) => setButtonName(v),
				value: buttonName,
			},
			{
				label: 'Action type',
				type: 'select',
				options: ['Trigger query', 'Navigate page', 'Open modal', 'Custom code'],
				onChange: (v) => setActionType(v),
				value: actionType,
			},
			{
				label: 'Trigger',
				type: 'input',
				hide: actionType !== 'Custom code',
				onChange: (v: string) => setCustomCode(v),
				value: customCode,
			},
			{
				label: 'Select query',
				type: 'querySelector',
				hide: actionType !== 'Trigger query',
				onChange: (v: string) => setQuery(v),
				value: query,
			},
			{
				label: 'Select page',
				type: 'pages',
				hide: !['Navigate page', 'Open modal'].includes(actionType),
				onChange: (v: string) => setSelectedPage(v),
				value: selectedPage,
			},
			{
				label: 'Page params',
				type: 'input',
				hide: !['Navigate page', 'Open modal'].includes(actionType),
				onChange: (v: string) => setPageParams(v),
				value: pageParams,
			},
		],
		[
			actionType,
			buttonName,
			customCode,
			pageParams,
			query,
			selectedPage,
			setActionType,
			setButtonName,
			setCustomCode,
			setPageParams,
			setQuery,
			setSelectedPage,
		],
	);

	useAppendBlockMenu(menu, 1);

	if (hide || !show) return null;

	return (
		<>
			<div onContextMenu={showInspector}>
				<Button
					fill
					onClick={() => {
						if (actionType === 'Trigger query') {
							console.log(query, blocks[query]);
							return (blocks[query] as QueryBlockType | CodeBlockType).trigger();
						}
						if (actionType === 'Navigate page') {
							return navigate(selectedPage, evaluate(pageParams));
						}
						if (actionType === 'Open modal') {
							return push(selectedPage, evaluate(pageParams));
						}
						evaluate(customCode); // todo handle evaluate
					}}
					text={valueCalculated}
				/>
			</div>
		</>
	);
}
