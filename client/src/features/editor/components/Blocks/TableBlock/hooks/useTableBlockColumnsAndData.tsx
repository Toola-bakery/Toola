import { useCallback, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { v4 } from 'uuid';
import { usePrevious } from '../../../../../../hooks/usePrevious';
import { useRefLatest } from '../../../../../../hooks/useRefLatest';
import { useBlockProperty } from '../../../../hooks/useBlockProperty';
import { TableColumnProp } from '../TableBlock';
import { usePageContext, useReferenceEvaluator } from '../../../../../executor/hooks/useReferences';

export function useTableBlockColumnsAndData() {
	const { editing } = usePageContext();
	const [columns, setColumns] = useBlockProperty<TableColumnProp[] | undefined>('columns');
	const [value] = useBlockProperty('value', '');

	const { evaluate, isLoading } = useReferenceEvaluator();

	const data = useMemo<any[]>(() => {
		const state = evaluate(value);
		if (Array.isArray(state)) return state;
		if (typeof state === 'object') return [state];
		return [];
	}, [evaluate, value]);

	const calculateColumnsFromData = useCallback(() => {
		const keys = new Set<string>();
		data.forEach((row) => {
			if (typeof row === 'object' && row !== null) Object.keys(row).forEach((key) => keys.add(key));
		});
		return Array.from(keys).map<TableColumnProp>((accessor) => ({
			header: accessor,
			value: `\${current["${accessor}"]}`,
			width: 150,
			id: v4(),
			custom: false,
		}));
	}, [data]);

	const previousValue = usePrevious(value);

	useEffect(() => {
		if (!previousValue || !value || value === previousValue) return;
		const newColumns = calculateColumnsFromData();
		if (newColumns.length) setColumns([...(columns?.filter((c) => c.custom) || []), ...newColumns]);
	}, [calculateColumnsFromData, previousValue, setColumns, value, columns]);

	const reactTableColumns = useMemo<Column[]>(() => {
		const cols: Column[] = (columns || []).map((col) => ({
			Header: col.header,
			accessor: (originalRow) => evaluate(col.value, originalRow),
			minWidth: 100,
			maxWidth: 300,
			width: col.width || 150,
			type: col.type,
			id: col.id,
		}));
		const addCellWidth = 35;
		if (editing)
			cols.push({
				id: 'add',
				Header: '+',
				accessor: () => '',
				maxWidth: addCellWidth,
				minWidth: addCellWidth,
				width: addCellWidth,
				// type: ColumnTypes.text,
			});
		return cols;
	}, [columns, evaluate, editing]);

	return { reactTableColumns, data, isLoading };
}
