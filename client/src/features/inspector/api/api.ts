import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { QueryProperty } from '../hooks/useQueryConstructor';

export type Database = {
	_id: string;
	name: string;
	type: 'mongodb';
	actions: DatabaseAction[];
};

export type DatabaseAction = {
	name: string;
	fields: QueryProperty[];
};

export function useDatabases() {
	const { data, ...rest } = useQuery<Database[]>('/databases/getAll');

	const newData: Database[] =
		data?.map((db: Omit<Database, 'actions'> & { actions?: Database['actions'] }) => ({
			actions: [
				{
					name: 'find',
					fields: [
						{ type: 'string', label: 'Collection', id: 'collection' },
						{ type: 'object', label: 'Filter', id: 'filter' },
						{ type: 'object', label: 'Project', id: 'project' },
						{ type: 'object', label: 'Sort', id: 'sort' },
						{ type: 'number', label: 'Limit', id: 'limit' },
						{ type: 'number', label: 'Skip', id: 'skip' },
					],
				},
			],
			...db,
		})) || [];

	return {
		data: newData,
		...rest,
	};
}

export function useDatabase(databaseId?: string) {
	const { data, ...rest } = useDatabases();
	const selectedDatabase = useMemo(() => data.find((d) => d._id === databaseId) || { actions: [] }, [data, databaseId]);
	return { data: selectedDatabase, ...rest };
}

export function useDatabaseAction(databaseId?: string, actionName?: string) {
	const { data, ...rest } = useDatabases();
	const selectedDatabase = useMemo(() => data.find((d) => d._id === databaseId) || { actions: [] }, [data, databaseId]);

	const selectedAction = useMemo(
		() => selectedDatabase.actions?.find((action) => action.name === actionName),
		[selectedDatabase.actions, actionName],
	);

	return { data: selectedAction, ...rest };
}
