import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { ProjectSchema } from '../../types/project.types';
import { AuthMeta } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';

export const projectsCollection = mongoDB.collection<ProjectSchema>('projects');

// projectsCollection.createIndex({ email: 1 }, { unique: true });

export const ProjectsService: ServiceSchema<
	'projects',
	{
		create: { name: string; meta: AuthMeta };
		get: { projection?: string[]; meta: AuthMeta };
		members: { projectId: ObjectId; populate: boolean; meta: AuthMeta };
		hasAccess: { userId: ObjectId; projectId: ObjectId };
		update: { projectId: ObjectId; name: string; meta: AuthMeta };
	}
> = {
	name: 'projects',
	actions: {
		create: {
			params: {
				name: { type: 'string', min: 1, max: 30 },
			},
			async handler(ctx) {
				const { name } = ctx.params;
				const { userId: _id } = ctx.meta;
				const userId = new ObjectId(_id);
				const result = await projectsCollection.insertOne({
					owner: userId,
					createdBy: userId,
					users: [userId],
					name,
				});

				return { projectId: result.insertedId };
			},
		},
		get: {
			params: {},
			async handler(ctx) {
				const { projection } = ctx.params;
				const { userId: _id } = ctx.meta;
				const userId = new ObjectId(_id);
				const projects = await projectsCollection.find({ users: userId }).toArray();
				return { projects };
			},
		},
		hasAccess: {
			visibility: 'public',
			params: {
				userId: { type: 'objectID', ObjectID: ObjectId, convert: true },
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
			},
			async handler(ctx) {
				const { userId, projectId } = ctx.params;
				const project = await projectsCollection.findOne({ _id: projectId, users: userId }, { projection: { _id: 1 } });
				return { hasAccess: !!project };
			},
		},
		members: {
			params: {
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
				populate: { type: 'boolean', optional: true, convert: true, default: false },
			},
			async handler(ctx) {
				const { projectId, populate } = ctx.params;
				const { userId } = ctx.meta;

				const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
				if (!hasAccess) throw new Error('No access to project');

				const project = await projectsCollection.findOne({ _id: projectId }, { projection: { users: 1 } });
				if (!project) throw new Error('Project not exists');
				if (!populate) return { users: project.users.map(_id => ({ _id })) };
				return ctx.call('users.get', {
					userIds: project.users.map(user => user.toHexString()),
					publicData: true,
				});
			},
		},
		update: {
			params: {
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
				name: { type: 'string', optional: true, convert: true, min: 3, max: 30, trim: true },
			},
			async handler(ctx) {
				const { projectId, name } = ctx.params;
				const { userId } = ctx.meta;
				const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
				if (!hasAccess) throw new Error('No access to project');
				await projectsCollection.updateOne({ _id: projectId }, { $set: { name } });
				return { ok: true };
			},
		},
	},
};

export default ProjectsService;
