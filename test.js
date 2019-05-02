import test from 'ava';
import execa from 'execa';

test('cli loads properly', async t => {
	await t.notThrows(() => {
		execa('./cli.js');
	});
});
