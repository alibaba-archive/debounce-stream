'use strict';

const os = require('os');
const fs = require('fs');
const uuid = require('uuid');
const DebounceStream = require('..');
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');

const filePath = `${os.tmpdir()}/${uuid.v4()}`;
const fileStream = fs.createWriteStream(filePath);
const debounced = new DebounceStream();
debounced.pipe(fileStream);

const suite = new Benchmark.Suite();

suite
.add('write', () => {
  debounced.write('1111111111111111111111111111111111111111111111111111111111111111111111111111');
})

.on('cycle', event => {
  benchmarks.add(event.target);
})
.on('start', () => {
  console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
})
.on('complete', () => {
  benchmarks.log();
  setTimeout(() => process.exit(0), 5000);
})
.run({ async: false });

/*
➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-with-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:16:50 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 820,817 ops/sec ±11.26% (70 runs sampled)

➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-with-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:16:25 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 836,248 ops/sec ±12.03% (61 runs sampled)

➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-with-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:15:57 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 842,536 ops/sec ±9.93% (72 runs sampled)

*/
