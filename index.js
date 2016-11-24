'use strict';

const fs = require('fs');
const delegates = require('delegates');
const FlushWritable = require('flushwritable');

const DEFAULTS = {
  flushInterval: 1000,
};

// https://github.com/nodejs/readable-stream/issues/112
// https://github.com/nodejs/node/pull/2314#issuecomment-247768623
class Flushable extends FlushWritable {
  constructor(path, options) {
    super(options);
    options = this.options = Object.assign({}, DEFAULTS, options);

    this._stream = fs.createWriteStream(path, options)
                  .on('open', () => this.emit('open'))
                  .on('close', () => this.emit('close'))
                  .on('drain', () => this.emit('drain'))
                  .on('error', err => this.emit('error', err));

    // forces all written data to be buffered in memory
    this._stream.cork();

    this._timer = this._createInterval();
  }

  _write(chunk, encoding, callback) {
    this._stream.write(chunk, encoding);
    callback();
  }

  // Caution: _flush is not a method of a TransformStream here, it's a required method of FlushWritable
  // And this feature will land in Node.js v8 as a method of _end below.
  // If callback is specified, it's the last time of calling _flush, triggered by stream.end()
  _flush(callback) {
    this._stream.uncork();

    if (callback) {
      this._closeInterval();
      this._stream.once('finish', callback);
      this._stream.end();
    } else {
      this._stream.cork();
    }
  }

  // https://github.com/nodejs/node/pull/2314#issuecomment-247768623
  // This feature will land in Node.js v8
  _end(callback) {
    this._flush(callback);
  }

  _createInterval() {
    return setInterval(() => this._flush(), this.options.flushInterval);
  }

  _closeInterval() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}

delegates(Flushable.prototype, '_stream')
  .getter('bytesWritten')
  .getter('path');
  // should not delegate setDefaultEncoding method, encoding is passed to _stream in _write(chunk, encoding)

module.exports = Flushable;
