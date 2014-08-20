'use strict';

var util              = require('util');
var mongojs           = require('mongojs');
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN;

var MongoDown = module.exports = function (mongoUri) {
  if (!(this instanceof MongoDown))
    return new MongoDown(mongoUri);
  AbstractLevelDOWN.call(this, mongoUri);
};

util.inherits(MongoDown, AbstractLevelDOWN);

MongoDown.prototype._open = function (options, callback) {
  this._db = mongojs(this.location, ['mongodown']);
  process.nextTick(callback.bind(null, null, this));
};

MongoDown.prototype._close = function (callback) {
  this._db.close();
  process.nextTick(callback);
};

MongoDown.prototype._get = function (key, options, callback) {
  this._db.mongodown.findOne({ _id: key }, function (err, doc) {
    if (err) return callback(err);
    if (!doc) return callback(new Error('notFound'));
    callback(null, doc.value);
  });
};

MongoDown.prototype._put = function (key, value, options, callback) {
  this._db.mongodown.update({ _id: key, value: value }, { upsert: true }, callback);
};

MongoDown.prototype._del = function (key, options, callback) {
  this._db.mongodown.remove({ _id: key }, callback);
};

MongoDown.prototype._batch = function (array, options, callback) {
  var self = this,
      batches = [[]],
      batchIndex = 0,
      cmdIndex = 0,
      cmdLength = array.length,
      cmd, batch, prevType;

  // TODO: Does AbstractLevelDOWN take care of not calling _batch if array is
  // empty? If not we need to handle this:
  if (!cmdLength) return process.nextTick(callback);

  for (; cmdIndex < cmdLength; cmdIndex++) {
    cmd = array[cmdIndex];
    if (prevType && cmd.type !== prevType) batches[++batchIndex] = [cmd];
    else batches[batchIndex].push(cmd);
    prevType = cmd.type;
  }

  (function commit (err) {
    if (err) return callback(err);
    var batch = batches.shift();
    if (!batch) return callback();
    switch (batch[0].type) {
      case 'put':
        var docs = batch.map(function (e) { return { _id: e.key, value: e.value }; });
        self._db.mongodown.insert(docs, { upsert: true }, commit);
        break;
      case 'del':
        var keys = batch.map(function (e) { return e.key; });
        self._db.mongodown.remove({ _id: { $in: keys } }, commit);
        break;
      default: // TODO: Does AbstractLevelDOWN take care of this for us?
        callback(new Error('Unknown batch type: ' + batch[0].type));
    }
  })();
};
