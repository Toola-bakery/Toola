import { MouseEventHandler, PropsWithChildren, TdHTMLAttributes, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HeaderGroup } from 'react-table';
import { useElementSize } from '../../../../../hooks/useElementSize';
import { useEditor } from '../../../hooks/useEditor';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { TableBlockProps } from './TableBlock';

type Item = { id: string; tableId: string; width: number };

export function ColumnDnD({
	children,
	column,
	tableId,
	onClick,
	...tableCell
}: PropsWithChildren<
	{ column: HeaderGroup; tableId: string; onClick: MouseEventHandler } & TdHTMLAttributes<HTMLTableHeaderCellElement>
>) {
	const {
		page: { editing },
	} = usePageContext();

	const { immerBlockProps } = useEditor();

	const colRef = useRef<HTMLTableHeaderCellElement>(null);
	const { width, height } = useElementSize(colRef);

	const [{ opacity, isDrag }, dragRef] = useDrag(
		() => ({
			type: 'Column',
			canDrag: editing,
			item: (): Item => ({ id: column.id, tableId, width }),
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
				isDrag: monitor.isDragging(),
			}),
		}),
		[column.id, editing, tableId, width],
	);

	const [{ isOver, draggingItem }, drop] = useDrop(
		() => ({
			accept: 'Column',
			canDrop(current: Item) {
				return current.tableId === tableId;
			},
			drop(current: Item) {
				immerBlockProps<TableBlockProps>(tableId, (draft) => {
					if (!draft.columns) return;
					const dragCol = draft.columns?.find((col) => col.id === current.id);
					if (dragCol)
						draft.columns = draft.columns?.reduce<Exclude<typeof draft['columns'], undefined>>((acc, col) => {
							if (col.id === column.id) acc.push(dragCol);
							if (col.id !== current.id) acc.push(col);
							return acc;
						}, []);
					if (column.id === 'add' && dragCol) draft.columns.push(dragCol);
				});
			},
			collect: (monitor) => ({
				isOver: monitor.canDrop() && monitor.isOver(),
				draggingItem: monitor.getItem() as Item,
			}),
		}),
		[column.id, editing, tableId, immerBlockProps],
	);

	const dragWidth = (isOver && draggingItem.width) || 0;

	const headerProps = column.getHeaderProps((props) => {
		return {
			style: {
				opacity,
				padding: 0,
				width: (parseInt(String(props.style?.width), 10) || 0) + dragWidth,
			},
		};
	});

	if (isDrag) return null;

	return (
		<th {...tableCell} {...headerProps} ref={colRef}>
			<div style={{ display: 'flex' }}>
				{draggingItem && draggingItem.id !== column.id && !isDrag ? (
					<div
						ref={drop}
						style={{
							height: height || 20,
							position: isOver ? 'relative' : 'absolute',
							width: isOver ? draggingItem.width : width - 50,
							zIndex: draggingItem ? 0 : 0,
						}}
						className="dndZone"
					/>
				) : null}
				<div
					ref={dragRef}
					style={{ width: parseInt(String(headerProps.style?.width), 10) - dragWidth }}
					onClick={onClick}
				>
					<div
						style={{
							marginTop: 16,
							marginBottom: 16,
							marginLeft: column.id === 'add' ? 0 : 16,
							marginRight: column.id === 'add' ? 0 : 16,
							textAlign: column.id === 'add' ? 'center' : 'left',
						}}
					>
						{column.render('Header')}
					</div>
				</div>
				<div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
			</div>
		</th>
	);
}
