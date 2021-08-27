import { ReactNode } from 'react';

export function MenuItemWithInput({ children }: { children: ReactNode | undefined }) {
	return (
		<li>
			<div className="bp4-menu-item">{children}</div>
		</li>
	);
}
