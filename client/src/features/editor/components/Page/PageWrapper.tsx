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
				backgroundColor: page?.style === 'a4' ? 'rgb(229 230 231)' : 'white',
				alignItems: 'center',
				paddingTop: page?.style === 'a4' ? undefined : 15,
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
						: {
								...(page.isWide ? { width: '100%' } : { maxWidth: '21cm' }),
								minHeight: '100%',
								margin: 'auto',
								backgroundColor: 'white',
								paddingRight: 25,
						  }
				}
			>
				{children}
			</div>
		</div>
	);
}
