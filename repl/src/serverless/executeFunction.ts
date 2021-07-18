import { spawn } from 'child_process';

type ExecuteFunctionOptions = {
	code: string;
	output: (chunk: Buffer) => void;
	callArgs?: any[];
	mainFunctionName?: string;
};

export function executeFunction({
	code,
	output,
	callArgs,
	mainFunctionName = 'main',
}: ExecuteFunctionOptions): Promise<number | string | void> {
	return new Promise((resolve, reject) => {
		const id = Math.random();
		const callFunctionWithArgs = callArgs
			? `(async ()=>${mainFunctionName}(${callArgs.map(v => JSON.stringify(v)).join(', ')}))()
			.then(result=>process.stdout.write(JSON.stringify({result, id:'${id}'})))`
			: '';

		const source = `"${code.replace(/(["$`])/g, '\\$1')}; ${callFunctionWithArgs}"`;
		const node = spawn('node', ['-e', source], {
			shell: true,
		});

		function catchData(data: Buffer) {
			const stringData = data.toString('utf-8');
			if (stringData.includes(id.toString())) {
				console.log({ stringData });
				resolve(JSON.parse(stringData).result);
				// node.kill('SIGINT');
			} else output(data);
		}

		node.stdout.on('data', catchData);
		node.stderr.on('data', output);

		node.on('close', exitCode => {
			if (!exitCode) resolve();
			reject(new Error(`exit code ${exitCode}`));
			console.log(`child process exited with code ${exitCode}`);
		});
	});
}
