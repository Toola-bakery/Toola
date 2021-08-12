import {
	UseColumnOrderInstanceProps,
	UseColumnOrderState,
	UseFiltersColumnProps,
	UseGroupByColumnProps,
	UsePaginationInstanceProps,
	UsePaginationState,
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
			UsePaginationState<D>,
			UseRowSelectState<D> {}

	export interface TableOptions<D extends Record<string, unknown>>
		extends UseExpandedOptions<D>,
			UseFiltersOptions<D>,
			UseFiltersOptions<D>,
			UseGlobalFiltersOptions<D>,
			UseGroupByOptions<D>,
			UsePaginationOptions<D>,
			UseResizeColumnsOptions<D>,
			UseRowSelectOptions<D>,
			UseSortByOptions<D> {}

	export interface TableInstance<D extends Record<string, unknown>>
		extends UseColumnOrderInstanceProps<D>,
			UseRowSelectInstanceProps<D>,
			UsePaginationInstanceProps<D>,
			UseRowStateInstanceProps<D> {}
}
