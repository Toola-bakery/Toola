import { useEffect, useState } from 'react';

export function useWindowSize<W extends number | undefined, H extends number | undefined>({
	width,
	height,
}: {
	width?: W;
	height?: H;
}) {
	const [windowSize, setWindowSize] = useState<{
		width: W | number;
		height: H | number;
	}>({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		width,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		height,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		// Add event listener
		window.addEventListener('resize', handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize();
		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
}
