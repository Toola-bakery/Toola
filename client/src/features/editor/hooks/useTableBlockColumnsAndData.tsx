import { useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { v4 } from 'uuid';
import { TableBlockType, TableColumnsProp } from '../components/Blocks/TableBlock/TableBlock';
import { BasicBlock } from '../types/basicBlock';
import { useEditor } from './useEditor';
import { useReferenceEvaluator } from './useReferences';

export function useTableBlockColumnsAndData(block: BasicBlock & TableBlockType) {
	const { columns, value, id, pageId } = block;

	const { evaluate, isLoading } = useReferenceEvaluator();

	const { updateBlockProps } = useEditor();

	const data = useMemo<any[]>(() => {
		const state = evaluate(value);
		if (Array.isArray(state)) return state;
		if (typeof state === 'object') return [state];
		return [];
	}, [evaluate, value]);

	const columnsProp = useMemo<TableColumnsProp>(() => {
		if (columns) return columns;
		const keys = new Set<string>();
		data.forEach((row) => {
			if (typeof row === 'object' && row !== null) Object.keys(row).forEach((key) => keys.add(key));
		});
		return Array.from(keys).map((accessor) => ({
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

	return { calculatedColumns, data, isLoading };
}
