# Repeatify

JavaScript/Typescript library to run repetitive tasks with throttle control and other cool features

![image](image.png)

## Install

```bash
npm install repeatify
```

## Usage

```javascript
import { throttled } from 'repeatify';

function timeConsuming(_context) {
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

### throttled(task, options?, callbacks?)

Accepts a promise that will be executed as many time as specified with a limit interval. Returns a promise.

#### options

Type: `object`

Options object to configure the task execution

#### callbacks

Type: `object`

Callbacks object to receive events
