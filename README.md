# flushable

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/flushable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/flushable
[travis-image]: https://img.shields.io/travis/node-modules/flushable.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/flushable
[codecov-image]: https://codecov.io/gh/node-modules/flushable/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/flushable
[david-image]: https://img.shields.io/david/node-modules/flushable.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/flushable
[snyk-image]: https://snyk.io/test/npm/flushable/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/flushable
[download-image]: https://img.shields.io/npm/dm/flushable.svg?style=flat-square
[download-url]: https://npmjs.org/package/flushable


A writable file stream periodically flush contents to disk for high performance.

Normally fs.WriteStream created by `fs.createWriteStream()` write contents to file as quikly as it can.
With `flushable` contents will be cached in memory, and flush to file periodically. Thus better performance is achieved.

Use `new Flushable` the way same as fs.createWriteStream().

## Install

```bash
npm install flushable --save
```

## Example

```js
const Flushable = require('flushable');
const stream = new Flushable('path/to/file');
```

Or if you want to pending to file, add flags `a`, just like fs.createWriteStream do

```js
const stream = new Flushable('path/to/file', { flags: 'a' });
```

## API

### constructor

`new Flushable(path[, options])`

path and options are same as the buildin `fs.createWriteStream()` API with one additional option:

- {Number} [flushInterval = 1000] - the interval of flushing content to file.(in ms)

### methods

All methods of `fs.WriteStream` created by `fs.createWriteStream()` and `stream.WriteStream` are supported, for example:

- `.end()`
- `.write()`
- `.pipe()`
- `.unpipe()`
- `.setDefaultEncoding()`
- ..

### events

All events of `fs.WriteStream` created by `fs.createWriteStream()` and `stream.WriteStream` are supported, for example:

- `error`
- `pipe`
- `unpipe`
- `open`
- `close`
- `finish`

### properties

All events of `fs.WriteStream` created by `fs.createWriteStream()` and `stream.WriteStream` are supported, for example:

- path
- bytesWritten


