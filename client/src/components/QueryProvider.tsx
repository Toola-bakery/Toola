import ky from 'ky';
import { PropsWithChildren, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAppSelector } from '../redux/hooks';

export function QueryProvider({ children }: PropsWithChildren<{ a?: string }>) {
	// This is the only place where you can get this values directly from redux.
	// In other cases use useUser() or useProjects()
	const { currentProjectId } = useAppSelector((state) => state.projects);
	const { authToken } = useAppSelector((state) => state.user);

	const api = useMemo(
		() =>
			ky.create({
				headers: { 'auth-token': authToken },
				searchParams: { projectId: currentProjectId || '' },
			}),
		[authToken, currentProjectId],
	);

	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						queryFn({ queryKey }) {
							return api.get(`http://localhost:8080${queryKey[0]}`, { searchParams: queryKey[1] as any }).json();
						},
					},
				},
			}),
		[api],
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
