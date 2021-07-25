import {
	UseColumnOrderInstanceProps,
	UseColumnOrderState,
	UseFiltersColumnProps,
	UseGroupByColumnProps,
	UseResizeColumnsColumnProps,
	UseResizeColumnsState,
	UseRowSelectInstanceProps,
	UseRowSelectRowProps,
	UseRowSelectState,
	UseRowStateInstanceProps,
	UseSortByColumnProps,
	UseTableRowProps,
} from 'react-table';

declare module 'react-table' {
	export interface Row<D extends Record<string, unknown>> extends UseTableRowProps<D>, UseRowSelectRowProps<D> {}

	export interface ColumnInstance<D extends Record<string, unknown>>
		extends UseFiltersColumnProps<D>,
			UseGroupByColumnProps<D>,
			UseResizeColumnsColumnProps<D>,
			UseSortByColumnProps<D> {}

	export interface TableState<D extends Record<string, unknown>>
		extends UseColumnOrderState<D>,
			UseResizeColumnsState<D>,
			UseRowSelectState<D> {}

	export interface TableInstance<D extends Record<string, unknown>>
		extends UseColumnOrderInstanceProps<D>,
			UseRowSelectInstanceProps<D>,
			UseRowStateInstanceProps<D> {}
}
