'use strict';

const ms = require('humanize-ms');
const Transform = require('stream').Transform;

const CACHE = Symbol('DebounceStream#cache');
const TIMER = Symbol('DebounceStream#timer');
const OPTIONS = Symbol('DebounceStream#options');
const START_TIMER = Symbol('DebounceStream#startTimer');

const DEFAULT = {
  flushInterval: ms('1s'),
};

class DebounceStream extends Transform {
  constructor(options) {
    super(options);
    this[OPTIONS] = Object.assign({}, DEFAULT, options);
    this[OPTIONS].flushInterval = ms(this[OPTIONS].flushInterval);

    this[CACHE] = [];
    this[START_TIMER]();

  }

  _transform(chunk, encoding, callback) {
    this[CACHE].push([ chunk, encoding ]);
    callback();
  }

  _flush(callback) {
    for (const [ chunk, encoding ] of this[CACHE]) {
      this.push(chunk, encoding);
    }

    callback && callback();
  }

  // There's no need to call uncork manually in _flush, node itself has already token care of it.
  // https://github.com/nodejs/node/blob/master/lib/_stream_writable.js#L500

  [START_TIMER]() {
    this[TIMER] = setInterval(() => {
      this._flush();
    }, this[OPTIONS].flushInterval);

    this.on('end', () => clearInterval(this[TIMER]));
  }
}

module.exports = DebounceStream;
