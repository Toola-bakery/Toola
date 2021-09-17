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
		hasAccess: { userId: ObjectId; projectId: ObjectId };
	}
> = {
	name: 'projects',
	actions: {
		create: {
			params: {
				name: { type: 'string', min: '1' },
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
				const project = await projectsCollection.findOne({ _id: projectId }, { projection: { users: 1 } });
				if (!project) throw new Error('Project not exists');
				const hasAccess = project.users.some(a => a.equals(userId));
				return { hasAccess };
			},
		},
	},
};

export default ProjectsService;
