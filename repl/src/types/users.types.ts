import { ObjectId } from 'mongodb';

export type AuthMeta = { userId?: ObjectId; projectId?: ObjectId };

export type UserSchema = {
	_id: ObjectId;
	displayName?: string;
	profileSrc?: string;
	email: string;

	password?: string;

	createdAt: Date;
};
