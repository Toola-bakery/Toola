import ky from 'ky';
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: ({ queryKey }) => ky.get(`http://localhost:8080${queryKey[0]}`).json(),
		},
	},
});
