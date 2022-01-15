import EventEmitter from 'events';

export interface ThrottleStatus {
	currentIteration: number;
	elapsedTime: number;
	finalElapsedTime: number;
	throttleApplied: number;
	taskResult: TaskResult;
}

export interface ThrottleCallbacks {
	update?: (status: ThrottleStatus) => void;
	complete?: (result: ThrottleResult) => void;
	error?: (error: any) => void;
}

export interface ThrottleOptions {
	repeat: number;
	intervalLimit: number;
}

export interface ThrottleResult {
	exitMode: ExitMode;
	totalElapsedTime: number;
	options: ThrottleOptions;
}

export interface ThrottleRunnerOptions {
	task: (context: TaskContext) => Promise<any>;
	options: ThrottleOptions;
	emitter: EventEmitter;
	startTime: number;
	index: number;
}

export interface TaskContext {
	currentIteration: number;
	options: ThrottleOptions;
}

export interface TaskResult {
	abort?: boolean;
	data?: any;
}

export enum ExitMode {
	NORMAL,
	ABORT,
}
