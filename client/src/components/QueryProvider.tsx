import ky from 'ky';
import { PropsWithChildren, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Config } from '../Config';
import { useProjectsState } from '../features/usersAndProjects/hooks/useProjects';
import { useAppSelector } from '../redux/hooks';

export function QueryProvider({ children }: PropsWithChildren<{ a?: string }>) {
	const { currentProjectId } = useProjectsState();
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
							return api.get(`${Config.domain}${queryKey[0]}`, { searchParams: queryKey[1] as any }).json();
						},
					},
				},
			}),
		[api],
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
