import ky from 'ky';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../config';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAuthValues } from '../redux/user';

export function useUser(skipFetch = false) {
	const { userId, authToken, currentUser } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery(['/users/get'], { enabled: !!authToken && !skipFetch, initialData: currentUser });

	const authByToken = useCallback(
		async (idToken: string) => {
			const response = await ky
				.post(`${Config.domain}/auth/firebase`, { json: { idToken } })
				.json<{ token: string; userId: string }>();

			dispatch(setAuthValues({ userId: response.userId, authToken: response.token }));
		},
		[dispatch],
	);

	return { authToken, userId, user, isLoading, refetch, authByToken };
}
