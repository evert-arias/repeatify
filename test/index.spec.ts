import test from 'ava';
import {
	throttle,
	TaskContext,
	ThrottleResult,
	ThrottleStatus,
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
	await throttle(
		timeConsuming,
		{ intervalLimit: 1000, repeat: 3 },
		{
			update: (status: ThrottleStatus) => {
				t.log('Update:');
				t.log(status);
			},
			complete: (result: ThrottleResult) => {
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
