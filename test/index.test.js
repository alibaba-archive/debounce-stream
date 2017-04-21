'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const tmpdir = os.tmpdir();
const path = require('path');
const Flushable = require('..');
const pedding = require('pedding');

describe('test/index.test.js', () => {
  it('basic usage', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const writable = fs.createWriteStream(tmpFile);
    const flushable = new Flushable();
    flushable.pipe(writable);
    flushable.write('foo');
    flushable.write('bar');
    flushable.end();
    writable.once('finish', () => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === 'foobar');
      done();
    });
  });

  it('should write to file after flushInterval hit', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const flushable = new Flushable();
    const writable = fs.createWriteStream(tmpFile);
    flushable.pipe(writable);

    flushable.write('foo');
    flushable.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === '');
      done();
    }, 500);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === 'foobar');
      flushable.end(); // in case of fd leak
      done();
    }, 1100);
  });

  it('should write to file when stream.end() is called even if flushInterval has\'t been hit yet', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const flushable = new Flushable();
    const writable = fs.createWriteStream(tmpFile);
    flushable.pipe(writable);

    flushable.write('foo');
    flushable.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      assert(cnt === '');
      done();
      flushable.end('==');
      setTimeout(() => {
        const cnt = fs.readFileSync(tmpFile, 'utf8');
        assert(cnt === 'foobar==');
        done();
      }, 1);
    }, 200);
  });
});
