import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { AuthMeta, UserSchema } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';

const EDITABLE_KEYS: (keyof UserSchema)[] = ['profileSrc', 'displayName'];
const PUBLIC_KEYS: (keyof UserSchema)[] = ['_id', 'profileSrc', 'email', 'createdAt', 'displayName'];
const PUBLIC_PROJECTION = PUBLIC_KEYS.reduce((acc, v) => ({ ...acc, [v]: 1 }), {});

export const usersCollection = mongoDB.collection<UserSchema>('users');

usersCollection.createIndex({ email: 1 }, { unique: true });

type FindOrCreateUser = {
	displayName: string;
	profileSrc?: string;
	email: string;
};

export const UsersService: ServiceSchema<
	'users',
	{
		create: FindOrCreateUser & {
			password?: string;
		};
		findOrCreate: FindOrCreateUser;
		get: {
			email?: string;
			userId?: ObjectId;
			userIds?: ObjectId[];
			publicData?: boolean;
			project?: any;
			meta: Partial<AuthMeta>;
		};
		edit: {
			userId: ObjectId;
			firstName?: string;
			secondName?: string;
			profileSrc?: string;
		};
	}
> = {
	name: 'users',
	actions: {
		create: {
			params: {
				displayName: { type: 'string', min: '1' },
				email: { type: 'email', normalize: true },
				profileSrc: { type: 'url', optional: true },
				password: {
					type: 'string',
					pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
					optional: true,
				},
			},
			async handler(ctx) {
				const { displayName, email, profileSrc, password: openPassword } = ctx.params;

				const { password = undefined } = openPassword
					? await ctx.call<{ password: string }, { openPassword: string }>('auth.hashPassword', {
							openPassword,
					  })
					: {};

				const user = await usersCollection
					.insertOne({
						password,
						email,
						displayName,
						profileSrc,
						createdAt: new Date(),
					})
					.catch(error => {
						console.log(error);
						if (error?.message?.includes('duplicate key')) throw new Error('User exists');
						else throw error;
					});

				return { userId: user?.insertedId };
			},
		},
		findOrCreate: {
			visibility: 'public',
			params: {
				displayName: { type: 'string', min: '1' },
				email: { type: 'email', normalize: true },
				profileSrc: { type: 'url', optional: true },
			},
			async handler(ctx) {
				const { displayName, email, profileSrc } = ctx.params;

				const { user } = await ctx.call<{ user: UserSchema | null }, { email: string; project: any }>('users.get', {
					email,
					project: { _id: 1 },
				});
				if (user) return { userId: user._id };
				return ctx.call<{ userId: ObjectId }, FindOrCreateUser>('users.create', { displayName, email, profileSrc });
			},
		},
		get: {
			params: {
				email: {
					type: 'email',
					optional: true,
					normalize: true,
				},
				userId: {
					type: 'objectID',
					ObjectID: ObjectId,
					convert: true,
					optional: true,
				},
				userIds: {
					type: 'array',
					items: { type: 'objectID', ObjectID: ObjectId, convert: true },
					optional: true,
				},
				publicData: { type: 'boolean', optional: true },
				project: { type: 'object', optional: true },
			},
			async handler(ctx) {
				const { userId, userIds, email, publicData = false, project } = ctx.params;
				const { userId: currentUserId } = ctx.meta;
				if (email) {
					const user = await usersCollection.findOne(
						{ email },
						publicData || project ? { projection: PUBLIC_PROJECTION || project } : undefined,
					);
					return { user };
				}

				if (userIds) {
					const users = await usersCollection
						.find(
							{ _id: { $in: userIds } },
							publicData || project ? { projection: PUBLIC_PROJECTION || project } : undefined,
						)
						.toArray();
					return { users };
				}
				if (userId || currentUserId) {
					const user = await usersCollection.findOne(
						{ _id: userId || new ObjectId(currentUserId) },
						publicData || project ? { projection: PUBLIC_PROJECTION || project } : undefined,
					);
					return { user };
				}

				throw new Error('Bad email or userId or userIds');
			},
		},
		edit: {
			params: {
				userId: { type: 'objectID', ObjectID: ObjectId, convert: true },
				profileSrc: { type: 'url', convert: true, optional: true },
				firstName: { type: 'string', optional: true },
				secondName: { type: 'string', optional: true },
				$$strict: 'remove',
			},
			async handler(ctx) {
				const { userId, ...editableData } = ctx.params;
				await usersCollection.updateOne({ _id: userId }, { $set: editableData });
				return { set: editableData };
			},
		},
	},
};

export default UsersService;
