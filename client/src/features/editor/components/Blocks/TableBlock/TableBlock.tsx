import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import JSONTree from 'react-json-tree';
import { Column, useFlexLayout, useResizeColumns, useRowSelect, useTable } from 'react-table';
import { useCallback, useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { usePrevious } from '../../../../../hooks/usePrevious';
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

enum ColumnTypes {
	json = 'json',
	image = 'image',
	text = 'text',
}

type TableColumnsProp = {
	id: string;
	header: string;
	value: string;
	width?: number;
	type?: ColumnTypes;
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
			width: 150,
			id: v4(),
		}));
	}, [columns, data]);

	useEffect(() => {
		if (!columns && columnsProp.length > 0) {
			updateBlockProps({ id, columns: columnsProp });
		}
	}, [columns, columnsProp, id, pageId, updateBlockProps]);

	const calculatedColumns = useMemo<Column[]>(() => {
		const cols: Column[] = columnsProp.map((col) => ({
			Header: col.header,
			accessor: (originalRow) => evaluate(col.value, originalRow),
			minWidth: 100,
			maxWidth: 300,
			width: col.width || 150,
			type: col.type,
			id: col.id,
		}));
		cols.push({
			id: 'add',
			Header: '+',
			accessor: () => '',
			maxWidth: 20,
			minWidth: 20,
			width: 20,
			// type: ColumnTypes.text,
		});
		return cols;
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
				const col = r.columns?.find((c) => c.id === isResizingColumnPrevious);
				if (col) col.width = columnWidths[isResizingColumnPrevious];
			});
		}
	}, [columnWidths, id, immerBlockProps, isResizingColumn, isResizingColumnPrevious]);

	const columnMenus = columnsProp.map<MenuItemProps>((col) => ({
		type: 'nested',
		label: `col${col.id}`,
		next: [
			{
				label: 'Header',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						const colDraft = draft.columns?.find((c) => c.id === col.id);
						if (colDraft) colDraft.header = v;
					}),
				value: col.header,
			},
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						const colDraft = draft.columns?.find((c) => c.id === col.id);
						if (colDraft) colDraft.value = v;
					}),
				value: col.value,
			},
			{
				label: 'Column Type',
				type: 'select',
				options: Object.values(ColumnTypes),
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						const colDraft = draft.columns?.find((c) => c.id === col.id);
						if (colDraft) colDraft.type = v as ColumnTypes;
					}),
				value: col.type || ColumnTypes.text,
			},
			{
				label: 'deleteColumn',
				type: 'item',
				closeAfterCall: true,
				call: () =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						const colIndex = draft.columns?.findIndex((c) => c.id === col.id);
						if (typeof colIndex !== 'undefined' && colIndex >= 0 && draft.columns) draft.columns.splice(colIndex, 1);
					}),
			},
		],
	}));

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, (defaultMenu) => [
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
				...defaultMenu,
			],
		},
		...columnMenus,
	]);

	const addColumn = useCallback(() => {
		immerBlockProps<TableBlockProps>(id, (draft) => {
			if (!draft.columns) draft.columns = [];
			draft.columns.push({ id: v4(), header: 'column', type: ColumnTypes.text, value: '' });
		});
	}, [id, immerBlockProps]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<TableStyles>
				<TableContainer component={Paper}>
					<Table {...getTableProps()} onContextMenu={(e) => onContextMenu(e, ['global'])} className="table">
						<TableHead>
							{headerGroups.map((headerGroup) => (
								<TableRow {...headerGroup.getHeaderGroupProps()} className="tr">
									{headerGroup.headers.map((column) => (
										<TableCell
											{...column.getHeaderProps()}
											onClick={(e) => {
												if (column.id === 'add') addColumn();
												else onContextMenu(e, [`col${column.id}`]);
											}}
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
													{(() => {
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-ignore
														const type = cell.column.type as string;
														if (type === ColumnTypes.image) return <img src={cellValue} style={{ width: '100%' }} />;
														if (type === ColumnTypes.json) return <JSONTree data={cell.value} />;
														return cellValue;
													})()}
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
