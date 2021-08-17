import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@material-ui/core';
import JSONTree from 'react-json-tree';
import { Column, useBlockLayout, usePagination, useResizeColumns, useRowSelect, useTable } from 'react-table';
import { useCallback, useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { usePrevious } from '../../../../../hooks/usePrevious';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { BasicBlock } from '../../../types/basicBlock';
import { useReferenceEvaluator } from '../../../hooks/useReferences';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { BlockInspector, MenuItemProps } from '../../Inspector/BlockInspector';
import { useEditor } from '../../../hooks/useEditor';
import { ColumnDnD } from './ColumnDnD';
import { TableStyles } from './TableStyles';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
	columns?: TableColumnsProp;
	manualPagination: boolean;
	connectedPage: string;
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
	pageIndex: number;
	pageSize: number;
};

export function TableBlock({ block }: { block: BasicBlock & TableBlockType }) {
	const { value, id, pageId, columns, manualPagination, connectedPage } = block;

	const { evaluate, isLoading } = useReferenceEvaluator();

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
		if ((!columns || columns.length === 0) && columnsProp.length > 0) {
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

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		rows,
		prepareRow,
		state,
		toggleAllRowsSelected,
		gotoPage,
		setPageSize,
	} = useTable(
		{
			columns: calculatedColumns,
			data,
			manualPagination,
			pageCount: manualPagination ? -1 : undefined,
		},
		useBlockLayout,
		useResizeColumns,
		usePagination,
		useRowSelect,
	);

	const { pageIndex, pageSize, columnResizing } = state;
	const { columnWidths, isResizingColumn } = columnResizing;
	const isResizingColumnPrevious = usePrevious(isResizingColumn);

	useBlockSetState<TableBlockState>('pageIndex', pageIndex);
	useBlockSetState<TableBlockState>('pageSize', pageSize);

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
				label: 'Delete column',
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
					label: 'Connected Page Id',
					type: 'input',
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							draft.connectedPage = v;
						}),
					value: connectedPage,
				},
				{
					label: 'Data Source',
					type: 'input',
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							draft.value = v;
						}),
					value,
				},
				{
					label: 'Server Side Pagination',
					type: 'switch',
					value: Boolean(manualPagination),
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							draft.manualPagination = v;
						}),
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

	const { navigate } = usePageNavigator();

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<TableStyles>
				<Paper>
					<TableContainer sx={{ maxHeight: 500 }}>
						<Table
							{...getTableProps()}
							stickyHeader
							onContextMenu={(e) => onContextMenu(e, ['global'])}
							className="table"
						>
							<TableHead style={{ position: 'sticky', top: 0 }}>
								{headerGroups.map((headerGroup) => (
									<TableRow {...headerGroup.getHeaderGroupProps()} className="tr">
										{headerGroup.headers.map((column) => {
											return (
												<ColumnDnD
													column={column}
													tableId={id}
													onClick={(e) => {
														if (column.id === 'add') addColumn();
														else onContextMenu(e, [`col${column.id}`]);
													}}
												/>
											);
										})}
									</TableRow>
								))}
							</TableHead>
							<TableBody {...getTableBodyProps()} className="tbody">
								{page.map((row) => {
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
											onDoubleClick={() => {
												if (connectedPage) {
													navigate(connectedPage, row.original);
												}
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
															if (type === ColumnTypes.image) {
																if (Array.isArray(cell.value))
																	return cell.value.map((url) => <img src={url} style={{ width: '100%' }} />);
																return cellValue ? <img src={cellValue} style={{ width: '100%' }} /> : null;
															}
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
					<TablePagination
						rowsPerPageOptions={[1, 5, 10, 25]}
						component="div"
						count={manualPagination ? -1 : rows.length}
						rowsPerPage={pageSize}
						page={pageIndex}
						onPageChange={(_, pageNumber) => {
							gotoPage(pageNumber);
						}}
						onRowsPerPageChange={(event) => setPageSize(+event.target.value)}
					/>
				</Paper>
			</TableStyles>
		</>
	);
}
