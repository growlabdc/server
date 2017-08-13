const config = require('../config')

const Logger = require('logplease')
const logger = Logger.create('alerts', { filename: config.alerts_log_path })

const sendNotification = require('./notification').sendNotification

const log = function(i) {
  logger.warn(`${i.type}:${i.data.key}:${i.data.value}:${i.input}`)

  if (config.notification) {
    sendNotification({
      title: i.type,
      body: i.data.value
    })
  }
}

const evaluate = function(i) {
  if (!config.alerts[i.type])
    return

  if (config.alerts[i.type].minimum && i.data.value <= config.alerts[i.type].minimum)
    log(i)

  if (config.alerts[i.type].maximum && i.data.value >= config.alerts[i.type].maximum)
    log(i)
  }
}

module.exports = {
  evaluate: evaluate
}
