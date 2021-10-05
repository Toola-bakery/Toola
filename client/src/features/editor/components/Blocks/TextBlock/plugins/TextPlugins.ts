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
	a(item: EntityItem, href: string): EntityItem {
		return { ...item, tag: 'a', href };
	},
};

export type TextEntityPlugins = {
	[T in keyof typeof TextPlugins]: [T, ...ParametersExceptFirst<typeof TextPlugins[T]>];
}[keyof typeof TextPlugins];

export type TextEntity = [[number, number]] | [[number, number], TextEntityPlugins[]];

export const TextPluginsDecode = {
	i(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('font-style:italic')) return ['i'];
	},
	b(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.style?.includes('font-weight: 600')) return ['b'];
	},
	a(htmlToken: EntityHTMLTokens): TextEntityPlugins | undefined {
		if (htmlToken.href) return ['a', htmlToken.href];
	},
};
