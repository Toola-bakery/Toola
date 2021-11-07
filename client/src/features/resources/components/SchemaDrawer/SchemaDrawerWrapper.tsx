import { PropsWithChildren } from 'react';
import * as React from 'react';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { useDrawer } from '../../../drawer/hooks/useDrawer';
import { SchemaDrawer } from './SchemaDrawer';

export function SchemaDrawerWrapper({ children }: PropsWithChildren<{ resourcesFilter?: string[] }>) {
	const { size, isOpen } = useDrawer({ name: 'schemaDrawer' });
	const { width } = useWindowSize({ width: 1000 });

	return (
		<div style={{ display: 'flex', width: '100%', flexDirection: 'row', height: '100%' }}>
			<div style={{ height: '100%', width: width - 181 - (isOpen ? size : 0), overflowX: 'auto' }}>{children}</div>
			{isOpen ? <SchemaDrawer /> : null}
		</div>
	);
}
