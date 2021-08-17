import { useEffect } from 'react';
import { UseResizeColumnsState } from 'react-table';
import { usePrevious } from '../../../hooks/usePrevious';
import { TableBlockProps } from '../components/Blocks/TableBlock/TableBlock';
import { useBlock } from './useBlock';
import { useEditor } from './useEditor';

export function useTableColumnResizing(
	columnResizing: UseResizeColumnsState<Record<string, unknown>>['columnResizing'],
) {
	const { columnWidths, isResizingColumn } = columnResizing;
	const isResizingColumnPrevious = usePrevious(isResizingColumn);

	const { id } = useBlock();
	const { immerBlockProps } = useEditor();

	useEffect(() => {
		if (!isResizingColumn && isResizingColumnPrevious) {
			immerBlockProps<TableBlockProps>(id, (r) => {
				const col = r.columns?.find((c) => c.id === isResizingColumnPrevious);
				if (col) col.width = columnWidths[isResizingColumnPrevious];
			});
		}
	}, [columnWidths, id, immerBlockProps, isResizingColumn, isResizingColumnPrevious]);
}
