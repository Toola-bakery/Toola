import { useEffect } from 'react';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useBlockContext } from '../useBlockContext';

export function useAppendBlockMenu(menu: MenuItemProps[], index: number) {
	const { appendMenuParticle } = useBlockContext();

	useEffect(() => {
		return appendMenuParticle(menu, index);
	}, [appendMenuParticle, index, menu]);
}
