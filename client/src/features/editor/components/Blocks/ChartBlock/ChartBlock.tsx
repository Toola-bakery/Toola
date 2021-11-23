import { Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import PlotlyChart from 'react-plotlyjs-ts';
import { useReferences } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty } from '../../../hooks/useBlockProperty';

export function ChartBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const [xValue, setXValue] = useBlockProperty('xValue', '');
	const [yValue, setYValue] = useBlockProperty('yValue', '');
	const xData = useReferences(xValue);
	const yData = useReferences(yValue);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'X axis array',
				type: 'input',
				onChange: setXValue,
				value: xValue,
			},
			{
				label: 'Y axis array',
				type: 'input',
				onChange: setYValue,
				value: yValue,
			},
		],
		[setXValue, setYValue, xValue, yValue],
	);
	useAppendBlockMenu(menu, 1);
	const { showInspector } = useBlockContext();

	if (hide || !show) return null;

	return (
		<div style={{ padding: 4 }} onContextMenu={showInspector}>
			<PlotlyChart
				data={
					Array.isArray(xData) && Array.isArray(yData)
						? [
								{
									x: xData,
									y: yData,
									type: 'line',
									marker: { color: '#033663' },
									mode: 'lines+markers',
								},
						  ]
						: []
				}
				config={{ displayModeBar: false }}
				layout={{
					margin: {
						l: 50,
						r: 50,
						b: 50,
						t: 25,
						pad: 4,
					},
				}}
			/>
		</div>
	);
}
