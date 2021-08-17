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

		th,
		td {
			word-wrap: break-word;

			.resizer {
				right: 0;
				background: rgba(0, 0, 0, 0.2);
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
