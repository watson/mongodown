# MongoDOWN

A drop-in replacement for
[LevelDOWN](https://github.com/rvagg/node-leveldown) that runs on
MongoDB. Can be used as a back-end for
[LevelUP](https://github.com/rvagg/node-levelup) rather than an actual
LevelDB store.

[![Build Status](https://travis-ci.org/watson/mongodown.png)](https://travis-ci.org/watson/mongodown)

## Installation

```
npm install mongodown
```

## Example

```javascript
var levelup = require('levelup');

// MondoDB Collection name defaults to 'mongodown'
var db = levelup('localhost/my-database', { db: require('mongodown') }); 

// OR pass custom MongoDB collection name
db = levelup('localhost/my-database', { db: require('mongodown'), collection:'People_C' });

db.put('name', 'Yuri Irsenovich Kim')
db.put('dob', '16 February 1941')
db.put('spouse', 'Kim Young-sook')
db.put('occupation', 'Clown')

db.readStream()
  .on('data', console.log)
  .on('close', function () { console.log('Show\'s over folks!') })
```

## Limitations

MongoDOWN does not support iterator snapshots

## License

MIT
