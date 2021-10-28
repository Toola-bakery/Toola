import test from 'ava';
import unicornFun from './index.js';

test('main', t => {
	t.throws(() => {
		unicornFun(123);
	}, {
		instanceOf: TypeError,
		message: 'Expected a string, got number'
	});

	t.is(unicornFun('unicorns'), 'unicorns & rainbows');
});
