import ky from 'ky';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Config } from '../../../config';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAuthValues } from '../redux/user';

export function useUser(skipFetch = false) {
	const { userId, authToken, currentUser } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	const history = useHistory();

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

	const logOut = useCallback(() => {
		dispatch({ type: 'USER_LOGOUT' });
		history.push('/');
	}, [dispatch, history]);

	return { authToken, userId, user, isLoading, refetch, authByToken, logOut };
}
