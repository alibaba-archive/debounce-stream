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


A transform stream repeatedly flush content for high performance.

Normally a writable stream flushes contents to consumer as quickly as it can.
With `flushable` contents will be cached in memory first, and then flushed periodically. Thus better performance is achieved.

## Install

```bash
npm install flushable --save
```

## Example

```js
const Flushable = require('flushable');
const flushable = new Flushable();
```

Or if you want to control flush interval other than default 1 second:

```js
const flushable = new Flushable({ flushInterval: '2s' });
```

Work with fs

```js
flushable.pipe(fs.createWriteStream('path/to/file'));
flushable.write(1);
flushable.write(2);
flushable.write(3);
flushable.end();
```

This changes the frequency of writing file to every second instead of ASAP.

## Options

- {Number|String} [options.flushInterval = 1000] - the interval of flushing data, will be parsed by `humanize-ms`.

