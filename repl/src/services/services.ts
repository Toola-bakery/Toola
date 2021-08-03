import { ActionHandler, ActionSchema } from 'moleculer';
import { FunctionsService } from './functions/functions.service';

const Services = {
	FunctionsService,
};

type ExtractDefinition<P> = P extends ActionHandler<infer T> ? T : never;

type Actions<Acts> = { [key in keyof Acts]: ExtractDefinition<Acts[key]> };

type ActionList = {
	[key in keyof typeof Services as typeof Services[key]['name']]: Actions<typeof Services[key]['actions']>;
};

type SimpleFlatten<T> = {
	[Service in keyof T]: {
		[Action in keyof T[Service] as `${string & Service}.${string & Action}`]: T[Service][Action];
	};
}[keyof T];

export type ActionsDeclarations = SimpleFlatten<ActionList>;
