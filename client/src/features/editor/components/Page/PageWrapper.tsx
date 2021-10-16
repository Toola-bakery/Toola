import { PropsWithChildren } from 'react';
import { BasicBlock } from '../../types/basicBlock';
import { PageBlockProps } from './Page';

export function PageWrapper({ page, children }: PropsWithChildren<{ page: BasicBlock & PageBlockProps }>) {
	return (
		<div
			style={{
				overflowY: 'auto',
				width: '100%',
				height: 'calc(100% - 40px)',
				backgroundColor: 'rgb(229 230 231)',
				alignItems: 'center',
			}}
		>
			<div
				style={
					page?.style === 'a4'
						? {
								backgroundColor: 'white',
								width: '21cm',
								paddingRight: 25,
								paddingTop: 15,
								minHeight: '29.7cm',
								margin: 'auto',
								marginTop: 20,
								marginBottom: 20,
						  }
						: { width: '100%', minHeight: '100%', backgroundColor: 'white', paddingRight: 25 }
				}
			>
				{children}
			</div>
		</div>
	);
}
