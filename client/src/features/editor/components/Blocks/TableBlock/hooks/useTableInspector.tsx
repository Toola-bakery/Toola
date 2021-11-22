import { useMemo } from 'react';
import { useAppendBlockMenu } from '../../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../../hooks/useBlock';
import { useBlockProperty } from '../../../../hooks/useBlockProperty';
import { ColumnTypes } from '../RenderCellType';
import { TableBlockProps, TableColumnProp } from '../TableBlock';
import { MenuItemProps } from '../../../../../inspector/components/InspectorItem';
import { useEditor } from '../../../../hooks/useEditor';

export function useTableInspector() {
	const { id } = useBlock();
	const [manualPagination] = useBlockProperty('manualPagination', false);
	const [connectedPage] = useBlockProperty<string | undefined>('connectedPage');
	const [columns, setColumns] = useBlockProperty<TableColumnProp[] | undefined>('columns');

	const [value] = useBlockProperty('value', '');

	const { immerBlockProps } = useEditor();

	const menu = useMemo<MenuItemProps[]>(() => {
		const columnMenus =
			columns?.map<MenuItemProps>((col) => ({
				type: 'nested',
				label: `col${col.id}`,
				hide: true,
				next: [
					{
						label: 'Header',
						type: 'input',
						onChange: (v) =>
							setColumns((draft) => {
								const colDraft = draft?.find((c) => c.id === col.id);
								if (colDraft) {
									colDraft.header = v;
									colDraft.custom = true;
								}
							}),
						value: col.header,
					},
					{
						label: 'Data Source',
						type: 'input',
						onChange: (v) =>
							setColumns((draft) => {
								const colDraft = draft?.find((c) => c.id === col.id);
								if (colDraft) {
									colDraft.value = v;
									colDraft.custom = true;
								}
							}),
						value: col.value,
					},
					{
						label: 'Column Type',
						type: 'select',
						options: Object.values(ColumnTypes),
						onChange: (v) =>
							setColumns((draft) => {
								const colDraft = draft?.find((c) => c.id === col.id);
								if (colDraft) {
									colDraft.type = v as ColumnTypes;
									colDraft.custom = true;
								}
							}),
						value: col.type || ColumnTypes.text,
					},
					{
						label: 'Delete column',
						type: 'item',
						closeAfterCall: true,
						call: () =>
							setColumns((draft) => {
								const colIndex = draft?.findIndex((c) => c.id === col.id);
								if (typeof colIndex !== 'undefined' && colIndex >= 0 && draft) draft.splice(colIndex, 1);
							}),
					},
				],
			})) || [];
		return [
			{
				label: 'Connected Page Id',
				type: 'pages',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						draft.connectedPage = v;
					}),
				value: connectedPage || '',
			},
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						draft.value = v;
					}),
				value,
			},
			{
				label: 'Server Side Pagination',
				type: 'switch',
				value: Boolean(manualPagination),
				onChange: (v) =>
					immerBlockProps<TableBlockProps>(id, (draft) => {
						draft.manualPagination = v;
					}),
			},
			...columnMenus,
		];
	}, [columns, connectedPage, id, immerBlockProps, manualPagination, setColumns, value]);
	useAppendBlockMenu(menu, 1);
}
