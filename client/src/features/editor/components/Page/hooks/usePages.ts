import { useQuery } from 'react-query';
import { useProjects } from '../../../../user/hooks/useProjects';
import { PageBlockProps } from '../Page';
import { BasicBlock } from '../../../types/basicBlock';

export type Page = {
	_id: string;
	value: { page: BasicBlock & PageBlockProps };
};

export function usePages(search = '') {
	const { currentProjectId } = useProjects();
	return useQuery<Page[]>(['/pages/list', { projectId: currentProjectId, search }], {
		initialData: [],
	});
}
