import { EntityItem, TextEntity, TextEntityPlugins, TextPlugins, TextPluginsDecode } from './TextPlugins';

export function splitByEntities(text: string, _entities: TextEntity[]) {
	const entities = [..._entities]; // TODO i did it to fix a bug, idk
	const sortedEntities = entities.sort((e1, e2) => e1[0][0] - e2[0][0]);
	const fullEntities: TextEntity[] = [];

	// if no entities return one
	if (!entities[0]) {
		fullEntities.push([[0, text.length - 1]]);
		return fullEntities;
	}

	if (entities[0][0][0] > 0) {
		fullEntities.push([[0, entities[0][0][0] - 1]]);
	}

	sortedEntities.forEach((item, index) => {
		if (index > 0) {
			const diffFromPrevious = item[0][0] - entities[index - 1][0][1];

			if (diffFromPrevious > 1) {
				fullEntities.push([[entities[index - 1][0][1] + 1, item[0][0] - 1]]);
			}

			if (diffFromPrevious < 1) {
				throw new Error('Bad entities');
			}
		}
		fullEntities.push(item);
	});

	if (entities[entities.length - 1][0][1] < text.length - 1) {
		fullEntities.push([[entities[entities.length - 1][0][1] + 1, text.length - 1]]);
	}
	return fullEntities;
}

export function entitiesToHTML(text: string, entities: TextEntity[]) {
	const fullEntities = splitByEntities(text, entities);
	const elements = fullEntities.map((entity) => {
		const [position, plugins] = entity;
		const textSlice = text.slice(position[0], position[1] + 1);
		if (!plugins) return textSlice;
		const { tag, styles, ...props } = plugins.reduce<EntityItem>(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			(acc, [pluginName, ...pluginProps]) => TextPlugins[pluginName](acc, ...pluginProps),
			{ tag: undefined, styles: [] },
		);
		if (!tag) return textSlice;
		const newProps = { ...props, style: styles.join('') };
		const stringProps = Object.entries(newProps)
			.map(([prop, value]) => `${prop}="${value}"`)
			.join(' ');
		return `<${tag} ${stringProps}>${textSlice}</${tag}>`;
	});
	return elements.join('');
}

const ATTR_REGEXP = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/;
const TAG_REGEXP = /<\s*(span|a)[^>]*>(.*?)<\s*\/\s*(span|a)>/;

function matchAll(pattern: string | RegExp, haystack: string) {
	const regex = new RegExp(pattern, 'g');
	const matchResult = haystack.match(regex) || [];
	const entries = matchResult
		.map((item) => item.match(new RegExp(pattern)) as RegExpMatchArray)
		.map((item) => [item[1], item[2]]);

	return Object.fromEntries(entries);
}

export type EntityHTMLTokens = {
	tag?: string;
	text: string;
	style?: string;
	href?: string;
};

export function htmlToTokens(htmlString: string): EntityHTMLTokens[] {
	let string = htmlString;
	const tokens = [];

	let token = string.match(TAG_REGEXP);

	while (token) {
		if (token.index) tokens.push({ text: string.slice(0, token.index) });
		tokens.push({ tag: token[1], text: token[2], ...matchAll(ATTR_REGEXP, token[0]) });
		string = string.slice((token.index || 0) + token[0].length);
		token = string.match(TAG_REGEXP);
	}

	if (string) tokens.push({ text: string });

	return tokens;
}

export function tokensToEntities(tokens: EntityHTMLTokens[]): [string, TextEntity[]] {
	const pluginList = Object.keys(TextPluginsDecode) as (keyof typeof TextPluginsDecode)[];
	let fullText = '';
	const entities = tokens
		.map<TextEntity | undefined>((token) => {
			fullText += token.text;
			if (!token.tag) return;
			const plugins = pluginList
				.map((plugin) => TextPluginsDecode[plugin](token))
				.filter((plugin): plugin is TextEntityPlugins => !!plugin);
			const entity: TextEntity = plugins.length
				? [[fullText.length - token.text.length, fullText.length - 1], plugins]
				: [[fullText.length - token.text.length, fullText.length - 1]];
			return entity;
		})
		.filter((entity): entity is TextEntity => !!entity);
	return [fullText, entities];
}

export function htmlToEntities(htmlString: string) {
	const tokens = htmlToTokens(htmlString);
	return tokensToEntities(tokens);
}
