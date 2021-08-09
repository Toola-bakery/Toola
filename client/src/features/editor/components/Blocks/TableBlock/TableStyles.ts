import styled from 'styled-components';

export const TableStyles = styled.div`
	.table {
		min-height: 100px;
		.tr {
			max-height: 250px;
			overflow-y: hidden;
			.td {
				padding: 5px;
			}
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
