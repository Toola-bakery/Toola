import { Card, HTMLTable } from '@blueprintjs/core';
import JSONTree from 'react-json-tree';
import { useBlockLayout, usePagination, useResizeColumns, useRowSelect, useTable } from 'react-table';
import React, { useCallback } from 'react';
import { v4 } from 'uuid';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { useBlockSetState } from '../../../hooks/useBlockSetState';
import { usePageNavigator } from '../../../../../hooks/usePageNavigator';
import { usePage } from '../../Page/hooks/usePage';
import { useTableBlockColumnsAndData } from './hooks/useTableBlockColumnsAndData';
import { useTableColumnResizing } from './hooks/useTableColumnResizing';
import { useTableInspector } from './hooks/useTableInspector';
import { BasicBlock } from '../../../types/basicBlock';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useEditor } from '../../../hooks/useEditor';
import { ColumnDnD } from './ColumnDnD';
import { TablePagination } from './TablePagination';
import { TableStyles } from './TableStyles';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
	columns?: TableColumnsProp;
	manualPagination: boolean;
	connectedPage?: string;
};

export enum ColumnTypes {
	json = 'json',
	image = 'image',
	text = 'text',
}

export type TableColumnsProp = {
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
	const { id, manualPagination, connectedPage } = block;
	const { editing } = usePageContext();
	const { updateBlockState, immerBlockProps } = useEditor();
	const { navigate } = usePageNavigator();
	const { data, calculatedColumns, isLoading } = useTableBlockColumnsAndData(block, editing);

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
	useBlockSetState<TableBlockState>('pageIndex', pageIndex);
	useBlockSetState<TableBlockState>('pageSize', pageSize);

	const { onContextMenu, inspectorProps } = useTableInspector(block);
	useTableColumnResizing(columnResizing);

	const addColumn = useCallback(() => {
		immerBlockProps<TableBlockProps>(id, (draft) => {
			if (!draft.columns) draft.columns = [];
			draft.columns.push({ id: v4(), header: 'column', type: ColumnTypes.text, value: '' });
		});
	}, [id, immerBlockProps]);

	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<TableStyles>
				<Card style={{ overflow: 'hidden', padding: 0, zIndex: 1000 }}>
					<div style={{ overflow: 'scroll', maxHeight: 500 }}>
						<HTMLTable
							bordered
							striped
							{...getTableProps()}
							onContextMenu={(e) => onContextMenu(e, ['global'])}
							className="table"
						>
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
														else onContextMenu(e, [`col${column.id}`]);
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
													<td className="td" {...cell.getCellProps()} title={cellValue}>
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
		</>
	);
}
