const request = require('request')
const Logger = require('logplease');
const logger = Logger.create('bin')

const argv = require('yargs').argv

const now = new Date().getTime()
const start = new Date().setTime(now - (1000 * 60 * 60 * 24))

const key = argv.key || 'ac.status'
logger.info(`Key: ${key}`)

request({
  url: 'https://growlab.space/api/' + key,
  qs: {
    start: start,
    end: now,
    token: argv.token
  },
  json: true
}, function(err, res, data) {
  if (err)
    console.log(err)

  let expect_off = false
  let start = null
  let duration = 0
  let count_on = 0
  let count_off = 0

  data.forEach((item, index) => {
    if (expect_off && item.value !== 0)
      logger.warn('expected off', item)

    if (item.value === 1) {
      count_on++
      expect_off = true
      start = item.timestamp

    } else if (item.value === 0) {

      count_off++

      if (start) {
	const secs = Math.round((item.timestamp - start) / 1000)
	duration += secs
      }

      expect_off = false
    }
  })

  logger.info(`On: ${count_on}`)
  logger.info(`Off: ${count_off}`)
  logger.info(`Duration (secs): ${duration}`)
})
