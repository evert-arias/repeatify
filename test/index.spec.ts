import test from 'ava';
import {
	throttled,
	TaskContext,
	ThrottledResult,
	ThrottledStatus,
} from '../src/index.js';

function timeConsuming(_context: TaskContext) {
	return new Promise((resolve) => {
		// if (_context.currentCycle === 2) {
		// 	resolve({ abort: true });
		// }
		setTimeout(() => {
			resolve({ data: { datetime: Date.now() } });
		}, 365);
	});
}

test('basic test', async (t) => {
	await throttled(
		timeConsuming,
		{ intervalLimit: 1000, repeat: 3 },
		{
			update: (status: ThrottledStatus) => {
				t.log('Update:');
				t.log(status);
			},
			complete: (result: ThrottledResult) => {
				t.log('Result:');
				t.log(result);
			},
			error: (error) => {
				t.log(error);
			},
		}
	);
	t.pass();
});
