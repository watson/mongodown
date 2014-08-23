'use strict';

var test = require('tap').test;
var testCommon = require('./testCommon');
var MongoDOWN = require('./');

function factory (location) {
  return new MongoDOWN(location);
}

/*** compatibility with basic LevelDOWN API ***/

require('abstract-leveldown/abstract/leveldown-test').args(factory, test, testCommon)

require('abstract-leveldown/abstract/open-test').args(factory, test, testCommon)

require('abstract-leveldown/abstract/del-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/del-test').args(test)

require('abstract-leveldown/abstract/get-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/get-test').args(test)

require('abstract-leveldown/abstract/put-test').setUp(factory, test, testCommon)
require('abstract-leveldown/abstract/put-test').args(test)

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
