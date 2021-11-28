import { useMemo } from 'react';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { useReferences } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';

export function useCardStyle(index = 0) {
	const [backgroundColor, setBackgroundColor] = useBlockProperty<string>('backgroundColor');
	const backgroundColorCalculated = useReferences(backgroundColor || '');
	const backgroundColorCalculatedArray = Array.isArray(backgroundColorCalculated)
		? backgroundColorCalculated
		: [backgroundColorCalculated];
	// eslint-disable-next-line no-template-curly-in-string
	const [borderRadius, setBorderRadius] = useBlockProperty<string>('borderRadius', '3px');
	const borderRadiusCalculated = useReferences(borderRadius);

	// eslint-disable-next-line no-template-curly-in-string
	const [borderColor, setBorderColor] = useBlockProperty<string>('borderColor', '#dcdcdd');
	// const borderRadiusCalculated = useReferences(borderRadius);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				type: 'nested',
				label: 'Style',
				icon: 'style',
				next: [
					{
						type: 'input',
						value: backgroundColor || '',
						onChange: setBackgroundColor,
						label: 'Background color',
					},
					{
						type: 'input',
						value: borderRadius || '',
						onChange: setBorderRadius,
						label: 'Border radius',
					},
					{
						type: 'input',
						value: borderColor || '',
						onChange: setBorderColor,
						label: 'Border color',
					},
				],
			},
		],
		[backgroundColor, borderColor, borderRadius, setBackgroundColor, setBorderColor, setBorderRadius],
	);
	useAppendBlockMenu(menu, index);

	return {
		borderRadiusCalculated,
		borderColor,
		backgroundColor,
		backgroundColorCalculatedArray,
		backgroundColorCalculated,
	};
}
