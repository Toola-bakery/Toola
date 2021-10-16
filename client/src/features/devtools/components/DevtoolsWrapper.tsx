import { ReactNode } from 'react';
import * as React from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useDrawer } from '../../drawer/hooks/useDrawer';
import { usePageContext } from '../../executor/hooks/useReferences';
import { Devtools } from './Devtools';

export function DevtoolsWrapper({ children }: { children: ReactNode }) {
	const { isDevtoolsOpen } = usePageContext();
	const { height } = useWindowSize({ height: 1000 });
	const { size } = useDrawer({ name: 'devtools', maxSize: Math.floor(height * 0.75), defaultSize: 300 });

	return (
		<div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
			<div style={{ width: '100%', height: isDevtoolsOpen ? height - size : height }}>{children}</div>
			{isDevtoolsOpen ? <Devtools /> : null}
		</div>
	);
}
