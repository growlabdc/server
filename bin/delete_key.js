const level = require('level')
const config = require('../config')
const db = level(config.level_db_path)

const argv = require('yargs').argv

if (!argv.key)
  throw new Error('missing key --key')

db.del(argv.key, function(err) {
  if (err)
    console.log(err)

  console.log('done')
})
