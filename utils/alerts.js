const config = require('../config')

const Logger = require('logplease')
const logger = Logger.create('alerts', { filename: config.alerts_log_path })

const log = function(i) {
  logger.warn(`${i.type}:${i.key}:${i.value}:${i.input}`)
}

const evaluate = function(i) {
  if (!config.alerts[i.type])
    return

  if (config.alerts[i.type].minimum && i.value <= config.alerts[i.type].minimum)
    log(i)

  if (config.alerts[i.type].maximum && i.value >= config.alerts[i.type].maximum)
    log(i)
}

module.exports = {
  evaluate: evaluate
}
