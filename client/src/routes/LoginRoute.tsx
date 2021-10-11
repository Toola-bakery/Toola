import { H1 } from '@blueprintjs/core';
import { useCallback, useEffect } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useUser } from '../features/usersAndProjects/hooks/useUser';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');

export default function LoginRoute() {
	const { authByToken, userId } = useUser();
	const history = useHistory();

	useEffect(() => {
		if (userId) history.replace('/');
	}, [history, userId]);

	const googleAuth = useCallback(async () => {
		const auth = getAuth();
		await signInWithPopup(auth, googleProvider);
		const token = await auth?.currentUser?.getIdToken();
		if (token) {
			authByToken(token);
		}
	}, [authByToken]);

	return (
		<div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
			<div style={{ flexGrow: 1, maxWidth: 500 }}>
				<H1 style={{ textAlign: 'center' }}>Log In</H1>

				<GoogleLoginButton align="center" onClick={() => googleAuth()} />
				{/*<Button onClick={() => logout()} text="logout" />*/}
			</div>
		</div>
	);
}
