import { ObjectId } from 'mongodb';

export type ProjectSchema = {
	_id: ObjectId;
	name: string;
	owner: ObjectId;
	createdBy: ObjectId;
	users: ObjectId[];
};
