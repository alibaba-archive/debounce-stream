'use strict';

const fs = require('fs');
const os = require('os');
const tmpdir = os.tmpdir();
const path = require('path');
const Flushable = require('..');
const should = require('should');
const pedding = require('pedding');

describe('test/index.test.js', () => {
  it('basic usage', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.write('foo');
    stream.write('bar');
    stream.end();
    stream.once('finish', () => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      cnt.should.equal('foobar');
      done();
    });
  });

  it('should autoClose:true by default', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.write('foo');
    stream.write('bar');
    stream.end();
    let closed = false;
    stream.on('close', () => {
      closed = true;
    });
    stream.on('finish', () => {
      setTimeout(() => {
        closed.should.equal(true);
        done();
      }, 100);
    });
  });

  it('should autoClose:false work', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a', autoClose: false });
    stream.write('foo');
    stream.write('bar');
    stream.end();
    let closed = false;
    stream.on('close', () => {
      closed = true;
    });
    stream.on('finish', () => {
      setTimeout(() => {
        closed.should.equal(false);
        done();
      }, 100);
    });
  });

  it('should write to file after flushInterval hit', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.write('foo');
    stream.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      cnt.should.equal('');
      done();
    }, 500);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      cnt.should.equal('foobar');
      stream.end(); // in case of fd leak
      done();
    }, 1100);
  });

  it('should write to file when stream.end() is called even if flushInterval has\'t been hit yet', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.write('foo');
    stream.write('bar');
    done = pedding(2, done);
    setTimeout(() => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      cnt.should.equal('');
      done();
      stream.end('==');
      setTimeout(() => {
        const cnt = fs.readFileSync(tmpFile, 'utf8');
        cnt.should.equal('foobar==');
        done();
      }, 500);
    }, 200);
  });

  it('should stream.bytesWritten correct', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.write('foo');
    stream.write('bar');
    stream.bytesWritten.should.equal(0);
    stream.end();
    stream.on('finish', () => {
      stream.bytesWritten.should.equal(6);
      done();
    });
  });

  it('should stream.path correct', () => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.path.should.equal(tmpFile);
    stream.end();
  });

  it('should stream.setDefaultEncoding() work', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    stream.setDefaultEncoding('ucs2');
    stream.write('我爱你');
    stream.write('我也是');
    stream.end();
    stream.on('finish', () => {
      const cnt = fs.readFileSync(tmpFile, 'utf8');
      cnt.should.not.equal('我爱你我也是');
      const cnt2 = fs.readFileSync(tmpFile, 'ucs2');
      cnt2.should.equal('我爱你我也是');
      done();
    });
  });

  it('should emit open and close event if underlying fs.WriteStream emits them', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    done = pedding(2, done);
    stream.on('open', done);
    stream.on('close', done);
    stream.end();
  });

  it('should emit error if underlying fs.WriteStream emit error', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'r' });
    stream.on('error', err => {
      should.exist(err);
      done();
    });
  });

  it('should pipe work', done => {
    const tmpFile = path.join(tmpdir, 'flushable-test-' + Date.now());
    const stream = new Flushable(tmpFile, { flags: 'a' });
    const sampleFile = __dirname + '/fixtures/sample.txt';
    const file = fs.createReadStream(sampleFile);

    done = pedding(2, done);
    stream.on('pipe', src => {
      src.should.equal(file);
      done();
    });

    file.pipe(stream);
    stream.on('finish', () => {
      const cnt1 = fs.readFileSync(tmpFile);
      const cnt2 = fs.readFileSync(sampleFile);
      cnt1.should.eql(cnt2);
      done();
    });
  });
});
