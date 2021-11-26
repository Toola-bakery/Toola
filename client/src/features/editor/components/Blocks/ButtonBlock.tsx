import { Button } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
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

const RoundedButton = styled(Button)<{ rounded?: boolean }>`
	&.rounded {
	}
	border-radius: ${(props) => (props.rounded ? '30px' : '3px')};
`;

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
	// eslint-disable-next-line no-template-curly-in-string
	const [rounded, setRounded] = useBlockProperty<string>('rounded', '${false}');
	const roundedCalculated = useReferences(rounded);

	// eslint-disable-next-line no-template-curly-in-string
	const [minimal, setMinimal] = useBlockProperty<string>('minimal', '${false}');
	const minimalCalculated = useReferences(minimal);

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
				type: 'nested',
				label: 'Event Handlers',
				icon: 'select',
				next: [
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
			},
			{
				type: 'nested',
				label: 'Style',
				icon: 'style',
				next: [
					{ type: 'input', value: minimal, onChange: setMinimal, label: 'Minimal' },
					{ type: 'input', value: rounded, onChange: setRounded, label: 'Rounded' },
				],
			},
		],
		[
			actionType,
			buttonName,
			customCode,
			minimal,
			pageParams,
			query,
			rounded,
			selectedPage,
			setActionType,
			setButtonName,
			setCustomCode,
			setMinimal,
			setPageParams,
			setQuery,
			setRounded,
			setSelectedPage,
		],
	);

	useAppendBlockMenu(menu, 1);

	if (hide || !show) return null;

	return (
		<>
			<div onContextMenu={showInspector}>
				<RoundedButton
					fill
					rounded={roundedCalculated === true}
					minimal={minimalCalculated === true}
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
