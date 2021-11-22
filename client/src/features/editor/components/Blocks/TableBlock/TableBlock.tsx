import { Card, HTMLTable } from '@blueprintjs/core';
import JSONTree from 'react-json-tree';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useTable } from 'react-table';
import React, { useCallback } from 'react';
import { v4 } from 'uuid';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { usePageModal } from '../../../../pageModal/hooks/usePageModal';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../../hooks/useBlockProperty';
import { useSyncBlockState } from '../../../hooks/useSyncBlockState';
import { useTableBlockColumnsAndData } from './hooks/useTableBlockColumnsAndData';
import { useTableColumnResizing } from './hooks/useTableColumnResizing';
import { useTableInspector } from './hooks/useTableInspector';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { ColumnDnD } from './ColumnDnD';
import { ColumnTypes, RenderCellType } from './RenderCellType';
import { TablePagination } from './TablePagination';
import { TableStyles } from './TableStyles';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
	columns?: TableColumnProp[];
	manualPagination: boolean;
	connectedPage?: string;
};

export type TableColumnProp = {
	id: string;
	header: string;
	value: string;
	width?: number;
	type?: ColumnTypes;
	custom: boolean;
};

export type TableBlockState = {
	page?: number;
	selectedRow?: unknown;
	pageIndex: number;
	pageSize: number;
};

export function TableBlock({ hide }: { hide: boolean }) {
	const { id, show } = useBlock();

	const [manualPagination] = useBlockProperty('manualPagination', false);
	const [connectedPage] = useBlockProperty<string | undefined>('connectedPage');
	const [, setColumns] = useBlockProperty<TableColumnProp[] | undefined>('columns');
	const [, setSelectedRow] = useBlockState<any>('selectedRow');

	const {
		editing,
		page: { style },
	} = usePageContext();

	const { data, reactTableColumns, isLoading } = useTableBlockColumnsAndData();
	const modalHistory = usePageModal();
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
			columns: reactTableColumns,
			data,
			manualPagination,
			...(manualPagination ? { pageCount: -1 } : {}),
		},
		useBlockLayout,
		useResizeColumns,
		usePagination,
		useRowSelect,
	);

	const { pageIndex, pageSize, columnResizing } = state;
	useSyncBlockState<TableBlockState>('pageIndex', pageIndex);
	useSyncBlockState<TableBlockState>('pageSize', pageSize);

	const { showInspector } = useBlockContext();

	useTableColumnResizing(columnResizing);
	useTableInspector();

	const addColumn = useCallback(() => {
		setColumns((draft) => {
			const newColumn: TableColumnProp = {
				id: v4(),
				header: 'column',
				type: ColumnTypes.text,
				value: '',
				custom: true,
			};
			if (draft) draft.push(newColumn);
			else return [newColumn];
		});
	}, [setColumns]);

	if (hide || !show) return null;

	return (
		<TableStyles onContextMenu={showInspector}>
			<Card style={{ overflow: 'hidden', padding: 0, zIndex: 1000 }}>
				<div style={{ overflow: 'auto', height: style === 'a4' ? 'none' : 500 }}>
					<HTMLTable bordered striped {...getTableProps()} className="table">
						<thead style={{ position: 'sticky', top: 0, zIndex: 3 }}>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()} className="tr">
									{headerGroup.headers.map((column) => {
										return (
											<ColumnDnD
												key={column.id}
												column={column}
												tableId={id}
												allowResize={editing}
												onClick={(e) => {
													if (column.id === 'add') addColumn();
													else showInspector(e, [`col${column.id}`]);
												}}
												onContextMenu={(e) => {
													showInspector(e, [`col${column.id}`]);
													e.stopPropagation();
													e.preventDefault();
												}}
											/>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody {...getTableBodyProps()} className="tbody">
							{page.map((row) => {
								prepareRow(row);
								return (
									<tr
										{...row.getRowProps({
											style: { backgroundColor: row.isSelected ? 'rgba(127, 180, 235, 0.3)' : undefined },
										})}
										onClick={() => {
											const { isSelected } = row;
											toggleAllRowsSelected(false);
											if (!isSelected) row.toggleRowSelected();
											setSelectedRow(isSelected ? null : row.original);
										}}
										onDoubleClick={() => {
											if (connectedPage) {
												modalHistory.push(connectedPage, row.original);
											}
										}}
										className="tr"
									>
										{row.cells.map((cell) => {
											const cellValue = ['string', 'number'].includes(typeof cell.value)
												? cell.value
												: JSON.stringify(cell.value);

											return (
												<td className="td" {...cell.getCellProps()} title={cellValue}>
													<RenderCellType cell={cell} />
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</HTMLTable>
				</div>
				<TablePagination
					rowsPerPageOptions={[1, 5, 10, 25]}
					count={manualPagination ? -1 : rows.length}
					rowsPerPage={pageSize}
					page={pageIndex}
					onPageChange={gotoPage}
					onRowsPerPageChange={setPageSize}
					isLoading={isLoading}
				/>
			</Card>
		</TableStyles>
	);
}
