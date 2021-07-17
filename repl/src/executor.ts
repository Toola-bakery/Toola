import vm from 'vm';

function wrapCode(code) {
	return `(async function(exports, require) {
  ${code}
})()`;
}

export async function execute(code) {
	const wrappedCode = code;
	try {
		const resp = vm.runInThisContext(wrappedCode, {});
		return resp;
	} catch (e) {
		console.log(e);
		throw e;
	}
}
