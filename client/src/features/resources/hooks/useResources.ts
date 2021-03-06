import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { QueryProperty } from '../../inspector/hooks/useQueryConstructor';

export type Database = {
	_id: string;
	name: string;
	type: 'mongodb';
	dbName: string;
	actions: DatabaseAction[];
};

export type DatabaseAction = {
	name: string;
	fields: QueryProperty[];
};

export function useResources() {
	const { currentProjectId } = useProjects();
	const { data, ...rest } = useQuery<Database[]>(['/databases/getAll', { projectId: currentProjectId }], {});

	const [defaultV] = useState([]);

	return {
		data: data || defaultV,
		...rest,
	};
}

export function useDatabase(databaseId?: string) {
	const { data, ...rest } = useResources();
	const selectedDatabase = useMemo(() => data.find((d) => d._id === databaseId) || { actions: [] }, [data, databaseId]);
	return { data: selectedDatabase, ...rest };
}

export function useDatabaseAction(databaseId?: string, actionName?: string) {
	const { data, ...rest } = useResources();
	const selectedDatabase = useMemo(() => data.find((d) => d._id === databaseId) || { actions: [] }, [data, databaseId]);

	const selectedAction = useMemo(
		() => selectedDatabase.actions?.find((action) => action.name === actionName),
		[selectedDatabase.actions, actionName],
	);

	return { data: selectedAction, ...rest };
}
