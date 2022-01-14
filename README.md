# Repeatify

JavaScript/TypeScript library to run repetitive tasks with throttle control and other cool features

![image](image.png)

## Install

```bash
npm install repeatify
```

## Usage

```javascript
import { throttled } from 'repeatify';

function timeConsuming() {
 return new Promise((resolve) => {
  setTimeout(() => {
   resolve({ data: { datetime: Date.now() } });
  }, 200);
 });
}

const options = { intervalLimit: 1000, repeat: 10 };

await throttled(timeConsuming, options, {
 update: (status) => {},
 complete: (result) => {},
 error: (error) => {},
});
```

## API

### throttled(task, options, callbacks?)

Execute a promise a certain number of times guaranteeing that the execution interval is not less than the designated.

#### task

Type: `promise`

Promise that will be executed

```javascript
function timeConsuming(context) {
 return new Promise((resolve) => {
  setTimeout(() => {
   resolve({ data: { datetime: Date.now() } });
  }, 200);
 });
}
```

The context argument provides contextual information about the running task.

`currentCycle`

> current cycle index

`options`

> a copy of the original options object

`returning object`

The `data` object in the returning object may contain any information to be received in the update event callback.
Example:

```javascript
{ data: { datetime: Date.now() }
```

Add `abort` in the returning object to exit the process at the current cycle.
Example:

```javascript
{ abort: true, data: { datetime: Date.now() }
```

#### options

Type: `object`

Options object to set execution parameters

```javascript
{  repeat: 10, intervalLimit: 1000}
```

`repeat`

> The number of times to execute the given promise

`intervalLimit`

> Sets the minimum interval for the execution

#### callbacks

Type: `object`

> Callbacks to handle events

```javascript
{
 update: (status) => {},
 complete: (result) => {},
 error: (error) => {},
}
```

`update` (callback)

> Triggered at the end of every cycle. Provides an object with data related to the running task.

`status` object

```javascript
{
  currentCyle: 1,
  elapsedTime: 203,
  finalElapsedTime: 1000,
  throttledApplied: 797,
  taskResult: { data: { datetime: 1642197014924 } }
}
```

`complete` (callback)

> Triggered when execution has finished. It provides an object with result data.

`result` object

```javascript
{
  exitMode: 0,
  totalElapsedTime: 10171,
  options: { intervalLimit: 1000, repeat: 10 }
}
```

`exitMode`: Indicates how the execution ended; 0 = Normal (at last cycle), 1 = Abort (as per request).

`totalElapsedTime`: The final duration time of the execution.

`options`: This object is a copy of the original options object passed as argument.

`error` (callback)

> This callback method gets triggered if there is an error on the task execution.
