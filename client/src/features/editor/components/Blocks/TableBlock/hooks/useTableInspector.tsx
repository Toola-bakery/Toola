import { useBlock } from '../../../../hooks/useBlock';
import { useBlockProperty } from '../../../../hooks/useBlockProperty';
import { ColumnTypes, TableBlockProps, TableColumnProp } from '../TableBlock';
import { MenuItemProps } from '../../../../../inspector/components/InspectorItem';
import { useBlockInspectorState } from '../../../../../inspector/hooks/useBlockInspectorState';
import { useEditor } from '../../../../hooks/useEditor';

export function useTableInspector() {
	const { id } = useBlock();
	const [manualPagination] = useBlockProperty('manualPagination', false);
	const [connectedPage] = useBlockProperty<string | undefined>('connectedPage');
	const [columns, setColumns] = useBlockProperty<TableColumnProp[] | undefined>('columns');

	const [value] = useBlockProperty('value', '');

	const { immerBlockProps } = useEditor();

	const columnMenus =
		columns?.map<MenuItemProps>((col) => ({
			type: 'nested',
			label: `col${col.id}`,
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

	const { onContextMenu, inspectorProps } = useBlockInspectorState((defaultMenuWrap) => [
		{
			type: 'nested',
			label: 'global',
			next: defaultMenuWrap([
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
			]),
		},
		...columnMenus,
	]);

	return { onContextMenu, inspectorProps };
}
