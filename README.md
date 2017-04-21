# debounce-stream

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/debounce-stream.svg?style=flat-square
[npm-url]: https://npmjs.org/package/debounce-stream
[travis-image]: https://img.shields.io/travis/node-modules/debounce-stream.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/debounce-stream
[codecov-image]: https://codecov.io/gh/node-modules/debounce-stream/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/debounce-stream
[david-image]: https://img.shields.io/david/node-modules/debounce-stream.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/debounce-stream
[snyk-image]: https://snyk.io/test/npm/debounce-stream/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/debounce-stream
[download-image]: https://img.shields.io/npm/dm/debounce-stream.svg?style=flat-square
[download-url]: https://npmjs.org/package/debounce-stream


A debounced stream repeatedly flush content for high performance.

Normally a writable stream flushes contents to consumer as quickly as it can.
With `debounce-stream` contents will be cached in memory first, and then flushed periodically. Thus better performance is achieved.

## Install

```bash
npm install debounce-stream --save
```

## Example

```js
const DebounceStream = require('debounce-stream');
const debounced = new DebounceStream();
```

Or if you want to control flush interval other than default 1 second:

```js
const debounced = new DebounceStream({ flushInterval: '2s' });
```

Work with fs

```js
debounced.pipe(fs.createWriteStream('path/to/file'));
debounced.write(1);
debounced.write(2);
debounced.write(3);
debounced.end();
```

This changes the frequency of writing file to every second instead of ASAP.

## Options

- {Number|String} [options.flushInterval = 1000] - the interval of flushing data, will be parsed by `humanize-ms`.

