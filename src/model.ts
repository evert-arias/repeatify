import EventEmitter from 'events';

export interface ThrottledStatus {
	currentCyle: number;
	elapsedTime: number;
	finalElapsedTime: number;
	throttledApplied: number;
	taskResult: TaskResult;
}

export interface ThrottledCallbacks {
	update?: (status: ThrottledStatus) => void;
	complete?: (result: ThrottledResult) => void;
	error?: (error: any) => void;
}

export interface ThrottledOptions {
	repeat: number;
	intervalLimit: number;
}

export interface ThrottledResult {
	exitMode: ExitMode;
	totalElapsedTime: number;
	options: ThrottledOptions;
}

export interface ThrottledRunnerOptions {
	task: (context: TaskContext) => Promise<any>;
	options: ThrottledOptions;
	emitter: EventEmitter;
	startTime: number;
	index: number;
}

export interface TaskContext {
	currentCycle: number;
	options: ThrottledOptions;
}

export interface TaskResult {
	abort?: boolean;
	data?: any;
}

export enum ExitMode {
	NORMAL,
	ABORT,
}
