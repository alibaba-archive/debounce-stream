'use strict';

const ms = require('humanize-ms');
const PassThrough = require('stream').PassThrough;

const TIMER = Symbol('DebounceStream#timer');
const OPTIONS = Symbol('DebounceStream#options');
const START_TIMER = Symbol('DebounceStream#startTimer');

const DEFAULT = {
  flushInterval: ms('1s'),
};

class DebounceStream extends PassThrough {
  constructor(options) {
    super(options);
    this[OPTIONS] = Object.assign({}, DEFAULT, options);
    this[OPTIONS].flushInterval = ms(this[OPTIONS].flushInterval);

    this[START_TIMER]();
  }

  // There's no need to call uncork manually in _flush, node itself has already token care of it.
  // https://github.com/nodejs/node/blob/master/lib/_stream_writable.js#L500

  [START_TIMER]() {
    this.cork();
    this[TIMER] = setInterval(() => {
      this.uncork();
      this.cork();
    }, this[OPTIONS].flushInterval);

    this.on('end', () => clearInterval(this[TIMER]));
  }
}

module.exports = DebounceStream;
