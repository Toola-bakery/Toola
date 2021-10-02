import { createHash, createPrivateKey, createPublicKey, KeyObject } from 'crypto';
import * as fs from 'fs';
import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { SignJWT } from 'jose/jwt/sign';
import { generateKeyPair } from 'jose/util/generate_key_pair';
import { jwtVerify } from 'jose/jwt/verify';
import path from 'path';
import { v4 } from 'uuid';
import '../../utils/firebase';
import firebaseAdmin from 'firebase-admin';
import { UserSchema } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';
import { privateKeyString } from './keys/private.key';
import { publicKeyString } from './keys/public.key';

export type TokenSchema = {
	_id: ObjectId;
	userId: ObjectId;
	token: string;
	createdAt: Date;
	exp?: Date;
	isValid: boolean;
	ip: string;
	userAgent: string;
};

export type JWTSchema = {
	token: string;
	userId: string;
	exp: number;
};

const tokensCollection = mongoDB.collection<TokenSchema>('tokens');

tokensCollection.createIndex({ token: 1 });
tokensCollection.createIndex({ userId: 1, isValid: 1 });

const SALT = '36d21a4d-ba92-4d8c-86aa-45f9daee637e';

const privateKey = createPrivateKey(privateKeyString);
const publicKey = createPublicKey(publicKeyString);

export const AuthService: ServiceSchema<
	'auth',
	{
		tokens: { userId: ObjectId };
		createToken: {
			userId: ObjectId;
			meta: { userAgent?: string; ip?: string };
		};
		createCustomToken: {
			data: { [key: string]: unknown };
			exp?: string | number;
		};
		get: { authToken: string };
		hashPassword: { openPassword: string };
		validateToken: { authToken: string };
		login: { email: string; password: string };
		firebase: { idToken: string };
	}
> = {
	name: 'auth',
	actions: {
		hashPassword: {
			visibility: 'public',
			params: {
				openPassword: { type: 'string' },
			},
			handler(ctx) {
				const { openPassword } = ctx.params;
				const password = createHash('sha256') //
					.update(`${SALT}:${openPassword}`)
					.digest('base64');
				return { password };
			},
		},
		tokens: {
			params: { userId: { type: 'objectID', ObjectID: ObjectId, convert: true } },
			async handler(ctx) {
				const { userId } = ctx.params;
				const tokens = await tokensCollection.find({ userId }).toArray();
				return { tokens };
			},
		},
		get: {
			params: { authToken: { type: 'string' } },
			async handler(ctx) {
				const { authToken } = ctx.params;
				const token = await tokensCollection.findOne({ token: authToken });
				return { token };
			},
		},
		validateToken: {
			params: { authToken: { type: 'string' } },
			async handler(ctx) {
				const { authToken } = ctx.params;

				const { payload } = await jwtVerify(authToken, publicKey);

				if (payload.token) {
					if (typeof payload.userId !== 'string' || typeof payload.token !== 'string') throw new Error('Bad token');

					const { token } = await ctx.call<{ token: TokenSchema }, { authToken: string }>('auth.get', {
						authToken: payload.token,
					});

					if (!token.isValid) {
						throw new Error('ERR_INVALID_TOKEN');
					}
					return { userId: new ObjectId(payload.userId) };
				}

				if (typeof payload.projectId !== 'string') throw new Error('Bad token');
				return { projectId: new ObjectId(payload.projectId) };
			},
		},
		createToken: {
			visibility: 'public',
			params: { userId: { type: 'objectID', ObjectID: ObjectId, convert: true } },
			async handler(ctx) {
				const { userId } = ctx.params;
				const token: string = v4().replace(/-/g, '');
				const exp = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
				const jwt = await new SignJWT({ userId: userId.toHexString(), token })
					.setProtectedHeader({ alg: 'ES256' })
					.setIssuedAt()
					.setExpirationTime(Math.floor(exp.getTime() / 1000))
					.sign(privateKey);

				const result = await tokensCollection.insertOne({
					createdAt: new Date(),
					isValid: true,
					exp,
					token,
					userId,
					userAgent: ctx.meta.userAgent,
					ip: ctx.meta.ip,
				});
				return { token: jwt };
			},
		},
		createCustomToken: {
			visibility: 'public',
			params: {
				data: { type: 'object', minProps: 1 },
				exp: [
					{ type: 'string', optional: true },
					{ type: 'number', optional: true },
				],
			},
			async handler(ctx) {
				const { data, exp } = ctx.params;

				const jwt = await new SignJWT(data)
					.setProtectedHeader({ alg: 'ES256' })
					.setIssuedAt()
					.setExpirationTime(exp || Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60))
					.sign(privateKey);

				return { token: jwt };
			},
		},
		login: {
			params: {
				email: { type: 'email', normalize: true },
				password: { type: 'string' },
			},
			async handler(ctx) {
				const { email, password: openPassword } = ctx.params;

				const { password } = await ctx.call('auth.hashPassword', { openPassword });

				const { user } = await ctx.call<{ user: UserSchema }, { email: string }>('users.get', { email });
				if (!user || user.password !== password) throw new Error('Cant find user or bad password');

				const { token } = await ctx.call('auth.createToken', { userId: user._id });
				return { token, userId: user._id };
			},
		},
		firebase: {
			params: {
				idToken: { type: 'string' },
			},
			async handler(ctx) {
				const { idToken } = ctx.params;
				const { uid, firebase } = await firebaseAdmin.auth().verifyIdToken(idToken);
				const {
					emailVerified,
					email,
					displayName = email.split('@')[0],
					photoURL,
				} = await firebaseAdmin.auth().getUser(uid);
				if (!emailVerified) throw new Error('Подтвердите почту');

				const { userId } = await ctx.call('users.findOrCreate', {
					displayName,
					profileSrc: photoURL,
					email,
				});

				if (!userId) throw new Error('Cant get userId');
				const { token } = await ctx.call('auth.createToken', { userId });
				return { token, userId };
			},
		},
	},
};

export default AuthService;
