import { useQuery } from 'react-query';
import { useProjects } from '../../../../usersAndProjects/hooks/useProjects';
import { BlockProps, Blocks } from '../../../types/blocks';
import { PageBlockProps } from '../Page';
import { BasicBlock } from '../../../types/basicBlock';

export type Page = {
	_id: string;
	value: { page: BasicBlock & PageBlockProps } & { [key: string]: BasicBlock & BlockProps };
};

export function usePages(search = '') {
	const { currentProjectId } = useProjects();
	return useQuery<Page[]>(['/pages/list', { projectId: currentProjectId, search }], {
		initialData: [],
	});
}
