const config = require('./config')
const leveldb = require('level')(config.level_db_path)
const lem = require('lem')
const lemdb = lem(leveldb)

module.exports = lemdb
