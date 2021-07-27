import equal from 'fast-deep-equal/es6';
import { Column, useFlexLayout, useResizeColumns, useRowSelect, useTable } from 'react-table';
import { useEffect, useMemo } from 'react';
import { usePrevious } from '../../../hooks/usePrevious';
import { BasicBlock } from '../../../types/basicBlock';
import { useReferenceEvaluator } from '../../../hooks/useReferences';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { UpdateProperties } from '../../Inspector/UpdateProperties';
import { BlockInspector } from '../../Inspector/BlockInspector';
import { useEditor } from '../../../hooks/useEditor';
import { TableStyles } from './TableStyles';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
	columns?: TableColumnsProp;
};
type TableColumnsProp = { header: string; value: string; width?: number }[];
export type TableBlockState = {
	page?: number;
};

export function TableBlock({ block }: { block: BasicBlock & TableBlockType }) {
	const { value, id, pageId, columns } = block;

	const { evaluate } = useReferenceEvaluator();

	const { updateBlockProps } = useEditor();

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
			updateBlockProps({ id, pageId, columns: columnsProp });
		}
	}, [columns, columnsProp, id, pageId, updateBlockProps]);

	const calculatedColumns = useMemo<Column[]>(() => {
		return columnsProp.map((col) => ({
			Header: col.header,
			accessor: (originalRow) => evaluate(col.value, originalRow),
			minWidth: 100,
			maxWidth: 300,
			width: col.width || 150,
		}));
	}, [columnsProp, evaluate]);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable(
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
			updateBlockProps({
				id,
				pageId,
				columns: columnsProp.map((v) => {
					if (v.header === isResizingColumnPrevious) return { ...v, width: columnWidths[isResizingColumnPrevious] };
					return v;
				}),
			});
		}
	}, [columnWidths, columnsProp, id, isResizingColumn, isResizingColumnPrevious, pageId, updateBlockProps]);

	const { onContextMenu, isOpen, close, menu } = useBlockInspectorState(
		id,
		[
			{
				key: 'Data Source',
				next: ({ block: _block }) => (
					<UpdateProperties block={_block} properties={[{ propertyName: 'value', type: 'code' }]} />
				),
			},
		],
		[columnsProp],
	);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<TableStyles>
				<div {...getTableProps()} style={undefined} className="table" onContextMenu={onContextMenu}>
					<div>
						{headerGroups.map((headerGroup) => (
							<div {...headerGroup.getHeaderGroupProps()} className="tr">
								{headerGroup.headers.map((column) => (
									<div {...column.getHeaderProps()} className="th">
										{column.render('Header')}
										<div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
									</div>
								))}
							</div>
						))}
					</div>
					<div {...getTableBodyProps()} className="tbody">
						{rows.map((row) => {
							prepareRow(row);
							return (
								<div {...row.getRowProps()} onClick={() => row.toggleRowSelected()} className="tr">
									{row.cells.map((cell) => {
										return (
											<div className="td" {...cell.getCellProps()}>
												{['string', 'number'].includes(typeof cell.value) ? cell.value : JSON.stringify(cell.value)}
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			</TableStyles>
		</>
	);
}
