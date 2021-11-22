import { Button } from '@blueprintjs/core';
import styled from 'styled-components';
import { useRelocateToAnyPageByCondition } from '../features/drawer/hooks/useRelocateToAnyPageByCondition';
import { useUser } from '../features/usersAndProjects/hooks/useUser';

const StyledHeading = styled.h1`
	font-size: 35px;
	font-weight: 800;
	line-height: 40px;
	margin-bottom: 20px;

	@media screen and (min-width: 900px) {
		& {
			font-size: 80px;
			font-weight: 800;
			letter-spacing: -1.5px;
			line-height: 90px;
			margin-bottom: 20px;
		}
	}
	.beauty {
		padding: 0 5px;
		background: linear-gradient(135deg, #6699ff 0%, #ff3366 100%);
		color: #b664b0;
		background-clip: text !important;
		-webkit-background-clip: text !important;
		-webkit-text-fill-color: transparent !important;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		-ms-text-fill-color: transparent;
		-webkit-box-decoration-break: clone;
	}
`;

export function Logo() {
	return (
		<div
			style={{
				fontSize: 20,
				fontWeight: 700,
				lineHeight: 30,
				display: 'flex',
				alignItems: 'center',
				height: 30,
				margin: 15,
			}}
		>
			<div style={{ fontSize: 30, marginRight: 5 }}>🍪</div>
			<span>Toola</span>
		</div>
	);
}

export function Landing({ allowRedirect = false }: { allowRedirect?: boolean }) {
	const { userId } = useUser(true);
	useRelocateToAnyPageByCondition(!!userId && allowRedirect);

	if (userId) return null;
	return (
		<div>
			<Logo />
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					paddingTop: '6%',
				}}
			>
				<div>
					<StyledHeading style={{ textAlign: 'center' }}>
						Build internal tools
						<br />
						<span className="beauty">
							<span>in minutes</span>
						</span>
					</StyledHeading>
				</div>
				<div style={{ marginBottom: 54, fontSize: 16 }}>Stop the mess of scripts, APIs, and UI libraries.</div>
				<Button
					text="Request access"
					outlined
					large
					intent="primary"
					onClick={() => {
						window.open('https://airtable.com/shrMtcUUyltKP9vUh', '_blank');
					}}
				/>
			</div>
		</div>
	);
}
