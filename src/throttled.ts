import EventEmitter from 'events';

import {
	ThrottledCallbacks,
	TaskContext,
	ThrottledOptions,
	TaskResult,
	ExitMode,
	ThrottledRunnerOptions,
	ThrottledResult,
} from './model.js';

async function runner(
	runnerOptions: ThrottledRunnerOptions
): Promise<ThrottledResult> {
	return new Promise((resolve, reject) => {
		runnerOptions.index++;
		// Start measuring task execution time
		const start = Date.now();

		runnerOptions
			.task({
				currentIteration: runnerOptions.index,
				options: runnerOptions.options,
			})
			.then(
				(taskResult: TaskResult) => {
					// Task duration
					const taskDuration = Date.now() - start;

					if (taskResult.abort) {
						// Abort: terminate as per requested by user
						runnerOptions.emitter.emit('complete', {
							exitMode: ExitMode.ABORT,
							totalElapsedTime: 0,
							options: runnerOptions.options,
						});
						resolve({
							exitMode: ExitMode.ABORT,
							totalElapsedTime: 0,
							options: runnerOptions.options,
						});
						return;
					}

					// If task execution exceded interval limit, do not apply throttle
					if (taskDuration >= runnerOptions.options.intervalLimit) {
						const totalElapsedTime = Date.now() - runnerOptions.startTime;
						runnerOptions.emitter.emit('update', {
							currentIteration: runnerOptions.index,
							elapsedTime: taskDuration,
							finalElapsedTime: taskDuration,
							throttledApplied: 0,
							taskResult,
						});
						// If last cycle, terminate at this point
						if (runnerOptions.index === runnerOptions.options.repeat) {
							runnerOptions.emitter.emit('complete', {
								exitMode: ExitMode.NORMAL,
								totalElapsedTime,
								options: runnerOptions.options,
							});
							resolve({
								exitMode: ExitMode.NORMAL,
								totalElapsedTime,
								options: runnerOptions.options,
							});
							return;
						}

						resolve(runner(runnerOptions));
						return;
					}

					// Apply throttle
					setTimeout(() => {
						const totalElapsedTime = Date.now() - runnerOptions.startTime;
						runnerOptions.emitter.emit('update', {
							currentCyle: runnerOptions.index,
							elapsedTime: taskDuration,
							finalElapsedTime: runnerOptions.options.intervalLimit,
							throttleApplied:
								runnerOptions.options.intervalLimit - taskDuration,
							taskResult,
						});
						// If last cycle, terminate at this point
						if (runnerOptions.index === runnerOptions.options.repeat) {
							runnerOptions.emitter.emit('complete', {
								exitMode: ExitMode.NORMAL,
								totalElapsedTime,
								options: runnerOptions.options,
							});
							resolve({
								exitMode: ExitMode.NORMAL,
								totalElapsedTime,
								options: runnerOptions.options,
							});
							return;
						}

						resolve(runner(runnerOptions));
					}, runnerOptions.options.intervalLimit - taskDuration);
				},
				(error) => {
					runnerOptions.emitter.emit('error', error);
					reject(error);
				}
			);
	});
}

export async function throttled(
	task: (context: TaskContext) => Promise<any>,
	options: ThrottledOptions,
	cb?: ThrottledCallbacks
): Promise<ThrottledResult> {
	const startingIndex = 0;

	const emitter = new EventEmitter();

	if (cb) {
		if (cb.update) {
			emitter.on('update', cb.update);
		}

		if (cb.complete) {
			emitter.on('complete', cb.complete);
			emitter.on('complete', () => {
				emitter.removeAllListeners();
			});
		}

		if (cb.error) {
			emitter.on('error', cb.error);
		}
	}

	// Measure starting time
	const startTime = Date.now();

	return runner({ task, options, emitter, startTime, index: startingIndex });
}
