import { EntityHTMLTokens } from './TextEntitiesMutation';

type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never;

export type EntityItem =
	| { tag: undefined; styles: string[] }
	| { tag: 'span'; styles: string[] }
	| { tag: 'a'; styles: string[]; href: string };

export const TextPlugins = {
	i(state: EntityItem): EntityItem {
		state.styles.push('font-style:italic;');
		state.tag = state.tag || 'span';
		return state;
	},
	b(state: EntityItem): EntityItem {
		state.styles.push('font-weight: 600;');
		state.tag = state.tag || 'span';
		return state;
	},
	s(state: EntityItem): EntityItem {
		state.styles.push('text-decoration:line-through;');
		state.tag = state.tag || 'span';
		return state;
	},
	u(state: EntityItem): EntityItem {
		state.styles.push('border-bottom:0.05em solid;');
		state.tag = state.tag || 'span';
		return state;
	},
	a(item: EntityItem, href: string): EntityItem {
		return { ...item, tag: 'a', href };
	},
};

export type TextEntityPlugins = {
	[T in keyof typeof TextPlugins]: [T, ...ParametersExceptFirst<typeof TextPlugins[T]>];
}[keyof typeof TextPlugins];

export type TextEntity = [[number, number]] | [[number, number], TextEntityPlugins[]];

export const TextPluginsDecode: {
	[key in keyof typeof TextPlugins]: (htmlToken: EntityHTMLTokens) => TextEntityPlugins | undefined;
} = {
	i(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('font-style:italic')) return ['i'];
	},
	b(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('font-weight: 600')) return ['b'];
	},
	s(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('text-decoration:line-through')) return ['s'];
	},
	u(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('border-bottom:0.05em solid')) return ['u'];
	},
	a(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.href) return ['a', htmlToken.href];
	},
};
