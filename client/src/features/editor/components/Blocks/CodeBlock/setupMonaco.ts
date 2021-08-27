import { Monaco } from '@monaco-editor/react';
import ky from 'ky';

export interface UnpkgFile {
	path: string;
	type: 'directory' | 'file';
	contentType?: 'application/json' | 'text/markdown' | 'text/plain';
	integrity?: string;
	lastModified?: string;
	size?: number;
	files?: UnpkgFile[];
}

function parseFileArray(fileArray: UnpkgFile[]) {
	const arr: string[] = [];

	fileArray.forEach((file) => {
		if (file.path.includes('.d.ts')) arr.push(file.path);
		if (file.type === 'directory' && file.files) arr.push(...parseFileArray(file.files));
	});

	return arr;
}

async function getTypeDefinitionFiles(packageNameWithVersion: string) {
	const resp = await ky.get(`https://unpkg.com/${packageNameWithVersion}/?meta`).json<UnpkgFile>();
	return parseFileArray(resp?.files || []);
}

async function downloadAllFiles(packageNameWithVersion: string, filePathArray: string[]) {
	const resp = filePathArray.map((file) =>
		ky
			.get(`https://unpkg.com/${packageNameWithVersion}/${file}`)
			.text()
			.then((a) => [file, a]),
	);
	return Promise.all(resp);
}

async function getPackage(packageNameWithVersion: string) {
	return downloadAllFiles(packageNameWithVersion, await getTypeDefinitionFiles(packageNameWithVersion));
}

async function getAndLoadPackage(monaco: Monaco, packageNameWithVersion: string) {
	const response = await getPackage(packageNameWithVersion);

	response.forEach(([path, file]) => {
		const fileWithModule = file.includes('declare module')
			? file
			: `declare module "${packageNameWithVersion.replace('@types/', '').replace('.d.ts', '')}" { ${file} }`;
		monaco.languages.typescript.javascriptDefaults.addExtraLib(fileWithModule, `${packageNameWithVersion}${path}`);
	});
}

export function setupMonaco(monaco: Monaco) {
	monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
		...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
		allowSyntheticDefaultImports: false,
		target: monaco.languages.typescript.ScriptTarget.ES5,
		module: monaco.languages.typescript.ModuleKind.CommonJS,
		moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
		skipDefaultLibCheck: true,
		allowJs: true,
		typeRoots: ['./types'],
		allowNonTsExtensions: true,
	});

	monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSuggestionDiagnostics: true });

	getAndLoadPackage(monaco, '@types/node');
	getAndLoadPackage(monaco, 'axios');
	getAndLoadPackage(monaco, 'bson');
	getAndLoadPackage(monaco, '@types/uuid');
	getAndLoadPackage(monaco, 'mongodb');

	monaco.languages.typescript.javascriptDefaults.addExtraLib(
		[
			'declare var require: {',
			'toUrl(path: string): string;',
			'(moduleName: string): any;',
			'(dependencies: string[], callback: (...args: any[]) => any, errorback?: (err: any) => void): any;',
			'config(data: any): any;',
			'onError: Function;',
			'};',
		].join('\n'),
		'ts:require.d.ts',
	);
}
