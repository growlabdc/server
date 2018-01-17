const config = require('../config')

if (config.test)
  return

const Logger = require('logplease')
const logger = Logger.create('notification')

const apn  = require('apn')

const THROTTLE_INTERVAL = 15 * 60 * 1000

let notifications = {}
let provider = new apn.Provider(config.notification.apn)

provider.on('error', function(err) {
  logger.error(err)
})

const sendNotification = (opts) => {
  if (!config.notification.device_tokens.length)
    return

  const throttle_cutoff = new Date(new Date().getTime() - THROTTLE_INTERVAL)

  if (notifications[opts.title] && notifications[opts.title] > throttle_cutoff)
    return

  let notification = new apn.Notification({
    alert: `${opts.title}:${opts.body}`,
    sound: 'chime.caf',
    topic: 'org.reactjs.native.example.growlab',
    payload: {
      'sender': 'node-apn',
    },
  })

  notifications[opts.title] = new Date()

  provider.send(notification, config.notification.device_tokens).then( (response) => {
    logger.info(`notification sent ${opts.title}`)
  })
}

module.exports = {
  sendNotification: sendNotification
}
