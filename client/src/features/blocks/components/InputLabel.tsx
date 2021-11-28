import { PropsWithChildren, ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { EditableText } from './EditableText';

const StyledInput = styled.div`
	.bp4-form-group {
		margin-bottom: 0;
	}
`;

type AlignOptions = 'left' | 'right' | 'center';
export function InputLabel({ children }: PropsWithChildren<{ children?: ReactNode }>) {
	const [label, setLabel] = useBlockProperty<string>('label', 'First name');
	const [labelAlign, setLabelAlign] = useBlockProperty<AlignOptions>('labelAlign', 'left');
	const [labelWidth, setLabelWidth] = useBlockProperty<number>('labelWidth', 33);
	const [labelInline, setInline] = useBlockProperty<boolean>('labelInline', true);
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
						label: 'Inline',
						type: 'switch',
						value: labelInline,
						onChange: setInline,
					},
					{
						label: 'Align',
						type: 'textAlign',
						value: labelAlign,
						onChange: (v) => setLabelAlign(v as AlignOptions),
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
		[label, labelAlign, labelInline, labelWidth, setInline, setLabel, setLabelAlign, setLabelWidth],
	);

	useAppendBlockMenu(menu, 2);

	return (
		<StyledInput
			style={{
				display: 'flex',
				alignItems: labelInline ? 'center' : undefined,
				flexDirection: labelInline ? 'row' : 'column',
				width: '100%',
			}}
		>
			{label ? (
				<div
					style={{
						display: 'flex',
						maxWidth: `${labelWidth}${labelWidthUnit}`,
						width: `${labelWidth}${labelWidthUnit}`,
						minWidth: `${labelWidth}${labelWidthUnit}`,
						alignItems: 'flex-start',
					}}
				>
					<EditableText
						style={{
							lineHeight: '30px',
							textAlign: labelAlign,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
						tagName="label"
						className="bp4-label"
						valuePropertyName="label"
						allowEntities={false}
					/>
				</div>
			) : null}
			{children}
		</StyledInput>
	);
}
