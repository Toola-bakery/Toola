import { Button, HTMLSelect, Spinner } from '@blueprintjs/core';

export type TablePaginationProps = {
	page: number;
	count: number;
	onPageChange: (page: number) => void;

	rowsPerPage: number;
	rowsPerPageOptions: number[];
	onRowsPerPageChange: (rowsPerPage: number) => void;
	isLoading: boolean;
};
export function TablePagination({
	count,
	page,
	rowsPerPage,
	onRowsPerPageChange,
	rowsPerPageOptions,
	onPageChange,
	isLoading,
}: TablePaginationProps) {
	const maxPage = count === -1 ? 99999999 : Math.ceil(count / rowsPerPage);

	return (
		<div
			style={{
				padding: 5,
				paddingLeft: 10,
				paddingRight: 10,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				Rows per page
				<HTMLSelect
					minimal
					value={rowsPerPage}
					onChange={(event) => onRowsPerPageChange(+event.target.value)}
					options={rowsPerPageOptions}
				/>
			</div>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{isLoading ? <Spinner size={18} /> : null}
				<span style={{ marginLeft: 8 }}>{`Page ${page + 1}${count === -1 ? '' : ` of ${maxPage}`}`}</span>
				<Button minimal disabled={page === 0} onClick={() => onPageChange(Math.max(page - 1, 0))} icon="chevron-left" />
				<Button
					minimal
					disabled={page === maxPage}
					onClick={() => onPageChange(Math.min(page + 1, maxPage))}
					icon="chevron-right"
				/>
			</div>
		</div>
	);
}
