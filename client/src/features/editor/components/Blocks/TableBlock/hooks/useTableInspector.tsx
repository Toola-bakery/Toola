import { ColumnTypes, TableBlockProps, TableBlockType } from '../TableBlock';
import { MenuItemProps } from '../../../../../inspector/components/InspectorItem';
import { BasicBlock } from '../../../../types/basicBlock';
import { useBlockInspectorState } from '../../../../../inspector/hooks/useBlockInspectorState';
import { useEditor } from '../../../../hooks/useEditor';

export function useTableInspector(block: BasicBlock & TableBlockType) {
	const { columns, value, id, connectedPage, manualPagination } = block;

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
						immerBlockProps<TableBlockProps>(id, (draft) => {
							const colDraft = draft.columns?.find((c) => c.id === col.id);
							if (colDraft) colDraft.header = v;
						}),
					value: col.header,
				},
				{
					label: 'Data Source',
					type: 'input',
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							const colDraft = draft.columns?.find((c) => c.id === col.id);
							if (colDraft) colDraft.value = v;
						}),
					value: col.value,
				},
				{
					label: 'Column Type',
					type: 'select',
					options: Object.values(ColumnTypes),
					onChange: (v) =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							const colDraft = draft.columns?.find((c) => c.id === col.id);
							if (colDraft) colDraft.type = v as ColumnTypes;
						}),
					value: col.type || ColumnTypes.text,
				},
				{
					label: 'Delete column',
					type: 'item',
					closeAfterCall: true,
					call: () =>
						immerBlockProps<TableBlockProps>(id, (draft) => {
							const colIndex = draft.columns?.findIndex((c) => c.id === col.id);
							if (typeof colIndex !== 'undefined' && colIndex >= 0 && draft.columns) draft.columns.splice(colIndex, 1);
						}),
				},
			],
		})) || [];

	const { onContextMenu, inspectorProps } = useBlockInspectorState((defaultMenu) => [
		{
			type: 'nested',
			label: 'global',
			next: [
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
				...defaultMenu,
			],
		},
		...columnMenus,
	]);

	return { onContextMenu, inspectorProps };
}
