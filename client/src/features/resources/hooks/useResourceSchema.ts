import { useEffect, useMemo } from 'react';
import { useQueries } from 'react-query';
import { useResources } from './useResources';

export function useResourceSchema() {
	const { data } = useResources();

	const queries = useMemo(
		() =>
			data.map((resource) => ({
				queryKey: ['/databases/schema', { id: resource._id }],
				refetchOnWindowFocus: false,
				retry: false,
			})),
		[data],
	);

	const responses = useQueries(queries);

	return useMemo(() => {
		return data.map((v, i) => ({ resource: v, schema: responses[i].data, schemaQuery: responses[i] }));
	}, [data, responses]);
}
