const config = require('./config')
const leveldb = require('level')(config.level_db_path)
const lem = require('lem')
const lemdb = lem(leveldb)

const knex = require('knex')({
  client: 'mariasql',
  connection: config.maria_db_connection
})

module.exports = {
  leveldb: leveldb,
  lemdb: lemdb,
  knex: knex
}
