import { Button } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { usePageModal } from '../../pageModal/hooks/usePageModal';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { useCurrent } from '../../editor/hooks/useCurrent';
import { useReferenceEvaluator, useReferences } from '../../executor/hooks/useReferences';
import { useButtonEventHandler } from '../hooks/useButtonEventHandler';
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

	const [buttonName, setButtonName] = useBlockProperty('value', '');

	// eslint-disable-next-line no-template-curly-in-string
	const [rounded, setRounded] = useBlockProperty<string>('rounded', '${false}');
	const roundedCalculated = useReferences(rounded);

	// eslint-disable-next-line no-template-curly-in-string
	const [minimal, setMinimal] = useBlockProperty<string>('minimal', '${false}');
	const minimalCalculated = useReferences(minimal);

	const valueCalculated = useReferences(buttonName);

	const { trigger } = useButtonEventHandler(1);

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
				label: 'Style',
				icon: 'style',
				next: [
					{ type: 'input', value: minimal, onChange: setMinimal, label: 'Minimal' },
					{ type: 'input', value: rounded, onChange: setRounded, label: 'Rounded' },
				],
			},
		],
		[buttonName, minimal, rounded, setButtonName, setMinimal, setRounded],
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
					onClick={trigger}
					text={valueCalculated}
				/>
			</div>
		</>
	);
}
