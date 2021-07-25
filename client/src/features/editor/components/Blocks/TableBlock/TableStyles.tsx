import styled from 'styled-components';

export const TableStyles = styled.div`
	display: flex;
	overflow: scroll;
	width: 100%;

	.table {
		border-spacing: 0;
		border: 1px solid black;
		display: flex;
		flex-direction: column;

		.thead {
		}

		.tbody {
		}

		.tr {
			:last-child {
				.td {
					border-bottom: 0;
				}
			}
			border-bottom: 1px solid black;
			max-height: 250px;
			overflow-y: hidden;
		}

		.th,
		.td {
			word-wrap: break-word;
			margin: 0;
			padding: 0.5rem;
			border-right: 1px solid black;

			${
				'' /* In this example we use an absolutely position resizer,
       so this is required. */
			}
			position: relative;

			:last-child {
				border-right: 0;
			}

			.resizer {
				right: 0;
				background: blue;
				width: 10px;
				height: 100%;
				position: absolute;
				top: 0;
				z-index: 1;
				${'' /* prevents from scrolling while dragging on touch devices */}
				touch-action :none;

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
