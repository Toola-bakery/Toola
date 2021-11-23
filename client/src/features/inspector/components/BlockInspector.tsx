import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { PopoverInspector } from './PopoverInspector';

export function BlockInspector() {
	const { inspectorProps } = useBlockContext();
	return <PopoverInspector inspectorProps={inspectorProps} />;
}
