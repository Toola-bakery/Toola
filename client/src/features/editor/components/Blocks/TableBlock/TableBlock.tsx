import { Column, useTable } from 'react-table';
import { useMemo } from 'react';
import { BasicBlock } from '../../../types/basicBlock';
import { useReferences } from '../../../hooks/useReferences';
import { useBlockInspectorState } from '../../../hooks/useBlockInspectorState';
import { UpdateProperties } from '../../Inspector/UpdateProperties';
import { BlockInspector } from '../../Inspector/BlockInspector';

export type TableBlockType = TableBlockProps & TableBlockState;
export type TableBlockProps = {
	type: 'table';
	value: string;
};
export type TableBlockState = {
	page?: number;
};

export function TableBlock({ block }: { block: BasicBlock & TableBlockType }) {
	const { value, id } = block;

	const state = useReferences(value);

	const data = useMemo<any[]>(() => (Array.isArray(state) ? state : [state]), [state]);

	const columns = useMemo<Column[]>(
		() =>
			(typeof data[0] === 'object' && data[0] !== null ? Object.keys(data[0]) : []).map((accessor) => ({
				accessor,
			})),
		[data],
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

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
		[],
	);

	return (
		<>
			<BlockInspector context={{ block, id }} close={close} isOpen={isOpen} menu={menu} />
			<div style={{ maxWidth: 'calc( 100vw - 300px )', maxHeight: 400, overflow: 'auto' }}>
				<table
					{...getTableProps()}
					onContextMenu={onContextMenu}
					style={{ border: 'solid 1px blue', minWidth: 100, height: 400 }}
				>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th
										{...column.getHeaderProps()}
										style={{
											borderBottom: 'solid 3px red',
											background: 'aliceblue',
											color: 'black',
											fontWeight: 'bold',
										}}
									>
										{column.id}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map((row) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell) => {
										return (
											<td
												{...cell.getCellProps()}
												style={{
													padding: '10px',
													border: 'solid 1px gray',
													background: 'papayawhip',
												}}
											>
												{['string', 'number'].includes(typeof cell.value) ? cell.value : JSON.stringify(cell.value)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
