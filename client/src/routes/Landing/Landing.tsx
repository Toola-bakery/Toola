import { Button } from '@blueprintjs/core';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useRelocateToAnyPageByCondition } from '../../features/drawer/hooks/useRelocateToAnyPageByCondition';
import { BeautyText } from '../../features/landing/BeautyText';
import { FeatureBlock } from '../../features/landing/FeatureBlock';
import { HeaderFeatureBlock } from '../../features/landing/HeaderFeatureBlock';
import { Logo } from '../../features/landing/Logo';
import { useUser } from '../../features/usersAndProjects/hooks/useUser';

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
				<HeaderFeatureBlock />
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
							name: 'SQL Query',
							video:
								'https://cleanshot-cloud-fra.accelerator.net/media/26747/IMT7Q4TOxAE1Hehz0A1aMGMShlMP6jyu65OE0CqI.mp4',
						},
						{
							name: 'NodeJS Function',
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
