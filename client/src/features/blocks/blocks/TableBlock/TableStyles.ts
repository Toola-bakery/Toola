import styled from 'styled-components';

export const TableStyles = styled.div`
	.table {
		min-height: 100px;

		thead th {
			background: white;
		}

		tr {
			max-height: 250px;
			overflow-y: hidden;
		}

		td {
			padding: 5px;
		}

		th,
		td {
			position: relative;
			word-wrap: break-word;

			.resizer {
				right: 0;
				width: 3px;
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

		.dndZone {
			left: -50px;
			height: 100%;
			top: 0;
			touch-action: none;
		}

		.dndFake {
			height: 100%;
			background: red;
			z-index: 1;
			touch-action: none;
		}
	}
`;
