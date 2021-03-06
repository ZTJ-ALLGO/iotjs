'use strict';
var assert = require('assert');
var common = require('common.js');

// Testing api calls for arrays
var test_typedarray = require('./build/' + common.buildTypePath +
                              '/test_napi_typedarray.node');

var byteArray = new Uint8Array(3);
byteArray[0] = 0;
byteArray[1] = 1;
byteArray[2] = 2;
assert.strictEqual(byteArray.length, 3);

var doubleArray = new Float64Array(3);
doubleArray[0] = 0.0;
doubleArray[1] = 1.1;
doubleArray[2] = 2.2;
assert.strictEqual(doubleArray.length, 3);

var byteResult = test_typedarray.Multiply(byteArray, 3);
assert(byteResult instanceof Uint8Array);
assert.strictEqual(byteResult.length, 3);
assert.strictEqual(byteResult[0], 0);
assert.strictEqual(byteResult[1], 3);
assert.strictEqual(byteResult[2], 6);

var doubleResult = test_typedarray.Multiply(doubleArray, -3);
assert(doubleResult instanceof Float64Array);
assert.strictEqual(doubleResult.length, 3);
assert.strictEqual(doubleResult[0], -0);
assert.strictEqual(Math.round(10 * doubleResult[1]) / 10, -3.3);
assert.strictEqual(Math.round(10 * doubleResult[2]) / 10, -6.6);

var externalResult = test_typedarray.External();
assert(externalResult instanceof Int8Array);
assert.strictEqual(externalResult.length, 3);
assert.strictEqual(externalResult[0], 0);
assert.strictEqual(externalResult[1], 1);
assert.strictEqual(externalResult[2], 2);

// validate creation of all kinds of TypedArrays
var buffer = new ArrayBuffer(128);
var arrayTypes = [ Int8Array, Uint8Array, Uint8ClampedArray, Int16Array,
                     Uint16Array, Int32Array, Uint32Array, Float32Array,
                     Float64Array ];

arrayTypes.forEach(function(currentType) {
  var template = new currentType(buffer);
  var theArray = test_typedarray.CreateTypedArray(template, buffer);

  assert(theArray instanceof currentType,
            'Type of new array should match that of the template. ' +
            'Expected type: ' + currentType.name +
            'actual type: ' + template.constructor.name);
  assert.notStrictEqual(theArray, template);
  assert.strictEqual(theArray.buffer, buffer);
});

arrayTypes.forEach(function(currentType) {
  var template = new currentType(buffer);
  assert.throws(function() {
    test_typedarray.CreateTypedArray(template, buffer, 0, 136);
  }, RangeError);
});

var nonByteArrayTypes = [ Int16Array, Uint16Array, Int32Array, Uint32Array,
                            Float32Array, Float64Array ];
nonByteArrayTypes.forEach(function(currentType) {
  var template = new currentType(buffer);
  assert.throws(function() {
    test_typedarray.CreateTypedArray(template, buffer,
                                     currentType.BYTES_PER_ELEMENT + 1, 1);
    console.log('start of offset ' + currentType);
  }, RangeError);
});
