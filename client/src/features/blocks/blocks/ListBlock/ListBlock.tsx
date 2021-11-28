import { Card, Spinner } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../../editor/hooks/useBlockProperty';
import { BasicBlock } from '../../../editor/types/basicBlock';
import { CurrentContextProvider } from '../../../editor/components/CurrentContext';
import { parseIntSafe } from '../../helpers/parsers';
import { useCardStyle } from '../../hooks/useCardStyle';
import { useDataSource } from '../../hooks/useDataSource';
import { ColumnBlock, ColumnBlockType } from '../Layout/ColumnBlock';

export function ListBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { isLoading, valueCalculated } = useDataSource();
	useBlockProperty<string[]>('blocks', []);
	const [columnCount, setColumnCount] = useBlockProperty<number>('columnCount', 1);

	const data = useMemo<any[]>(() => {
		if (!valueCalculated) return [];
		return Array.isArray(valueCalculated) ? valueCalculated : [valueCalculated];
	}, [valueCalculated]);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Column count',
				type: 'numericInput',
				onChange: (v) => setColumnCount(v || 1),
				value: columnCount,
			},
		],
		[columnCount, setColumnCount],
	);
	useAppendBlockMenu(menu, 1);
	const { showInspector } = useBlockContext();

	const { borderColor, borderRadiusCalculated, backgroundColor, backgroundColorCalculatedArray } = useCardStyle(2);

	if (hide || !block.show) return null;

	return (
		<div style={{ display: 'flex', flexWrap: 'wrap' }} onContextMenu={showInspector}>
			{!data.length && isLoading
				? new Array(3).fill(0).map((_, i) => (
						<div
							style={{
								marginRight: (i + 1) % columnCount === 0 ? 0 : 30,
								width: `calc(100% * ${(1 / columnCount).toFixed(3)} - 30px + 30px * (${1 / columnCount}) )`,
								marginBottom: 13,
							}}
						>
							<Card
								style={{
									width: '100%',
									borderColor: borderColor || '#dcdcdd',
									borderStyle: 'solid',
									borderWidth: 1,
									backgroundColor:
										backgroundColorCalculatedArray?.[i % backgroundColorCalculatedArray.length] || 'white',
									borderRadius: borderRadiusCalculated,
									boxShadow: 'none',
									height: '100%',
								}}
								elevation={0}
							>
								<Spinner />
							</Card>
						</div>
				  ))
				: null}
			{data.map((item, i) => (
				<div
					style={{
						marginRight: (i + 1) % columnCount === 0 ? 0 : 30,
						width: `calc(100% * ${(1 / columnCount).toFixed(3)} - 30px + 30px * (${1 / columnCount}) )`,
						marginBottom: 13,
					}}
				>
					<CurrentContextProvider current={item}>
						<Card
							style={{
								width: '100%',
								borderColor: borderColor || '#dcdcdd',
								borderStyle: 'solid',
								borderWidth: 1,
								paddingTop: 20,
								paddingRight: 20,
								paddingBottom: 20,
								paddingLeft: 0,
								backgroundColor: backgroundColorCalculatedArray?.[i % backgroundColorCalculatedArray.length] || 'white',
								borderRadius: borderRadiusCalculated,
								boxShadow: 'none',
								height: '100%',
							}}
							elevation={0}
						>
							<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
						</Card>
					</CurrentContextProvider>
				</div>
			))}
		</div>
	);
}
