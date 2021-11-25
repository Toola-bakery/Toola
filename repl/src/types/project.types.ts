import { ObjectId } from 'mongodb';

export const Roles = { admin: 100 as const, editor: 50 as const, viewer: 10 as const };
export type ProjectSchema = {
	_id: ObjectId;
	name: string;
	owner: ObjectId;
	createdBy: ObjectId;
	usersWithPermissions: { [_id: string]: { role: typeof Roles[keyof typeof Roles] } };
	users: ObjectId[];
};
