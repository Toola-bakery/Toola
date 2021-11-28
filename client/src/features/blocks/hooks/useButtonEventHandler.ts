import { useCallback, useMemo } from 'react';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { useCurrent } from '../../editor/hooks/useCurrent';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { usePageModal } from '../../pageModal/hooks/usePageModal';
import { CodeBlockType } from '../blocks/CodeBlock/CodeBlock';
import { QueryBlockType } from '../blocks/QueryBlock/QueryBlock';

export function useButtonEventHandler(index = 1) {
	const [actionType, setActionType] = useBlockProperty('actionType', 'Custom code');
	const [query, setQuery] = useBlockProperty('triggerQuery', '');
	const [customCode, setCustomCode] = useBlockProperty('customCode', '');
	const [selectedPage, setSelectedPage] = useBlockProperty('selectedPage', '');
	const [pageParams, setPageParams] = useBlockProperty('pageParams', '');

	const menu = useMemo<MenuItemProps[]>(
		() => [
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
		],
		[
			actionType,
			customCode,
			pageParams,
			query,
			selectedPage,
			setActionType,
			setCustomCode,
			setPageParams,
			setQuery,
			setSelectedPage,
		],
	);

	useAppendBlockMenu(menu, index);
	const { blocks } = useCurrent();
	const { evaluate } = useReferenceEvaluator();
	const { navigate } = usePageNavigator();
	const { push } = usePageModal();

	const queryBlock = actionType === 'Trigger query' && blocks[query];
	const trigger = useCallback(() => {
		if (actionType === 'Trigger query') {
			return (queryBlock as QueryBlockType | CodeBlockType).trigger();
		}
		if (actionType === 'Navigate page') {
			return navigate(selectedPage, evaluate(pageParams));
		}
		if (actionType === 'Open modal') {
			return push(selectedPage, evaluate(pageParams));
		}
		evaluate(customCode); // todo handle evaluate
	}, [actionType, queryBlock, customCode, evaluate, navigate, pageParams, push, selectedPage]);

	return { trigger };
}
