import { Button } from '@blueprintjs/core';
import { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';

type FeatureItem = { title: ReactNode | string; description: ReactNode | string; video?: string; image?: string };
const BORDER_RADIUS = 12;

const StyledHeading = styled.h2`
	font-size: 20px;
	font-weight: 800;
	line-height: 1.3;
	margin-bottom: 0;

	@media screen and (min-width: 900px) {
		& {
			font-size: 30px;
			letter-spacing: -0.5px;
			line-height: 30px;
		}
	}
`;

const StyledDescription = styled.p`
	font-size: 20px;
	line-height: 1.3;
	margin-top: 10px;
	margin-bottom: 10px;

	@media screen and (min-width: 900px) {
		& {
			font-size: 20px;
			letter-spacing: -0.2px;
			line-height: 30px;
		}
	}
`;

function RenderVideoOrImage({ video, image, active }: { active: boolean } & Partial<FeatureItem>) {
	if (image)
		return (
			<img
				src={image}
				style={{
					width: '100%',
					height: '100%',
					backgroundColor: 'transparent',
					top: 0,
					left: 0,
					position: 'absolute',
					borderRadius: BORDER_RADIUS,
					overflow: 'hidden',
					display: active ? 'block' : 'none',
				}}
			/>
		);
	if (video?.includes('mp4'))
		return (
			<video
				autoPlay
				playsInline
				loop
				muted
				onPlay={(draft) => {
					draft.currentTarget.playbackRate = 1.5;
				}}
				style={{
					width: '100%',
					height: '100%',
					backgroundColor: 'transparent',
					top: 0,
					left: 0,
					position: 'absolute',
					borderRadius: BORDER_RADIUS,
					overflow: 'hidden',
					display: active ? 'block' : 'none',
				}}
			>
				<source src={video} type="video/mp4" className="jsx-3758113214" />
			</video>
		);
	return (
		<iframe
			title="Test"
			src={`${video}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
			frameBorder="0"
			allowFullScreen
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: 'transparent',
				top: 0,
				left: 0,
				position: 'absolute',
				borderRadius: BORDER_RADIUS,
				overflow: 'hidden',
				display: active ? 'block' : 'none',
			}}
		/>
	);
}

export function FeatureBlock({
	items,
	...defaultItem
}: {
	items?: ({ name: string } & Partial<FeatureItem>)[];
} & Partial<FeatureItem>) {
	const [currentIndex, setCurrentIndex] = useState<null | number>(items?.length ? 0 : null);
	const currentItem = (currentIndex !== null && items?.[currentIndex]) || null;
	const title = useMemo(() => currentItem?.title || defaultItem.title, [currentItem, defaultItem.title]);
	const description = useMemo(
		() => currentItem?.description || defaultItem.description,
		[currentItem, defaultItem.description],
	);
	const video = useMemo(() => currentItem?.video || defaultItem.video, [currentItem, defaultItem.video]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				paddingLeft: 90,
				paddingRight: 90,
				alignItems: 'center',
				marginBottom: 60,
			}}
		>
			<div style={{ width: '40%', paddingRight: 60 }}>
				<StyledHeading>{title}</StyledHeading>
				<StyledDescription>{description}</StyledDescription>
				<div>
					{items?.map((item, index) => (
						<Button
							style={{ display: 'block', margin: '4px 0' }}
							minimal
							key={item.name}
							active={currentIndex === index}
							onClick={() => setCurrentIndex(index)}
						>
							{item.name}
						</Button>
					))}
				</div>
			</div>
			<div style={{ width: '60%' }}>
				<div
					style={{
						position: 'relative',
						paddingBottom: '62.5%',
						height: 0,
						boxShadow: '0 2px 8px rgb(84 70 35 / 15%), 0 1px 3px rgb(84 70 35 / 15%)',
						borderRadius: BORDER_RADIUS,
					}}
				>
					{!items?.length && video ? <RenderVideoOrImage video={video} active /> : null}
					{items?.map((item, index) => (
						<RenderVideoOrImage {...item} active={index === currentIndex} />
					))}
				</div>
			</div>
		</div>
	);
}
