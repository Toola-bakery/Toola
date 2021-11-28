import dayjs from 'dayjs';
import React from 'react';
import JSONTree from 'react-json-tree';
import { Cell } from 'react-table';
import { validate } from 'uuid';
import { PageButton } from '../../components/PageButton';

export enum ColumnTypes {
	json = 'json',
	image = 'image',
	text = 'text',
	date = 'date',
	pageId = 'pageId',
}

function stringifyCellValue(cell: Cell) {
	return ['string', 'number'].includes(typeof cell.value) ? cell.value : JSON.stringify(cell.value);
}

const renderList: { [key in ColumnTypes]: (cell: Cell) => JSX.Element | null } = {
	[ColumnTypes.json]: (cell: Cell) => {
		return <JSONTree data={cell.value} />;
	},
	[ColumnTypes.image]: (cell: Cell) => {
		const cellValue = stringifyCellValue(cell);
		if (Array.isArray(cell.value))
			return (
				<>
					{cell.value.map((url, i) => (
						// eslint-disable-next-line react/no-array-index-key
						<img key={`${url}${i}`} src={url} style={{ width: '100%' }} />
					))}
				</>
			);
		return cellValue ? <img src={cellValue} style={{ width: '100%' }} /> : null;
	},
	[ColumnTypes.text]: (cell) => stringifyCellValue(cell) || '',
	[ColumnTypes.date]: (cell) => {
		return <>{dayjs(stringifyCellValue(cell)).format('DD.MM.YYYY HH:mm')}</>;
	},
	[ColumnTypes.pageId]: (cell) => {
		return validate(cell.value) ? <PageButton pageId={cell.value} /> : <></>;
	},
};

export function RenderCellType({ cell }: { cell: Cell }) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const type = cell.column.type as string;
	if (type in renderList) {
		return renderList[type as ColumnTypes](cell);
	}
	return renderList[ColumnTypes.text](cell);
}
