'use strict';

const fs = require('fs');
const os = require('os');
const tmpdir = os.tmpdir();
const path = require('path');
const assert = require('assert');
const pedding = require('pedding');
const DebounceStream = require('..');
// const DebounceStream = require('../benchmark/lib/transform');

describe('test/index.test.js', () => {
  it('basic usage', done => {
    const tmpFile = path.join(tmpdir, 'debouncee-test-' + Date.now());
    const writable = fs.createWriteStream(tmpFile);
    const debounced = new DebounceStream();
    debounced.pipe(writable);
    debounced.write('foo');
    debounced.write('bar');
    debounced.end();
    writable.once('finish', () => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === 'foobar');
      done();
    });
  });

  it('should write to file after flushInterval hit', done => {
    const tmpFile = path.join(tmpdir, 'debounce-test-' + Date.now());
    const debounced = new DebounceStream();
    const writable = fs.createWriteStream(tmpFile);
    debounced.pipe(writable);

    debounced.write('foo');
    debounced.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === '');
      done();
    }, 500);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === 'foobar');
      debounced.end(); // in case of fd leak
      done();
    }, 1100);
  });

  it('should write to file when stream.end() is called even if flushInterval has\'t been hit yet', done => {
    const tmpFile = path.join(tmpdir, 'debounce-test-' + Date.now());
    const debounced = new DebounceStream();
    const writable = fs.createWriteStream(tmpFile);
    debounced.pipe(writable);

    debounced.write('foo');
    debounced.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === '');
      done();
      debounced.end('==');
      setTimeout(() => {
        const cnt = fs.readFileSync(tmpFile, 'utf8');
        assert(cnt === 'foobar==');
        done();
      }, 100);
    }, 200);
  });
});
