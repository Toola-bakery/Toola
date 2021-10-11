import ky from 'ky';
import { useMemo } from 'react';
import { useUser } from '../features/usersAndProjects/hooks/useUser';

export function useKy() {
	const { authToken } = useUser(true);
	return useMemo(() => ky.create({ headers: { 'auth-token': authToken } }), [authToken]);
}
