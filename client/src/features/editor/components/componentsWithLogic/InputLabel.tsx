import { useMemo } from 'react';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { EditableText } from './EditableText';

type AlignOptions = 'left' | 'right';
export function InputLabel() {
	const [label, setLabel] = useBlockProperty<string>('label', 'First name');
	const [labelAlign, setLabelAlign] = useBlockProperty<AlignOptions>('labelAlign', 'left');
	const [labelWidth, setLabelWidth] = useBlockProperty<number>('labelWidth', 33);
	const [labelWidthUnit, setLabelWidthUnit] = useBlockProperty<'%' | 'px' | 'col'>('labelWidthUnit', '%');

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Label',
				type: 'nested',
				icon: 'tag',
				next: [
					{ label: 'Label', type: 'input', value: label, onChange: setLabel },
					{
						label: 'Label align',
						type: 'select',
						value: labelAlign,
						onChange: (v) => setLabelAlign(v as AlignOptions),
						options: ['left', 'right'],
					},
					{
						label: 'Label width',
						type: 'input',
						value: labelWidth.toString(),
						onChange: (v) => setLabelWidth(parseInt(v, 10)),
					},
				],
			},
		],
		[label, labelAlign, labelWidth, setLabel, setLabelAlign, setLabelWidth],
	);

	useAppendBlockMenu(menu, 2);

	if (!label) return null;

	return (
		<div
			style={{
				maxWidth: `${labelWidth}${labelWidthUnit}`,
				width: `${labelWidth}${labelWidthUnit}`,
				minWidth: `${labelWidth}${labelWidthUnit}`,
				justifyContent: labelAlign === 'right' ? 'flex-end' : 'flex-start',
				alignItems: 'flex-start',
			}}
		>
			<EditableText
				style={{ lineHeight: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
				tagName="label"
				className="bp4-label"
				valuePropertyName="label"
				allowEntities={false}
			/>
		</div>
	);
}
