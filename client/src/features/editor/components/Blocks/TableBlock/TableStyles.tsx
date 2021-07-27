import styled from 'styled-components';

export const TableStyles = styled.div`
	.table {
		.tr {
			max-height: 250px;
			overflow-y: hidden;
		}

		.th,
		.td {
			word-wrap: break-word;

			.resizer {
				right: 0;
				background: blue;
				width: 1px;
				height: 100%;
				position: absolute;
				top: 0;
				z-index: 1;
				touch-action: none;

				&.isResizing {
					background: red;
				}
			}
		}
	}
`;

export function TableS() {
	return null;
}
