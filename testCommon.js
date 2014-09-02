'use strict';

var mongojs = require('mongojs');
var afterAll = require('after-all');

var dbidx = 0

  , location = function () {
      return 'mongodown_test_' + dbidx++
    }

  , lastLocation = function () {
      return 'mongodown_test_' + dbidx
    }

  , cleanup = function (callback) {
      var finished = function (err) {
        admin.close()
        callback(err)
      }
      var admin = mongojs('admin')
      admin.runCommand('listDatabases', function (err, result) {
        if (err) return finished(err)
        var next = afterAll(finished)
        result.databases
          .filter(function (database) {
            return /^mongodown_test_\d+$/.test(database.name)
          })
          .forEach(function (database) {
            var db = mongojs(database.name)
            var done = next()
            db.dropDatabase(function (err) {
              db.close()
              done(err)
            })
          })
      });
    }

  , setUp = function (t) {
      cleanup(function (err) {
        t.notOk(err, 'cleanup returned an error')
        t.end()
      })
    }

  , tearDown = function (t) {
      setUp(t) // same cleanup!
    }

  , collectEntries = function (iterator, callback) {
      var data = []
        , next = function () {
            iterator.next(function (err, key, value) {
              if (err) return callback(err)
              if (!arguments.length) {
                return iterator.end(function (err) {
                  callback(err, data)
                })
              }
              data.push({ key: key, value: value })
              process.nextTick(next)
            })
          }
      next()
    }

module.exports = {
    location       : location
  , cleanup        : cleanup
  , lastLocation   : lastLocation
  , setUp          : setUp
  , tearDown       : tearDown
  , collectEntries : collectEntries
}
