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
	const [value, setValue] = useBlockProperty('value', '');
	const data = useReferences(value);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: setValue,
				value,
			},
		],
		[setValue, value],
	);
	useAppendBlockMenu(menu, 1);
	const { showInspector } = useBlockContext();

	if (hide || !show) return null;

	return (
		<div style={{ padding: 4 }} onContextMenu={showInspector}>
			<PlotlyChart
				data={Array.isArray(data) ? data : []}
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
