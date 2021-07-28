import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Column, useFlexLayout, useResizeColumns, useRowSelect, useTable } from 'react-table';
import { useEffect, useMemo } from 'react';
import { usePrevious } from '../../../hooks/usePrevious';
import { BasicBlock } from '../../../types/basicBlock';
import { useReferenceEvaluator } from '../../../hooks/useReferences';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { BlockInspector, MenuItemProps } from '../../Inspector/BlockInspector';
import { useEditor } from '../../../hooks/useEditor';
import { TableStyles } from './TableStyles';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
	columns?: TableColumnsProp;
};
type TableColumnsProp = {
	header: string;
	value: string;
	width?: number;
	type?: 'text' | 'image';
}[];

export type TableBlockState = {
	page?: number;
	selectedRow?: unknown;
};

export function TableBlock({ block }: { block: BasicBlock & TableBlockType }) {
	const { value, id, pageId, columns } = block;

	const { evaluate } = useReferenceEvaluator();

	const { updateBlockProps, updateBlockState, immerBlockProps } = useEditor();

	const data = useMemo<any[]>(() => {
		const state = evaluate(value);
		if (Array.isArray(state)) return state;
		if (typeof state === 'object') return [state];
		return [];
	}, [evaluate, value]);

	const columnsProp = useMemo<TableColumnsProp>(() => {
		if (columns) return columns;

		return (typeof data[0] === 'object' && data[0] !== null ? Object.keys(data[0]) : []).map((accessor) => ({
			header: accessor,
			value: `\${current["${accessor}"]}`,
		}));
	}, [columns, data]);

	useEffect(() => {
		if (!columns && columnsProp.length > 0) {
			updateBlockProps({ id, columns: columnsProp });
		}
	}, [columns, columnsProp, id, pageId, updateBlockProps]);

	const calculatedColumns = useMemo<Column[]>(() => {
		return columnsProp.map((col) => ({
			Header: col.header,
			accessor: (originalRow) => evaluate(col.value, originalRow),
			minWidth: 100,
			maxWidth: 300,
			width: col.width || 150,
			type: col.type,
		}));
	}, [columnsProp, evaluate]);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, toggleAllRowsSelected } = useTable(
		{
			columns: calculatedColumns,
			data,
		},
		useFlexLayout,
		useResizeColumns,
		useRowSelect,
	);

	const { columnWidths, isResizingColumn } = state.columnResizing;
	const isResizingColumnPrevious = usePrevious(isResizingColumn);

	useEffect(() => {
		if (!isResizingColumn && isResizingColumnPrevious) {
			immerBlockProps<TableBlockProps>(id, (r) => {
				const col = r.columns?.find((c) => c.header === isResizingColumnPrevious);
				if (col) col.width = columnWidths[isResizingColumnPrevious];
			});
		}
	}, [columnWidths, id, immerBlockProps, isResizingColumn, isResizingColumnPrevious]);

	const columnMenus = columnsProp.map<MenuItemProps>((col, index) => ({
		type: 'nested',
		label: `col${index}`,
		next: [
			{
				label: 'Header',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						if (draft.columns?.[index]) draft.columns[index].header = v;
					}),
				value: col.header,
			},
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						if (draft.columns?.[index]) draft.columns[index].value = v;
					}),
				value: col.value,
			},
			{
				label: 'Column Type',
				type: 'select',
				options: ['text', 'image'],
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						if (draft.columns?.[index]) draft.columns[index].type = v as 'text' | 'image';
					}),
				value: col.type || 'text',
			},
			{
				label: 'deleteColumn',
				type: 'item',
				closeAfterCall: true,
				call: () =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						if (draft.columns?.[index]) draft.columns.splice(index, 1);
					}),
			},
		],
	}));

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			type: 'nested',
			label: 'global',
			next: [
				{
					label: 'Data Source',
					type: 'input',
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							draft.value = v;
						}),
					value,
				},
			],
		},
		...columnMenus,
	]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<TableStyles>
				<TableContainer component={Paper}>
					<Table {...getTableProps()} onContextMenu={(e) => onContextMenu(e, ['global'])} className="table">
						<TableHead>
							{headerGroups.map((headerGroup) => (
								<TableRow {...headerGroup.getHeaderGroupProps()} className="tr">
									{headerGroup.headers.map((column, index) => (
										<TableCell
											{...column.getHeaderProps()}
											onClick={(e) => onContextMenu(e, [`col${index}`])}
											className="th"
										>
											{column.render('Header')}
											<div
												{...column.getResizerProps()}
												className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
											/>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableHead>
						<TableBody {...getTableBodyProps()} className="tbody">
							{rows.map((row) => {
								prepareRow(row);
								return (
									<TableRow
										{...row.getRowProps({
											style: { backgroundColor: row.isSelected ? 'rgba(127, 180, 235, 0.3)' : undefined },
										})}
										onClick={() => {
											const { isSelected } = row;
											toggleAllRowsSelected(false);
											if (!isSelected) row.toggleRowSelected();
											updateBlockState({ id, selectedRow: isSelected ? null : row.original });
										}}
										className="tr"
									>
										{row.cells.map((cell) => {
											const cellValue = ['string', 'number'].includes(typeof cell.value)
												? cell.value
												: JSON.stringify(cell.value);

											return (
												<TableCell className="td" {...cell.getCellProps()} title={cellValue}>
													{
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-ignore
														cell.column.type === 'image' ? <img src={cellValue} style={{ width: '100%' }} /> : cellValue
													}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</TableStyles>
		</>
	);
}
