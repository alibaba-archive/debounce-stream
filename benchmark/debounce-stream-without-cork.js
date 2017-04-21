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
➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-without-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:16:37 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 809,954 ops/sec ±14.18% (70 runs sampled)

➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-without-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:16:12 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 827,227 ops/sec ±10.91% (68 runs sampled)

➜  debounce-stream git:(debounce-stream) ✗ node benchmark/debounce-stream-without-cork.js


  node version: v6.5.0, date: Fri Apr 21 2017 17:15:45 GMT+0800 (CST)
  Starting...
  1 test completed.

  write x 827,970 ops/sec ±11.63% (70 runs sampled)

*/
