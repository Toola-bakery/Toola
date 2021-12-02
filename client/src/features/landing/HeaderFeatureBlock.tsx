import { Button } from '@blueprintjs/core';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { BeautyText } from './BeautyText';

const StyledHeading = styled.h1`
	font-size: 35px;
	font-weight: 800;
	line-height: 40px;
	margin-bottom: 20px;
	text-align: center;

	@media screen and (min-width: 900px) {
		& {
			text-align: left;
			font-size: 65px;
			font-weight: 800;
			letter-spacing: -1.5px;
			line-height: 70px;
			margin-bottom: 20px;
		}
	}
`;

export function HeaderFeatureBlock() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: isMobile ? 'column' : 'row',
				width: '100%',
				marginBottom: 70,
				paddingLeft: isMobile ? 20 : 90,
				paddingRight: isMobile ? 20 : 90,
				alignItems: 'center',
			}}
		>
			<div style={{ width: isMobile ? '100%' : '50%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
				<StyledHeading>
					The Open Source
					<br />
					<BeautyText>Retool Alternative</BeautyText>
				</StyledHeading>
				<div style={{ marginBottom: 20, fontSize: 16, maxWidth: 500, textAlign: isMobile ? 'center' : 'left' }}>
					Build internal tools in minutes. Stop the mess of scripts, APIs, and UI libraries
				</div>
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
			<div style={{ width: isMobile ? '100%' : '50%', marginTop: isMobile ? 20 : 0 }}>
				<div style={{ position: 'relative', paddingBottom: '62.5%', height: 0 }}>
					<iframe
						title="Test"
						src="https://www.loom.com/embed/dc620936845847619f4073fbe6e554d2?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
						frameBorder="0"
						allowFullScreen
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'transparent',
							top: 0,
							left: 0,
							position: 'absolute',
							borderRadius: 8,
							overflow: 'hidden',
						}}
					/>
				</div>
			</div>
		</div>
	);
}
