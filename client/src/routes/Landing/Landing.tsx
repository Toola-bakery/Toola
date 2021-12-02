import { Button } from '@blueprintjs/core';
import styled from 'styled-components';
import { useRelocateToAnyPageByCondition } from '../../features/drawer/hooks/useRelocateToAnyPageByCondition';
import { BeautyText } from '../../features/landing/BeautyText';
import { FeatureBlock } from '../../features/landing/FeatureBlock';
import { Logo } from '../../features/landing/Logo';
import { useUser } from '../../features/usersAndProjects/hooks/useUser';

const StyledHeading = styled.h1`
	font-size: 35px;
	font-weight: 800;
	line-height: 40px;
	margin-bottom: 20px;

	@media screen and (min-width: 900px) {
		& {
			font-size: 65px;
			font-weight: 800;
			letter-spacing: -1.5px;
			line-height: 70px;
			margin-bottom: 20px;
		}
	}
`;

export function Landing({ allowRedirect = false }: { allowRedirect?: boolean }) {
	const { userId } = useUser(true);
	useRelocateToAnyPageByCondition(!!userId && allowRedirect);

	if (userId && allowRedirect) return null;
	return (
		<div>
			<div style={{ position: 'fixed', top: 0 }}>
				<Logo />
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					paddingTop: '6%',
					width: '100%',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						marginBottom: 70,
						paddingLeft: 90,
						paddingRight: 90,
						alignItems: 'center',
					}}
				>
					<div style={{ width: '50%' }}>
						<StyledHeading>
							The Open Source
							<br />
							<BeautyText>Retool Alternative</BeautyText>
						</StyledHeading>
						<div style={{ marginBottom: 20, fontSize: 16, maxWidth: 500 }}>
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
					<div style={{ width: '50%' }}>
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
				<FeatureBlock
					title={<>Simple as Notion</>}
					description="It looks like Notion, but cells can run JavaScript or present as one of 30+ powerful blocks. Drag and drop your next level dashboard in 30 seconds. Focus on what makes your customers love, we will take the rest"
					video="https://cleanshot-cloud-fra.accelerator.net/media/26747/Y7zjc4HTwZBbCm0dpzVOG1BoysbKfdqd1Q1amIOu.mp4"
				/>
				<FeatureBlock
					title="Built for developers"
					description={
						<p>
							Use GUI and javascript with brackets like <code>${'{input.value}'}</code> to make simple queries;
							or&nbsp;brake <b>browser</b> limits with NodeJS functions&nbsp;+&nbsp;all npm packages preinstalled: file
							system, image processing, heavy calculations, large payloads, thousands http or database requests and so
							on...
						</p>
					}
					items={[
						{
							name: 'SQL query',
							video:
								'https://cleanshot-cloud-fra.accelerator.net/media/26747/IMT7Q4TOxAE1Hehz0A1aMGMShlMP6jyu65OE0CqI.mp4',
						},
						{
							name: 'NodeJS function',
							video:
								'https://cleanshot-cloud-fra.accelerator.net/media/26747/dQofUqgi2xRQcN0edsM4l8JKDCfCTByM3AomaL5N.mp4',
						},
					]}
				/>

				<FeatureBlock
					title="Workspace for every team"
					description="Build sharable and reusable tools that everyone can use. Use enterprise-ready access control to keep your data safe."
					items={[
						{
							name: 'Crypto dashboard',
							image: 'https://toola.fra1.cdn.digitaloceanspaces.com/Screenshot%202021-12-02%20at%2023.34.20.png',
						},
						{
							name: 'User view',
							video:
								'https://www.loom.com/embed/dc620936845847619f4073fbe6e554d2?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true',
						},
						{
							name: 'Sales manager page',
							video:
								'https://www.loom.com/embed/dc620936845847619f4073fbe6e554d2?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true',
						},
						{
							name: 'How do we calculate ROI',
							image: 'https://toola.fra1.cdn.digitaloceanspaces.com/Screenshot%202021-12-03%20at%2000.11.22.png',
						},
					]}
				/>
			</div>
		</div>
	);
}
