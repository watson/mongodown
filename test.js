'use strict';

var cuid = require('cuid')
var levelup = require('levelup')
var mongojs = require('mongojs')
var test = require('tap').test;
var testCommon = require('./testCommon');
var MongoDOWN = require('./');

function factory (location) {
  return new MongoDOWN(location);
}

/*** compatibility with basic LevelDOWN API ***/

require('abstract-leveldown/abstract/leveldown-test').args(factory, test, testCommon)

require('abstract-leveldown/abstract/open-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/open-test').args(factory, test, testCommon)
require('abstract-leveldown/abstract/open-test').open(factory, test, testCommon)
// Test will not run because the database isn't actually created upon touch,
// but rather when the first document is added
// require('abstract-leveldown/abstract/open-test').openAdvanced(factory, test, testCommon)
require('abstract-leveldown/abstract/open-test').tearDown(factory, test, testCommon)

require('abstract-leveldown/abstract/del-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/get-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/put-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/put-get-del-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').errorKeys(test)
//require('abstract-leveldown/abstract/put-get-del-test').nonErrorKeys(test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').errorValues(test)
//require('abstract-leveldown/abstract/test/put-get-del-test').nonErrorKeys(test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').tearDown(test, testCommon)

require('abstract-leveldown/abstract/approximate-size-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/approximate-size-test').args(test)

require('abstract-leveldown/abstract/batch-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/batch-test').args(test)

require('abstract-leveldown/abstract/chained-batch-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').args(test)

require('abstract-leveldown/abstract/close-test').close(factory, test, testCommon)

require('abstract-leveldown/abstract/iterator-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/iterator-test').args(test)
require('abstract-leveldown/abstract/iterator-test').sequence(test)
require('abstract-leveldown/abstract/iterator-test').iterator(factory, test, testCommon, testCommon.collectEntries)
require('abstract-leveldown/abstract/iterator-test').tearDown(test, testCommon)

 test('test "extraFields" put', function (t) {
   var location = cuid()
   var now = Date.now()
   var mongoClient = mongojs(location, ['mongodown'])
   var db = levelup(location, {
     db: MongoDOWN,
     extraFields: {
       timestamp: function (k, v) {
         return now
       }
     }
   })
   db.put('foo', JSON.stringify({ v: 'bar' }), function (err) {
     t.error(err)
     mongoClient.mongodown.find(function (err, documents) {
       t.error(err)
       t.deepEqual(
         documents,
         [{
           _id: 'foo',
           value: '{"v":"bar"}',
           timestamp: now
         }]
       )
       db.get('foo', function (err, record) {
         t.error(err)
         t.equal(record, '{"v":"bar"}')
         mongoClient.dropDatabase(function (err) {
           mongoClient.close()
           t.end(err)
         })
       })
     })
   })
 })

test('test "extraFields" batch', function (t) {
  var location = cuid()
  var now = Date.now()
  var mongoClient = mongojs(location, ['mongodown'])
  var db = levelup(location, {
    db: MongoDOWN,
    extraFields: {
      timestamp: function (k, v) {
        return now
      }
    }
  })
  db.batch([
    {type: 'put', key: 'foo', value: 'bar'},
  ],
  function (err) {
    t.error(err)
    mongoClient.mongodown.find(function (err, documents) {
      t.error(err)
      t.deepEqual(
        documents,
        [{
          _id: 'foo',
          value: 'bar',
          timestamp: now
        }]
      )
      db.get('foo', function (err, record) {
        t.error(err)
        t.equal(record, 'bar')
        mongoClient.dropDatabase(function (err) {
          mongoClient.close()
          t.end(err)
        })
      })
    })
  })
})


test('end', function (t) {
  t.end();
  process.nextTick(process.exit);
})
